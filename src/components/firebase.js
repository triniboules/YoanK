// Import necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { 
    getFirestore, doc, setDoc, Timestamp, arrayUnion, getDoc, 
    collection, getDocs, increment, addDoc, updateDoc, deleteDoc, 
    query, where, onSnapshot, limit, orderBy
} from 'firebase/firestore';

// Firebase configuration using environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
const db = getFirestore(app);

const COLLECTION_NAMES = {
    GRIDS: 'grids',
    VIDEOS: 'videos',
    HEADER: 'header'
};

// Cache for video grids
let gridCache = new Map();
let videosCache = new Map();

// Subscribe to grid updates
let gridUnsubscribe = null;
let videoUnsubscribe = null;

/**
 * Initialize real-time listeners for grids and videos
 */
export function initializeListeners() {
    // Unsubscribe from existing listeners
    if (gridUnsubscribe) gridUnsubscribe();
    if (videoUnsubscribe) videoUnsubscribe();

    // Listen to grids
    gridUnsubscribe = onSnapshot(
        collection(db, COLLECTION_NAMES.GRIDS),
        (snapshot) => {
            snapshot.docChanges().forEach(change => {
                const data = change.doc.data();
                if (change.type === 'removed') {
                    gridCache.delete(change.doc.id);
                } else {
                    gridCache.set(change.doc.id, {
                        id: change.doc.id,
                        name: data.name || '',
                        description: data.description || '',
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date()
                    });
                }
            });
        }
    );
}

/**
 * Subscribe to videos for a specific grid
 */
export function subscribeToGridVideos(gridId) {
    if (videoUnsubscribe) videoUnsubscribe();

    const videosQuery = query(
        collection(db, COLLECTION_NAMES.VIDEOS),
        where('gridId', '==', gridId),
        orderBy('position')
    );

    videoUnsubscribe = onSnapshot(videosQuery, (snapshot) => {
        snapshot.docChanges().forEach(change => {
            const data = change.doc.data();
            if (change.type === 'removed') {
                videosCache.delete(change.doc.id);
            } else {
                videosCache.set(change.doc.id, {
                    id: change.doc.id,
                    ...data,
                    showLogo: data.showLogo ?? false,
                    position: data.position ?? 0,
                    logoType: data.logoType || ''
                });
            }
        });
    });
}

/**
 * Get video grids from cache
 */
export function getVideoGrids() {
    return Array.from(gridCache.values());
}

/**
 * Get videos for a grid from cache
 */
export function getGridVideos(gridId) {
    return Array.from(videosCache.values())
        .filter(video => video.gridId === gridId)
        .sort((a, b) => (a.position || 0) - (b.position || 0));
}

/**
 * Creates a new video grid
 */
export async function createVideoGrid(name, description = '') {
    try {
        const gridData = {
            name,
            description,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const gridRef = await addDoc(collection(db, COLLECTION_NAMES.GRIDS), gridData);
        return gridRef.id;
    } catch (error) {
        console.error('Error creating video grid:', error);
        throw error;
    }
}

/**
 * Updates a video grid's metadata
 */
export async function updateVideoGrid(gridId, data) {
    try {
        const gridRef = doc(db, COLLECTION_NAMES.GRIDS, gridId);
        await updateDoc(gridRef, {
            ...data,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error updating video grid:', error);
        throw error;
    }
}

/**
 * Deletes a video grid (preserves videos)
 */
export async function deleteVideoGrid(gridId) {
    try {
        // Only delete the grid document
        await deleteDoc(doc(db, COLLECTION_NAMES.GRIDS, gridId));
        
        // Update all videos in this grid to have no grid
        const videosQuery = query(
            collection(db, COLLECTION_NAMES.VIDEOS), 
            where('gridId', '==', gridId)
        );
        const videoSnapshots = await getDocs(videosQuery);
        
        const updates = videoSnapshots.docs.map(doc => 
            updateDoc(doc.ref, { gridId: null })
        );
        await Promise.all(updates);
    } catch (error) {
        console.error('Error deleting video grid:', error);
        throw error;
    }
}

/**
 * Updates video positions in a grid
 */
export async function updateVideoPositions(updates) {
    try {
        const batch = db.batch();
        updates.forEach(({ id, position }) => {
            const videoRef = doc(db, COLLECTION_NAMES.VIDEOS, id);
            batch.update(videoRef, { position });
        });
        await batch.commit();
    } catch (error) {
        console.error('Error updating video positions:', error);
        throw error;
    }
}

/**
 * Creates a new video
 */
export async function createVideo(videoData) {
    try {
        const videoRef = await addDoc(collection(db, COLLECTION_NAMES.VIDEOS), videoData);
        return videoRef.id;
    } catch (error) {
        console.error('Error creating video:', error);
        throw error;
    }
}

/**
 * Updates a video
 */
export async function updateVideo(videoId, updates) {
    try {
        const videoRef = doc(db, COLLECTION_NAMES.VIDEOS, videoId);
        await updateDoc(videoRef, updates);
    } catch (error) {
        console.error('Error updating video:', error);
        throw error;
    }
}

/**
 * Deletes a video
 */
export async function deleteVideo(videoId) {
    try {
        await deleteDoc(doc(db, COLLECTION_NAMES.VIDEOS, videoId));
    } catch (error) {
        console.error('Error deleting video:', error);
        throw error;
    }
}

// Export necessary functions and objects
export { db, Timestamp, doc, collection, query, where };

/**
 * Fetches header click statistics from Firebase
 * @returns {Promise<{contactClicks: number, logoCenterClicks: number, logoLeftClicks: number}>}
 */
export async function fetchHeaderClicks() {
    try {
        const headerSnap = await getDocs(collection(db, COLLECTION_NAMES.HEADER));
        
        if (!headerSnap.empty) {
            const headerDoc = headerSnap.docs[0];
            const headerData = headerDoc.data();
            
            return {
                contactClicks: headerData.contactClicks || 0,
                logoCenterClicks: headerData.logoCenterClicks || 0,
                logoLeftClicks: headerData.logoLeftClicks || 0
            };
        }
        
        return {
            contactClicks: 0,
            logoCenterClicks: 0,
            logoLeftClicks: 0
        };
    } catch (error) {
        console.error('Error fetching header clicks:', error);
        throw error;
    }
}

/**
 * Records a video click event in Firebase
 * @param {string} videoId - The ID of the video that was clicked
 * @param {string} [userId='anonymous'] - The ID of the user who clicked
 * @returns {Promise<void>}
 */
export async function recordVideoClick(videoId, userId = 'anonymous') {
    try {
        const videoRef = doc(db, COLLECTION_NAMES.VIDEOS, videoId);
        await setDoc(videoRef, {
            clicks: arrayUnion({ 
                userId, 
                timestamp: Timestamp.now() 
            })
        }, { merge: true });
    } catch (error) {
        console.error('Error recording video click:', error);
        throw error;
    }
}

/**
 * Records a header click event in Firebase
 * @param {'contact' | 'logoCenter' | 'logoLeft'} type - The type of header element clicked
 * @param {string} userId - The ID of the user who clicked
 * @returns {Promise<void>}
 */
export async function recordHeaderClick(type, userId) {
    try {
        const docRef = doc(db, COLLECTION_NAMES.HEADER, type);
        await setDoc(docRef, {
            clicks: arrayUnion({
                timestamp: Timestamp.now(),
                userId
            })
        }, { merge: true });
    } catch (error) {
        console.error(`Error recording ${type} click:`, error);
        throw error;
    }
}

/**
 * @typedef {Object} Video
 * @property {string} id - Video ID
 * @property {string} name - Video name
 * @property {string} description - Video description
 * @property {string} youtubeId - YouTube video ID
 * @property {string} thumbnail - Thumbnail URL
 * @property {boolean} showLogo - Whether to show logo
 * @property {string} logoType - Type of logo to show
 * @property {number} position - Position in grid (0-8)
 * @property {string} gridId - ID of the grid this video belongs to
 */

/**
 * @typedef {Object} VideoGrid
 * @property {string} id - Grid ID
 * @property {string} name - Grid name
 * @property {string} description - Grid description
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * Fetches all video grids
 * @returns {Promise<VideoGrid[]>}
 */
export async function fetchVideoGrids() {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAMES.GRIDS));
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || '',
                description: data.description || '',
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date()
            };
        });
    } catch (error) {
        console.error('Error fetching video grids:', error);
        throw error;
    }
}

/**
 * Fetches videos for a specific grid
 * @param {string} gridId - Grid ID
 * @returns {Promise<Video[]>}
 */
export async function fetchGridVideos(gridId) {
    try {
        const videosQuery = query(
            collection(db, COLLECTION_NAMES.VIDEOS), 
            where('gridId', '==', gridId)
        );
        const querySnapshot = await getDocs(videosQuery);
        return querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
                showLogo: doc.data().showLogo ?? false,
                position: doc.data().position ?? 0,
                logoType: doc.data().logoType || ''
            }))
            .sort((a, b) => (a.position || 0) - (b.position || 0));
    } catch (error) {
        console.error('Error fetching grid videos:', error);
        throw error;
    }
}

/**
 * Fetches all videos not assigned to any grid
 * @returns {Promise<Video[]>}
 */
export async function fetchOrphanedVideos() {
    try {
        const videosQuery = query(
            collection(db, COLLECTION_NAMES.VIDEOS),
            where('gridId', '==', null)
        );
        const querySnapshot = await getDocs(videosQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            showLogo: doc.data().showLogo ?? false,
            position: doc.data().position ?? 0,
            logoType: doc.data().logoType || ''
        }));
    } catch (error) {
        console.error('Error fetching orphaned videos:', error);
        throw error;
    }
}
