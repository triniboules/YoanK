import { browser } from '$app/environment';
import { db } from '$lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface LocationData {
    lat: number;
    lon: number;
    country: string;
    city: string;
    region?: string;
    timestamp: Date;
}

class LocationService {
    private static LOCATION_CACHE_KEY = 'user_location';
    private static LOCATION_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    async getLocation(userId: string): Promise<LocationData | null> {
        if (!browser) return null;

        try {
            // First, try to get location from Firestore
            const locationDoc = await getDoc(doc(db, 'users', userId, 'metadata', 'location'));
            const storedLocation = locationDoc.data() as LocationData | undefined;

            // If we have a recent location (less than 24h old), use it
            if (storedLocation && 
                (new Date().getTime() - storedLocation.timestamp.getTime()) < LocationService.LOCATION_CACHE_DURATION) {
                return storedLocation;
            }

            // If no recent location, try IP-based location as fallback
            const ipLocation = await this.getIpBasedLocation();
            if (ipLocation) {
                // Store the new location data
                await this.saveLocation(userId, ipLocation);
                return ipLocation;
            }

            return null;
        } catch (error) {
            console.error('Error getting location:', error);
            return null;
        }
    }

    private async getIpBasedLocation(): Promise<LocationData | null> {
        try {
            const response = await fetch('https://ip-api.com/json');
            const data = await response.json();
            
            return {
                lat: data.lat,
                lon: data.lon,
                country: data.country,
                city: data.city,
                region: data.regionName,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Error fetching IP-based location:', error);
            return null;
        }
    }

    async saveLocation(userId: string, locationData: LocationData): Promise<void> {
        try {
            await setDoc(doc(db, 'users', userId, 'metadata', 'location'), {
                ...locationData,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error saving location:', error);
        }
    }

    // Optional: Get precise location if user explicitly allows it
    async getPreciseLocation(): Promise<GeolocationCoordinates | null> {
        if (!browser || !navigator.geolocation) return null;

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });

            return position.coords;
        } catch (error) {
            console.error('Error getting precise location:', error);
            return null;
        }
    }
}

export const locationService = new LocationService();
