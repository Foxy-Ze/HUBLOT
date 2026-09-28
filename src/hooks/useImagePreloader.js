// src/hooks/useImagePreloader.js
import { useState, useEffect } from 'react';

export function useImagePreloader() {
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Glob all jpg/png frames inside assets/frames or public/assets/frames
    const frameModules = import.meta.glob('/public/assets/frames/*.{jpg,jpeg,png}', { eager: true, as: 'url' });
    
    // Sort keys alphabetically so ezgif-frame-001 comes before ezgif-frame-002
    const sortedKeys = Object.keys(frameModules).sort();
    const totalFrames = sortedKeys.length;

    if (totalFrames === 0) {
      console.error("Vite Glob: No frames detected! Check that your frames are inside /public/assets/frames/.");
      return;
    }

    let loadedCount = 0;
    const imgArray = [];

    sortedKeys.forEach((key, index) => {
      const img = new Image();
      img.src = frameModules[key];

      img.onload = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          setImages(imgArray);
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        console.error(`Failed to load asset from glob at: ${key}`);
        loadedCount++;
        if (loadedCount === totalFrames) {
          setImages(imgArray);
          setIsLoaded(true);
        }
      };

      imgArray[index] = img;
    });
  }, []);

  return { images, progress, isLoaded };
}