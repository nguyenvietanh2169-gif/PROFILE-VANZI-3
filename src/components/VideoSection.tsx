import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { FadeIn } from './FadeIn';

export const VideoSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openVideo = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <section
      id="video-reel"
      className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 pt-20 pb-32 relative z-30 px-5 sm:px-8 md:px-10 border-b border-white/5"
    >
      {/* Background Glow */}
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20 md:mb-24 flex flex-col items-center">
          <FadeIn delay={0} y={40} as="span" className="text-xs font-semibold tracking-[0.35em] text-neon-orange uppercase mb-3 block">
            LIVE REEL
          </FadeIn>
          <FadeIn 
            delay={0.1} 
            y={40} 
            as="h2" 
            className="hero-heading font-black uppercase text-center text-[clamp(2.5rem,8vw,100px)] mb-4 leading-none"
          >
            PERFORMANCE VIDEO
          </FadeIn>
          <FadeIn delay={0.2} y={20}>
            <div className="w-16 h-[2px] bg-gradient-to-r from-neon-orange to-neon-cyan" />
          </FadeIn>
        </div>

        {/* Cinematic Video Card (Vertical 9:16 Layout) */}
        <FadeIn delay={0.3} y={40} as="div" className="w-full max-w-[280px] sm:max-w-[320px] relative">
          <div
            onClick={openVideo}
            className="relative w-full aspect-[9/16] overflow-hidden border border-white/10 group cursor-pointer shadow-2xl bg-[#121212] rounded-2xl"
          >
            {/* Glowing Backdrop Frame */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-orange rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000" />
            
            {/* Thumbnail Image */}
            <img
              src="/images/video-thumbnail.jpg"
              alt="DJ VANZI Live Show Reel"
              className="relative w-full h-full object-cover scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out brightness-[0.8] group-hover:brightness-100 rounded-2xl"
              draggable="false"
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-16 h-16 rounded-full bg-black/60 border border-neon-cyan text-neon-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:scale-110 group-hover:bg-neon-cyan group-hover:text-black group-hover:border-transparent transition-all duration-300">
                <Play size={22} className="fill-current ml-1" />
              </div>
            </div>

            {/* Cinematic details & tag overlay */}
            <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col justify-end items-start pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity gap-1.5">
              <span className="px-2 py-0.5 text-[8px] font-mono tracking-widest uppercase bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded">
                LIVE MOMENT
              </span>
              <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
                TIGER SHOW
              </h3>
            </div>

            {/* Ambient vignette shadow inside card */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none z-10 rounded-2xl" />

            {/* Corner Decorative details */}
            <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white/30 pointer-events-none group-hover:border-neon-cyan transition-colors" />
            <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-white/30 pointer-events-none group-hover:border-neon-cyan transition-colors" />
            <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-white/30 pointer-events-none group-hover:border-neon-orange transition-colors" />
            <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white/30 pointer-events-none group-hover:border-neon-orange transition-colors" />
          </div>
        </FadeIn>

      </div>

      {/* Full Screen Theater Lightbox Modal */}
      {isOpen && (
        <div
          onClick={closeVideo}
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300"
        >
          {/* Close button */}
          <button
            onClick={closeVideo}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 border border-white/10 hover:border-white/20 transition-all z-[110] cursor-pointer"
            aria-label="Close Video Player"
          >
            <X size={20} />
          </button>

          {/* Video Container (Vertical 9:16 aspect ratio) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[280px] sm:w-[330px] aspect-[9/16] bg-black border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] rounded-xl overflow-hidden"
          >
            <video
              src="/videos/performance.mp4"
              controls
              autoPlay
              className="w-full h-full object-cover focus:outline-none"
            />
          </div>
        </div>
      )}
    </section>
  );
};
