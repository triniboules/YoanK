// src/types.ts
export type Video = {
    id: string;             // Unique identifier for the video
    name: string;           // Name of the video
    youtubeId: string;      // YouTube ID for embedding the video
    description: string;    // Description of the video
    showLogo?: boolean;     // Optional property to show the logo
    logoPath?: string;      // Path for the logo image
    thumbnail: string;      // URL of the video thumbnail
    logoType?: string; // Make sure this is part of the interface
    position: number;       // Position for drag-and-drop functionality
};
