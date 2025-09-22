import { useEffect } from "react";

export function usePreloadImages(imagePaths: string[]) {
  useEffect(() => {
    const images: HTMLImageElement[] = [];

    imagePaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      images.push(img);
    });

    // optional cleanup (not strictly needed)
    return () => {
      images.forEach((img) => {
        img.src = "";
      });
    };
  }, [imagePaths]);
}
