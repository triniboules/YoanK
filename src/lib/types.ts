import type { Timestamp } from 'firebase/firestore';

export interface Visit {
    id: string;
    userId: string;
    timestamp: Date;
    lat?: number | null;
    lon?: number | null;
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
        screenSize?: string;
        language?: string;
    };
    referrer?: string;
    path?: string;
    duration?: number;
    exitPage?: string;
    interactions?: {
        clicks: number;
        scrollDepth: number;
        timeOnPage: number;
    };
}

export interface PageMetrics {
    path: string;
    views: number;
    averageTimeOnPage: number;
    bounceRate: number;
    exitRate: number;
    interactions: {
        clicks: number;
        scrollDepth: number;
    };
}

export interface AnalyticsData {
    visits: Visit[];
    totalVisits: number;
    uniqueVisitors: number;
    countries: Map<string, number>;
    cities: Map<string, number>;
    devices: Map<string, number>;
    browsers: Map<string, number>;
    pageMetrics: Map<string, PageMetrics>;
    timeMetrics: {
        averageSessionDuration: number;
        bounceRate: number;
        peakHours: Map<number, number>;
        peakDays: Map<string, number>;
    };
    referrers: Map<string, number>;
    trends: {
        dailyVisits: Map<string, number>;
        weeklyVisits: Map<string, number>;
        monthlyVisits: Map<string, number>;
    };
}

export interface Video {
    id: string;
    description: string;
    name: string;
    logoType: string;
    position: number;
    showLogo: boolean;
    thumbnail: string;
    youtubeId: string;
    clickCount?: number;
    clicks?: Array<{
        userId: string;
        timestamp: Timestamp;
        duration?: number;
        completionRate?: number;
    }>;
    metrics?: {
        averageWatchTime: number;
        completionRate: number;
        engagementRate: number;
    };
}

export interface ClickStats {
    userId: string;
    timestamp: Date;
    elementId?: string;
    elementType?: string;
    path: string;
}

export interface UserSession {
    id: string;
    userId: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    pagesViewed: string[];
    interactions: {
        clicks: number;
        videos: {
            watched: string[];
            totalDuration: number;
        };
        downloads?: string[];
        forms?: {
            submitted: string[];
            abandoned: string[];
        };
    };
    device: Visit['device'];
    location: Visit['location'];
}

export interface DashboardFilters {
    dateRange: {
        start: Date;
        end: Date;
    };
    countries?: string[];
    devices?: string[];
    browsers?: string[];
    paths?: string[];
}
