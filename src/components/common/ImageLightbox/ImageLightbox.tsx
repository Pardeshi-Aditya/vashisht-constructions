import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  alt: string;
}

export function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  alt,
}: ImageLightboxProps) {
  const handlePrev = useCallback(() => {
    onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 p-2 text-white/80 transition-colors hover:text-white"
            aria-label="Close lightbox"
          >
            <X size={28} strokeWidth={1.5} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 z-10 p-2 text-white/80 transition-colors hover:text-white sm:left-8"
                aria-label="Previous image"
              >
                <ChevronLeft size={32} strokeWidth={1.5} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 z-10 p-2 text-white/80 transition-colors hover:text-white sm:right-8"
                aria-label="Next image"
              >
                <ChevronRight size={32} strokeWidth={1.5} />
              </button>
            </>
          )}

          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            src={images[currentIndex]}
            alt={`${alt} - image ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />

          <p className="absolute bottom-6 text-xs tracking-widest text-white/50 uppercase">
            {currentIndex + 1} / {images.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
