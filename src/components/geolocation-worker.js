// geolocation-worker.js

import { workerData } from 'worker_threads';

const handleInit = (data) => {
    if (typeof data === 'object' && data !== null) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords?.latitude;
                const lon = position.coords?.longitude;

                // You could send the coordinates back to the main thread
                postMessage({ type: 'locationSuccess', message: { lat, lon } });
            },
            (error) => {
                console.error('Geolocation error:', error);
                postMessage({ type: 'locationError', message: { error } });
            }
        );
    } else {
        // Handle the case when workerData is not an object
        console.log('Invalid data received from worker thread');
    }
}

export default function worker() {
    const init = async () => {
        await handleInit(workerData);
    }

    return new Promise((resolve) => {
        init().then(() => resolve());
    });
}
