import React, { useState, useEffect, useCallback } from 'react';
import { FadeIn } from './FadeIn';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageAssets } from '../utils/storage';
import type { GalleryImage } from '../utils/storage';

export const GallerySection: React.FC = () => {
  const [galleryImages] = useState<GalleryImage[]>(() => getImageAssets().gallery);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prevIndex) => {
      if (prevIndex === null) return null;
      return prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1;
    });
  }, [galleryImages.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prevIndex) => {
      if (prevIndex === null) return null;
      return prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1;
    });
  }, [galleryImages.length]);

  // Handle body scroll locking
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextImage, prevImage]);

  return (
    <section 
      id="gallery" 
      style={{
        background: 'linear-gradient(180deg, #646973 0%, #BBCCD7 100%)',
      }}
      className="text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20"
    >
      <div className="max-w-6xl mx-auto">
        <FadeIn 
          delay={0} 
          y={40} 
          as="h2" 
          className="font-black uppercase text-center text-[#0C0C0C] text-[clamp(3rem,12vw,160px)] mb-16 sm:mb-20 md:mb-28"
        >
          Gallery
        </FadeIn>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {galleryImages.map((img, i) => {
            const isTallCard = i === 1 || i === 4;
            return (
              <FadeIn
                key={i}
                delay={i * 0.08}
                y={30}
                className="w-full"
                as="div"
              >
                <div 
                  onClick={() => openLightbox(i)}
                  style={{
                    animationDelay: `${i * 0.45}s`
                  }}
                  className={`w-full ${
                    isTallCard ? 'aspect-[3/4]' : 'aspect-square'
                  } rounded-[24px] sm:rounded-[32px] overflow-hidden border border-[#0C0C0C]/10 relative group cursor-pointer bg-neutral-100 gallery-float`}
                >
                  {/* Subtle golden hover overlay */}
                  <div className="absolute inset-0 bg-[#E27E00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                  
                  {/* Visual dark overlay + text details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-6 text-left">
                    <span className="text-[#F2BF00] text-[10px] uppercase font-bold tracking-widest mb-1.5">
                      {img.category}
                    </span>
                    <h3 className="text-white text-lg sm:text-xl font-bold uppercase tracking-tight leading-tight">
                      {img.title}
                    </h3>
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Main Image */}
                  <img 
                    src={img.src} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8 md:p-12 cursor-zoom-out"
          >
            {/* Top Close Button */}
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/60 hover:text-white hover:bg-white/10 p-2.5 rounded-full transition-all cursor-pointer z-50 border border-white/10 backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Left */}
            <button 
              onClick={prevImage}
              className="absolute left-4 sm:left-8 text-white/60 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all cursor-pointer z-50 border border-white/10 backdrop-blur-md"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Navigation Right */}
            <button 
              onClick={nextImage}
              className="absolute right-4 sm:right-8 text-white/60 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all cursor-pointer z-50 border border-white/10 backdrop-blur-md"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Image Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[80vh] w-full flex flex-col items-center cursor-default"
            >
              <img 
                src={galleryImages[lightboxIndex].src} 
                alt={galleryImages[lightboxIndex].title} 
                className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
              
              {/* Caption metadata */}
              <div className="mt-4 sm:mt-6 text-center">
                <span className="text-[#F2BF00] text-xs uppercase font-bold tracking-widest">
                  {galleryImages[lightboxIndex].category}
                </span>
                <h4 className="text-white text-lg sm:text-2xl font-black uppercase tracking-wide mt-1">
                  {galleryImages[lightboxIndex].title}
                </h4>
                <p className="text-white/40 text-[10px] sm:text-xs font-mono mt-1">
                  {lightboxIndex + 1} / {galleryImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
