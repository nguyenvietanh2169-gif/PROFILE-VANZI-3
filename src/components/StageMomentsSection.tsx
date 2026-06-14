import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { FadeIn } from './FadeIn';

const SHOW_IMAGES = [
  "/gallery/show/IMG_0097.JPG",
  "/gallery/show/484809765_960371929623079_2202573474252920259_n.jpg",
  "/gallery/show/484890275_961088009551471_8778091926097455371_n.jpg",
  "/gallery/show/IMG_0098.JPG",
  "/gallery/show/484993629_959867376340201_3404273182109211280_n.jpg",
  "/gallery/show/485004195_960246179635654_450419896515082030_n.jpg",
  "/gallery/show/IMG_0100.JPG",
  "/gallery/show/485579790_960718872921718_4885328115208143225_n.jpg",
  "/gallery/show/485727424_3562261694068364_1764924610546573723_n.jpg",
  "/gallery/show/IMG_0103.JPG",
  "/gallery/show/IMG_1465.JPG",
  "/gallery/show/135552272_2504632613164616_2798930206340704749_n.jpg",
  "/gallery/show/IMG_5087.JPG"
];

// Aesthetic names and locations for each gig photo
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

export const StageMomentsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Scroll buttons
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = window.innerWidth * 0.4;
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
      behavior: 'smooth'
    });
  };

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
  }, [lightboxIndex]);

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? SHOW_IMAGES.length - 1 : prev - 1) : null));
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev !== null ? (prev === SHOW_IMAGES.length - 1 ? 0 : prev + 1) : null));
  };

  return (
    <section 
      id="stage-moments"
      className="relative py-24 sm:py-32 w-full overflow-hidden bg-[#0C0C0C] border-b border-white/5"
    >
      {/* Background Glows */}
      <div className="absolute top-1/2 left-[-10%] w-[400px] h-[400px] rounded-full bg-neon-orange/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-[350px] h-[350px] rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-3">
            <FadeIn delay={0} y={30} as="span" className="text-xs font-semibold tracking-[0.35em] text-neon-cyan uppercase block">
              Behind The Decks
            </FadeIn>
            <FadeIn delay={0.1} y={30} as="h2" className="hero-heading font-black text-4xl md:text-5xl uppercase tracking-tight leading-none">
              Stage Moments
            </FadeIn>
            <FadeIn delay={0.2} y={15}>
              <div className="w-16 h-[2.5px] bg-gradient-to-r from-neon-cyan to-neon-orange" />
            </FadeIn>
          </div>

          {/* Nav Buttons for Desktop */}
          <FadeIn delay={0.25} y={20} className="hidden md:flex gap-4" as="div">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center hover:bg-neon-cyan hover:text-black hover:border-transparent transition-all active:scale-95 cursor-pointer shadow-lg"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center hover:bg-neon-orange hover:text-black hover:border-transparent transition-all active:scale-95 cursor-pointer shadow-lg"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </FadeIn>
        </div>
      </div>

      {/* Layered Horizontal Scroll Container */}
      <div className="w-full relative px-4 md:px-8">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex flex-row overflow-x-auto whitespace-nowrap py-16 px-6 sm:px-12 md:px-20 scrollbar-none select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          } scroll-smooth`}
        >
          {SHOW_IMAGES.map((src, index) => {
            // Apply slight rotation & height offset to create a layered "stacked gig photos" vibe
            const rotationDegrees = (index % 4 === 0) ? -2.5 : (index % 4 === 1) ? 1.5 : (index % 4 === 2) ? -1 : 2.5;
            const translateY = (index % 3 === 0) ? 8 : (index % 3 === 1) ? -5 : 4;
            
            return (
              <div
                key={index}
                onClick={() => {
                  if (!isDragging) setLightboxIndex(index);
                }}
                style={{
                  transform: `rotate(${rotationDegrees}deg) translateY(${translateY}px)`,
                  willChange: 'transform, box-shadow',
                }}
                className="inline-block relative w-[240px] sm:w-[280px] md:w-[310px] aspect-[3/4] bg-[#121215] border border-white/5 p-3 pb-8 rounded-2xl shadow-xl hover:rotate-0 hover:-translate-y-6 hover:z-40 hover:scale-105 hover:shadow-[0_20px_45px_rgba(0,240,255,0.2)] hover:border-neon-cyan/40 hover:bg-[#16161c] transition-all duration-500 ease-out flex-shrink-0 -ml-8 sm:-ml-12 md:-ml-14 first:ml-0 group cursor-pointer"
              >
                {/* Photo frame */}
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#0a0a0c] mb-4">
                  <img
                    src={src}
                    alt={GIG_DETAILS[index]?.title || `Vanzi Gig ${index + 1}`}
                    className="w-full h-full object-cover brightness-[0.85] group-hover:brightness-100 transition-all duration-500"
                    draggable="false"
                  />
                </div>

                {/* Gig Details */}
                <div className="px-1 text-left flex flex-col pointer-events-none">
                  <span className="text-[10px] font-mono tracking-widest text-neon-orange uppercase mb-1">
                    {GIG_DETAILS[index]?.location || "Live Gig"}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold uppercase text-white/90 group-hover:text-neon-cyan transition-colors truncate">
                    {GIG_DETAILS[index]?.title || `Moments #${index + 1}`}
                  </h3>
                </div>
              </div>
            );
          })}
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
              src={SHOW_IMAGES[lightboxIndex]}
              alt={GIG_DETAILS[lightboxIndex]?.title}
              className="max-w-full max-h-[72vh] md:max-h-[75vh] object-contain"
            />
            {/* Lightbox Footer Caption */}
            <div className="w-full bg-[#121215] py-4 px-6 border-t border-white/5 text-left flex justify-between items-center">
              <div>
                <p className="text-[10px] font-mono tracking-widest text-neon-orange uppercase">
                  {GIG_DETAILS[lightboxIndex]?.location}
                </p>
                <h4 className="text-sm sm:text-base font-black uppercase text-white tracking-wide">
                  {GIG_DETAILS[lightboxIndex]?.title}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-white/40">
                {lightboxIndex + 1} / {SHOW_IMAGES.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
