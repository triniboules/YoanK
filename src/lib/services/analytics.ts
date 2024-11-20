import { browser } from '$app/environment';
import { db } from '$lib/firebase';
import { collection, doc, getDocs, query, where, orderBy, limit, setDoc, Timestamp } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { locationService } from './location';

export interface VisitData {
    userId: string;
    timestamp: Date;
    location?: {
        lat: number;
        lon: number;
        country: string;
        city: string;
        region?: string;
    };
    device?: {
        type: string;
        browser: string;
        os: string;
    };
    referrer?: string;
    path: string;
}

export interface AnalyticsData {
    visits: VisitData[];
    totalVisits: number;
    uniqueVisitors: number;
    countries: Map<string, number>;
    cities: Map<string, number>;
    devices: Map<string, number>;
    browsers: Map<string, number>;
}

class AnalyticsService {
    private db: Firestore;
    private cache: Map<string, any> = new Map();
    private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

    constructor(db: Firestore) {
        this.db = db;
    }

    private async getDeviceInfo(): Promise<{ type: string; browser: string; os: string }> {
        if (!browser) return null;

        const ua = navigator.userAgent;
        const mobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
        
        return {
            type: mobile ? 'mobile' : 'desktop',
            browser: this.getBrowserInfo(ua),
            os: this.getOSInfo(ua)
        };
    }

    private getBrowserInfo(ua: string): string {
        if (ua.includes('Firefox/')) return 'Firefox';
        if (ua.includes('Chrome/')) return 'Chrome';
        if (ua.includes('Safari/')) return 'Safari';
        if (ua.includes('Edge/')) return 'Edge';
        if (ua.includes('MSIE') || ua.includes('Trident/')) return 'IE';
        return 'Other';
    }

    private getOSInfo(ua: string): string {
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac OS')) return 'MacOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Other';
    }

    async recordVisit(userId: string, path: string): Promise<void> {
        if (!browser) return;

        try {
            const [locationData, deviceInfo] = await Promise.all([
                locationService.getLocation(userId),
                this.getDeviceInfo()
            ]);

            const visitData: VisitData = {
                userId,
                timestamp: new Date(),
                location: locationData || undefined,
                device: deviceInfo,
                referrer: document.referrer || undefined,
                path
            };

            await setDoc(doc(collection(db, 'users', userId, 'visits')), {
                ...visitData,
                timestamp: Timestamp.fromDate(visitData.timestamp)
            });
            
            // Clear cache to ensure fresh data on next fetch
            this.cache.clear();
        } catch (error) {
            console.error('Error recording visit:', error);
        }
    }

    async getAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<AnalyticsData> {
        const cacheKey = `analytics_${timeframe}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const startDate = this.getStartDate(timeframe);
            const visits: VisitData[] = [];
            const countries = new Map<string, number>();
            const cities = new Map<string, number>();
            const devices = new Map<string, number>();
            const browsers = new Map<string, number>();
            const uniqueUsers = new Set<string>();

            const usersSnap = await getDocs(collection(this.db, 'users'));
            
            for (const userDoc of usersSnap.docs) {
                const visitsRef = collection(this.db, 'users', userDoc.id, 'visits');
                const visitsQuery = query(
                    visitsRef,
                    where('timestamp', '>=', Timestamp.fromDate(startDate)),
                    orderBy('timestamp', 'desc')
                );
                
                const visitsSnap = await getDocs(visitsQuery);
                
                visitsSnap.docs.forEach(doc => {
                    const data = doc.data();
                    const visit: VisitData = {
                        userId: userDoc.id,
                        timestamp: data.timestamp.toDate(),
                        location: data.location,
                        device: data.device,
                        referrer: data.referrer,
                        path: data.path
                    };

                    visits.push(visit);
                    uniqueUsers.add(visit.userId);

                    if (visit.location) {
                        countries.set(
                            visit.location.country,
                            (countries.get(visit.location.country) || 0) + 1
                        );
                        cities.set(
                            visit.location.city,
                            (cities.get(visit.location.city) || 0) + 1
                        );
                    }

                    if (visit.device) {
                        devices.set(
                            visit.device.type,
                            (devices.get(visit.device.type) || 0) + 1
                        );
                        browsers.set(
                            visit.device.browser,
                            (browsers.get(visit.device.browser) || 0) + 1
                        );
                    }
                });
            }

            const analyticsData: AnalyticsData = {
                visits,
                totalVisits: visits.length,
                uniqueVisitors: uniqueUsers.size,
                countries,
                cities,
                devices,
                browsers
            };

            this.cache.set(cacheKey, {
                timestamp: Date.now(),
                data: analyticsData
            });

            return analyticsData;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    }

    private getStartDate(timeframe: 'day' | 'week' | 'month' | 'year'): Date {
        const now = new Date();
        switch (timeframe) {
            case 'day':
                return new Date(now.setDate(now.getDate() - 1));
            case 'week':
                return new Date(now.setDate(now.getDate() - 7));
            case 'month':
                return new Date(now.setMonth(now.getMonth() - 1));
            case 'year':
                return new Date(now.setFullYear(now.getFullYear() - 1));
        }
    }
}

export const analyticsService = new AnalyticsService(db);
