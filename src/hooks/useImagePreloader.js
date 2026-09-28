// src/hooks/useImagePreloader.js
import { useState, useEffect } from 'react';

export function useImagePreloader() {
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Find all frames inside /public/assets/Frames/
    const frameModules = import.meta.glob(
      '/public/assets/Frames/ezgif-frame-*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}'
    );

    // Sort keys alphabetically so ezgif-frame-001 comes before ezgif-frame-002
    const sortedKeys = Object.keys(frameModules).sort();
    const totalFrames = sortedKeys.length;

    if (totalFrames === 0) {
      console.error('Vite Glob: No frames detected in /public/assets/Frames/');
      setIsLoaded(true);
      return;
    }

    let loadedCount = 0;
    const imgArray = new Array(totalFrames);

    const checkComplete = () => {
      loadedCount++;
      setProgress(Math.round((loadedCount / totalFrames) * 100));
      if (loadedCount === totalFrames) {
        setImages(imgArray.filter(Boolean));
        setIsLoaded(true);
      }
    };

    sortedKeys.forEach((key, index) => {
      const img = new Image();
      // Strip '/public' from the start of the path so Vercel serves '/assets/Frames/...'
      const publicUrl = key.replace(/^\/public/, '');

      img.onload = () => {
        imgArray[index] = img;
        checkComplete();
      };

      img.onerror = () => {
        console.error(`Failed to load frame at: ${publicUrl}`);
        checkComplete();
      };

      img.src = publicUrl;
    });
  }, []);

  return { images, progress, isLoaded };
}