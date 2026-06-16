import React, { useRef, useEffect } from 'react';

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const targetOffset = useRef(0);
  const currentOffset = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;

      // Only calculate if the section is currently visible in the viewport
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) return;

      targetOffset.current = (window.scrollY - sectionTop + window.innerHeight) * 0.35;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial calculation

    // Smooth LERP animation loop running on GPU
    let animId: number;
    const tick = () => {
      const diff = targetOffset.current - currentOffset.current;
      
      // Only update when there's actual motion, conserving mobile CPU/battery when idle
      if (Math.abs(diff) > 0.05) {
        currentOffset.current += diff * 0.1; // Smooth LERP speed

        if (row1Ref.current) {
          row1Ref.current.style.transform = `translate3d(${currentOffset.current - 300}px, 0px, 0px)`;
        }
        if (row2Ref.current) {
          row2Ref.current.style.transform = `translate3d(${-(currentOffset.current + 600)}px, 0px, 0px)`;
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] py-20 sm:py-28 md:py-36 overflow-hidden w-full relative z-20"
    >
      <div className="flex flex-col gap-10 sm:gap-14 w-full">
        {/* Row 1: Moves RIGHT (translates offset - 300) - Displays Text */}
        <div className="overflow-hidden w-full flex">
          <div
            ref={row1Ref}
            style={{ willChange: 'transform' }}
            className="flex flex-row items-center whitespace-nowrap transition-none"
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <span
                key={`text-r1-${i}`}
                className="text-[clamp(2rem,7vw,85px)] font-black uppercase tracking-tighter text-white hover:text-white/80 mx-8 sm:mx-12 select-none transition-colors duration-300"
              >
                VANZI ON DA BEAT
              </span>
            ))}
          </div>
        </div>

        {/* Row 2: Moves LEFT (translates -(offset - 300)) - Displays Text */}
        <div className="overflow-hidden w-full flex">
          <div
            ref={row2Ref}
            style={{ willChange: 'transform' }}
            className="flex flex-row items-center whitespace-nowrap transition-none"
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <span
                key={`text-${i}`}
                className="text-[clamp(2rem,7vw,85px)] font-black uppercase tracking-tighter text-white hover:text-white/80 mx-8 sm:mx-12 select-none transition-colors duration-300"
              >
                VANZI ON DA BEAT
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
