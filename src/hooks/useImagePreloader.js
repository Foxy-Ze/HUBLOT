// src/hooks/useImagePreloader.js
import { useState, useEffect } from 'react';

export function useImagePreloader() {
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const frameModules = import.meta.glob(
      '/public/assets/Frames/ezgif-frame-*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}'
    );

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
      const publicUrl = key.replace(/^\/public/, '');

      img.onload = async () => {
        try {
          // Pre-decode image into GPU memory during loading screen to eliminate scroll stutter
          if ('decode' in img) {
            await img.decode();
          }
        } catch (e) {
          // Ignore decode fallback errors
        }
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