// videos.ts
export const fetchVideos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "videos"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        description: doc.data().description || '',
        name: doc.data().name || '',
        thumbnail: doc.data().thumbnail || '',
        youtubeId: doc.data().youtubeId || '',
        position: typeof doc.data().position === 'number' ? doc.data().position : 0,
        showLogo: typeof doc.data().showLogo === 'boolean' ? doc.data().showLogo : false,
        logoType: doc.data().logoType || '', // Ensure that logoType can be an empty string, not undefined
        clickCount: typeof doc.data().clickCount === 'number' ? doc.data().clickCount : 0,
        clicks: Array.isArray(doc.data().clicks) ? doc.data().clicks : []
      })) as Video[];
    } catch (error) {
      console.error("Error fetching videos: ", error);
    }
  };