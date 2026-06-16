import React, { useState } from 'react';
import { FadeIn } from './FadeIn';
import { MagnetWithPendant } from './MagnetWithPendant';
import { getHeroContent } from '../utils/storage';
import type { HeroContent } from '../utils/storage';

interface HeroSectionProps {
  lang: 'vi' | 'en';
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const navLinks = lang === 'vi' 
    ? ["Giới thiệu", "Thư viện", "Lịch diễn", "Video", "Liên hệ"] 
    : ["About", "Gallery", "Gigs", "Video", "Contact"];
    
  const [content] = useState<HeroContent>(getHeroContent);

  const getSectionId = (link: string) => {
    if (link === 'About' || link === 'Giới thiệu') return 'about';
    if (link === 'Gallery' || link === 'Thư viện') return 'gallery';
    if (link === 'Gigs' || link === 'Lịch diễn') return 'gigs';
    if (link === 'Video') return 'video-reel';
    return 'booking-form';
  };

  const handleLinkClick = (link: string) => {
    const elementId = getSectionId(link);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentTitle = lang === 'vi' ? (content.title || "Hi, i'm vanzi") : (content.titleEn || content.title || "Hi, i'm vanzi");
  const currentDesc = lang === 'vi' ? (content.description || "") : (content.descriptionEn || content.description || "");

  return (
    <section className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0C0C0C]">
      {/* 1. Navbar */}
      <FadeIn 
        delay={0} 
        y={-20} 
        as="nav" 
        className="w-full flex justify-between items-center px-4 sm:px-6 md:px-10 pt-6 md:pt-8 z-30"
      >
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${getSectionId(link)}`}
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick(link);
            }}
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-[11px] sm:text-sm md:text-lg lg:text-[1.35rem] transition-opacity duration-200 hover:opacity-70"
          >
            {link}
          </a>
        ))}
      </FadeIn>

      {/* 2. Hero Heading */}
      <div className="w-full overflow-hidden flex justify-center items-center z-20 mt-20 sm:mt-12 md:-mt-5">
        <FadeIn 
          delay={0.15} 
          y={40} 
          as="h1" 
          className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[12vw] sm:text-[13vw] md:text-[14vw] lg:text-[15.5vw]"
        >
          {currentTitle}
        </FadeIn>
      </div>

      {/* 3. Hero Portrait Image */}
      <FadeIn
        delay={0.6}
        y={30}
        className="absolute left-1/2 z-10 w-[330px] sm:w-[410px] md:w-[490px] lg:w-[570px] top-1/2 md:top-auto md:bottom-10"
        as="div"
      >
        <div className="w-full h-full -translate-x-1/2 -translate-y-1/2 md:translate-y-0">
          <MagnetWithPendant
            padding={150}
            strength={3}
          />
        </div>
      </FadeIn>

      {/* 4. Bottom Bar */}
      <div className="w-full flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 z-20 mt-auto">
        <FadeIn 
          delay={0.35} 
          y={20} 
          as="p" 
          className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-left max-w-[160px] sm:max-w-[220px] md:max-w-[260px] text-[clamp(0.75rem,1.4vw,1.5rem)]"
        >
          {currentDesc}
        </FadeIn>
      </div>
    </section>
  );
};
