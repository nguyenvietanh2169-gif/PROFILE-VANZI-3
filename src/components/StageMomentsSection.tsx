import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { getImageAssets } from '../utils/storage';

// Aesthetic names and locations for each gig photo (still used in Lightbox modal)
const GIG_DETAILS = [
  { title: "Main Stage Energy", location: "Hanoi Club Tour" },
  { title: "Neon Nights", location: "Tiger Show" },
  { title: "Bassline drop", location: "Warehouse Session" },
  { title: "Crowd connection", location: "Live Set Tour" },
  { title: "Techno Chronicles", location: "Midnight Gigs" },
  { title: "Visual Symphony", location: "Electronic Stage" },
  { title: "Rhythm & Lights", location: "Techno Fest" },
  { title: "Sound Control", location: "Private Event" },
  { title: "Euphoric Beats", location: "Kaizen Club" },
  { title: "Synthesizer Wave", location: "Hanoi Show" },
  { title: "Subwoofer Therapy", location: "Outdoor Festival" },
  { title: "Glow Generation", location: "Showcase 2026" },
  { title: "Closing Set", location: "Retro Stadium" }
];

// Split photos into two rows and duplicate them twice for a rich, scrollable list

export const StageMomentsSection: React.FC = () => {
  const [showImages] = useState<string[]>(() => getImageAssets().stageMoments);

  // Distribute indices to row1 and row2
  const row1Indices: number[] = [];
  const row2Indices: number[] = [];
  showImages.forEach((_, idx) => {
    if (idx % 2 === 0) {
      row1Indices.push(idx);
    } else {
      row2Indices.push(idx);
    }
  });

  // Repeat the images to make a rich scrollable list
  const row1Items = row1Indices.length > 0 ? [...row1Indices, ...row1Indices, ...row1Indices] : [];
  const row2Items = row2Indices.length > 0 ? [...row2Indices, ...row2Indices, ...row2Indices] : [];

  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const [row1Dragging, setRow1Dragging] = useState(false);
  const [row2Dragging, setRow2Dragging] = useState(false);

  // Parallax / Translation offsets
  const targetX1 = useRef(0);
  const currentX1 = useRef(0);

  const targetX2 = useRef(0);
  const currentX2 = useRef(0);

  const maxTravel1 = useRef(0);
  const maxTravel2 = useRef(0);

  const activeDrag = useRef<'row1' | 'row2' | null>(null);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const dragHasMoved = useRef(false);
  
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? showImages.length - 1 : prev - 1) : null));
  }, [showImages.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev === showImages.length - 1 ? 0 : prev + 1) : null));
  }, [showImages.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNext, handlePrev]);

  // Update widths for scroll limits
  const updateWidths = () => {
    if (row1Ref.current && row2Ref.current) {
      maxTravel1.current = Math.max(0, row1Ref.current.scrollWidth - row1Ref.current.parentElement!.clientWidth);
      maxTravel2.current = Math.max(0, row2Ref.current.scrollWidth - row2Ref.current.parentElement!.clientWidth);
    }
  };

  // Drag Gesture Handlers
  const handleDragStart = (row: 'row1' | 'row2', clientX: number) => {
    activeDrag.current = row;
    dragStartX.current = clientX;
    dragHasMoved.current = false;
    
    updateWidths();

    if (row === 'row1') {
      setRow1Dragging(true);
      dragStartOffset.current = targetX1.current;
    } else {
      setRow2Dragging(true);
      dragStartOffset.current = targetX2.current;
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!activeDrag.current) return;
    const deltaX = clientX - dragStartX.current;
    
    if (Math.abs(deltaX) > 5) {
      dragHasMoved.current = true;
    }

    const nextOffset = dragStartOffset.current + deltaX;

    if (activeDrag.current === 'row1') {
      const clamped = Math.max(-maxTravel1.current, Math.min(0, nextOffset));
      targetX1.current = clamped;

      if (maxTravel1.current > 0 && maxTravel2.current > 0) {
        const ratio = -clamped / maxTravel1.current;
        targetX2.current = -((1 - ratio) * maxTravel2.current);
      }
    } else {
      const clamped = Math.max(-maxTravel2.current, Math.min(0, nextOffset));
      targetX2.current = clamped;

      if (maxTravel1.current > 0 && maxTravel2.current > 0) {
        const ratio = -clamped / maxTravel2.current;
        targetX1.current = -((1 - ratio) * maxTravel1.current);
      }
    }
  };

  const handleDragEnd = () => {
    activeDrag.current = null;
    setRow1Dragging(false);
    setRow2Dragging(false);
  };

  // Window-level move and end listeners to make dragging robust
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      handleDragMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDragMove(e.touches[0].clientX);
      }
    };
    const handleEnd = () => {
      handleDragEnd();
    };

    if (row1Dragging || row2Dragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('touchcancel', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [row1Dragging, row2Dragging]);

  // Main tick loop for LERP interpolation and event handlers
  useEffect(() => {
    updateWidths();
    window.addEventListener('resize', updateWidths);

    // Initial positioning of Row 2 at the far right
    const initTimer = setTimeout(() => {
      updateWidths();
      targetX2.current = -maxTravel2.current;
      currentX2.current = -maxTravel2.current;
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translate3d(${-maxTravel2.current}px, 0px, 0px)`;
      }
    }, 150);

    let animId: number;
    const tick = () => {
      const diff1 = targetX1.current - currentX1.current;
      const diff2 = targetX2.current - currentX2.current;

      if (Math.abs(diff1) > 0.05) {
        currentX1.current += diff1 * 0.15; // Smooth interpolation speed
        if (row1Ref.current) {
          row1Ref.current.style.transform = `translate3d(${currentX1.current}px, 0px, 0px)`;
        }
      }
      if (Math.abs(diff2) > 0.05) {
        currentX2.current += diff2 * 0.15;
        if (row2Ref.current) {
          row2Ref.current.style.transform = `translate3d(${currentX2.current}px, 0px, 0px)`;
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', updateWidths);
      cancelAnimationFrame(animId);
      clearTimeout(initTimer);
    };
  }, []);

  // Trackpad / Scroll Wheel Swipe Support
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleWheelEvent = (e: WheelEvent) => {
      // If horizontal swipe is dominant, prevent vertical page scroll and translate rows
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        updateWidths();
        const nextOffset = targetX1.current - e.deltaX;
        const clamped = Math.max(-maxTravel1.current, Math.min(0, nextOffset));
        
        targetX1.current = clamped;
        if (maxTravel1.current > 0 && maxTravel2.current > 0) {
          const ratio = -clamped / maxTravel1.current;
          targetX2.current = -((1 - ratio) * maxTravel2.current);
        }
      }
    };

    section.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => {
      section.removeEventListener('wheel', handleWheelEvent);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="stage-moments"
      className="relative py-24 sm:py-32 w-full overflow-hidden bg-[#0C0C0C] border-b border-white/5"
    >
      {/* Background Glows */}
      <div className="absolute top-1/2 left-[-10%] w-[400px] h-[400px] rounded-full bg-neon-orange/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-[350px] h-[350px] rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        {/* Section Header */}
        <div className="flex flex-col justify-start gap-6 mb-8">
          <div className="space-y-3">
            <FadeIn delay={0} y={30} as="h2" className="hero-heading font-black text-4xl md:text-5xl uppercase tracking-tight leading-none">
              Stage Moments
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Layered Horizontal Scroll Container */}
      <div className="w-full relative flex flex-col gap-6 md:gap-8 overflow-hidden py-4">
        
        {/* Row 1: Manual Drag to Scroll */}
        <div className="w-full overflow-hidden px-6 sm:px-12 md:px-20 select-none">
          <div
            ref={row1Ref}
            onMouseDown={(e) => handleDragStart('row1', e.clientX)}
            onTouchStart={(e) => handleDragStart('row1', e.touches[0].clientX)}
            onDragStart={(e) => e.preventDefault()}
            style={{ willChange: 'transform' }}
            className={`flex flex-row gap-6 sm:gap-8 md:gap-10 whitespace-nowrap transition-none select-none w-max ${
              row1Dragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {row1Items.map((imageIndex, index) => {
              const src = showImages[imageIndex];
              if (!src) return null;

              return (
                <div
                  key={`r1-${index}`}
                  onClick={() => {
                    if (!dragHasMoved.current) setLightboxIndex(imageIndex);
                  }}
                  onDragStart={(e) => e.preventDefault()}
                  className="inline-block relative w-[180px] sm:w-[220px] md:w-[260px] aspect-[3/4] bg-[#121215] border border-white/5 p-2 rounded-2xl shadow-xl hover:-translate-y-2 hover:z-40 hover:scale-105 hover:shadow-[0_20px_45px_rgba(0,240,255,0.2)] hover:border-neon-cyan/40 hover:bg-[#16161c] transition-all duration-500 ease-out flex-shrink-0 group cursor-pointer select-none"
                >
                  {/* Photo frame */}
                  <div className="w-full h-full rounded-xl overflow-hidden bg-[#0a0a0c] pointer-events-none select-none">
                    <img
                      src={src}
                      alt={`Vanzi Gig ${imageIndex + 1}`}
                      className="w-full h-full object-cover brightness-[0.85] group-hover:brightness-100 transition-all duration-500 pointer-events-none select-none"
                      draggable="false"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: Manual Drag to Scroll */}
        <div className="w-full overflow-hidden px-6 sm:px-12 md:px-20 select-none">
          <div
            ref={row2Ref}
            onMouseDown={(e) => handleDragStart('row2', e.clientX)}
            onTouchStart={(e) => handleDragStart('row2', e.touches[0].clientX)}
            onDragStart={(e) => e.preventDefault()}
            style={{ willChange: 'transform' }}
            className={`flex flex-row gap-6 sm:gap-8 md:gap-10 whitespace-nowrap transition-none select-none w-max ${
              row2Dragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {row2Items.map((imageIndex, index) => {
              const src = showImages[imageIndex];
              if (!src) return null;

              return (
                <div
                  key={`r2-${index}`}
                  onClick={() => {
                    if (!dragHasMoved.current) setLightboxIndex(imageIndex);
                  }}
                  onDragStart={(e) => e.preventDefault()}
                  className="inline-block relative w-[180px] sm:w-[220px] md:w-[260px] aspect-[3/4] bg-[#121215] border border-white/5 p-2 rounded-2xl shadow-xl hover:-translate-y-2 hover:z-40 hover:scale-105 hover:shadow-[0_20px_45px_rgba(0,240,255,0.2)] hover:border-neon-cyan/40 hover:bg-[#16161c] transition-all duration-500 ease-out flex-shrink-0 group cursor-pointer select-none"
                >
                  {/* Photo frame */}
                  <div className="w-full h-full rounded-xl overflow-hidden bg-[#0a0a0c] pointer-events-none select-none">
                    <img
                      src={src}
                      alt={`Vanzi Gig ${imageIndex + 1}`}
                      className="w-full h-full object-cover brightness-[0.85] group-hover:brightness-100 transition-all duration-500 pointer-events-none select-none"
                      draggable="false"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 bg-black/98 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 border border-white/10 hover:border-white/20 transition-all z-[110] cursor-pointer rounded-full bg-black/50"
            aria-label="Close Gallery"
          >
            <X size={22} />
          </button>

          {/* Navigation Controls inside modal */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-black/40 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-90 cursor-pointer z-10"
            aria-label="Previous Image"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-black/40 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-90 cursor-pointer z-10"
            aria-label="Next Image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Center Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-full max-h-[80vh] aspect-auto border border-white/10 shadow-2xl flex flex-col items-center bg-[#0a0a0c] rounded-xl overflow-hidden"
          >
            <img
              src={showImages[lightboxIndex]}
              alt={GIG_DETAILS[lightboxIndex]?.title || "Stage Moment"}
              className="max-w-full max-h-[72vh] md:max-h-[75vh] object-contain"
            />
            {/* Lightbox Footer Caption */}
            <div className="w-full bg-[#121215] py-4 px-6 border-t border-white/5 text-left flex justify-between items-center">
              <div>
                <p className="text-[10px] font-mono tracking-widest text-neon-orange uppercase">
                  {GIG_DETAILS[lightboxIndex]?.location || "Live Set"}
                </p>
                <h4 className="text-sm sm:text-base font-black uppercase text-white tracking-wide">
                  {GIG_DETAILS[lightboxIndex]?.title || "Stage Moment"}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-white/40">
                {lightboxIndex + 1} / {showImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
