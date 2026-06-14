import React, { useRef, useState, useEffect } from 'react';

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const calculatedOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.35;
      setOffset(calculatedOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
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
            style={{
              transform: `translateX(${offset - 300}px)`,
              willChange: 'transform',
            }}
            className="flex flex-row items-center whitespace-nowrap transition-transform duration-75 ease-out"
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
            style={{
              transform: `translateX(${-(offset - 300)}px)`,
              willChange: 'transform',
            }}
            className="flex flex-row items-center whitespace-nowrap transition-transform duration-75 ease-out"
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
