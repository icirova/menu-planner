import { useCallback, useEffect, useState } from "react";

export const useLightbox = (itemCount) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const openLightbox = useCallback((index) => setLightboxIndex(index), []);
  const showPrevious = useCallback(() => {
    setLightboxIndex((index) => (index === 0 ? itemCount - 1 : index - 1));
  }, [itemCount]);
  const showNext = useCallback(() => {
    setLightboxIndex((index) => (index === itemCount - 1 ? 0 : index + 1));
  }, [itemCount]);

  useEffect(() => {
    if (lightboxIndex === null || itemCount === 0) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeLightbox, itemCount, lightboxIndex, showNext, showPrevious]);

  return {
    closeLightbox,
    lightboxIndex,
    openLightbox,
    showNext,
    showPrevious,
  };
};
