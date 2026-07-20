import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { CmsImage } from '@/components/common/CmsImage';

interface ProjectGalleryProps {
  images: string[];
  projectName: string;
}

export function ProjectGallery({ images, projectName }: ProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {images.map((image, index) => (
          <motion.button
            key={image}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            onClick={() => openLightbox(index)}
            className="group relative aspect-[4/3] overflow-hidden bg-stone"
            aria-label={`View ${projectName} image ${index + 1}`}
          >
            <CmsImage
              src={image}
              alt={`${projectName} gallery image ${index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </motion.button>
        ))}
      </div>

      <ImageLightbox
        images={images}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentIndex}
        alt={projectName}
      />
    </>
  );
}
