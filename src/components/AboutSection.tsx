import React, { useState } from 'react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { getAboutContent, getImageAssets, getEPK } from '../utils/storage';
import type { AboutContent } from '../utils/storage';
import { Download } from 'lucide-react';

interface AboutSectionProps {
  lang: 'vi' | 'en';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const [content] = useState<AboutContent>(getAboutContent);
  const [avatar] = useState<string>(() => getImageAssets().avatar);

  const handleDownloadEPK = () => {
    const customLink = getEPK();
    if (customLink) {
      if (customLink.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = customLink;
        link.download = 'VANZI_PressKit_EPK';
        
        const match = customLink.match(/data:([^;]+);/);
        if (match) {
          const mime = match[1];
          if (mime === 'application/pdf') link.download += '.pdf';
          else if (mime === 'application/zip' || mime === 'application/x-zip-compressed') link.download += '.zip';
          else if (mime.startsWith('image/')) link.download += `.${mime.split('/')[1]}`;
          else link.download += '.bin';
        } else {
          link.download += '.zip';
        }
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(customLink, '_blank');
      }
    } else {
      const epkText = `DJ VANZI - OFFICIAL PRESS KIT (EPK)
=====================================
Tên thật / Real Name: ${content.realName}
Ngày sinh / Date of Birth: ${content.dob}
Sở trường / Specialties: ${lang === 'vi' ? content.genres : (content.genresEn || content.genres)}

TIỂU SỬ / BIOGRAPHY:
--------------------
${lang === 'vi' ? content.bio : (content.bioEn || content.bio)}

LIÊN HỆ ĐẶT LỊCH / BOOKING INQUIRIES:
------------------------------------
Vui lòng gửi email hoặc gọi điện trực tiếp qua thông tin liên hệ ở cuối Website.
Please send booking inquiries to the contact email displayed at the footer of the website.
`;
      const blob = new Blob([epkText], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'VANZI_EPK_Bio.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const bioText = lang === 'vi' ? content.bio : (content.bioEn || content.bio);
  const genresText = lang === 'vi' ? content.genres : (content.genresEn || content.genres);

  return (
    <section 
      id="about" 
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-20 bg-[#0C0C0C] text-center overflow-hidden"
    >
      {/* 1. Absolute Decorative 3D Images */}
      {/* Top-Left Moon -> Orange Balloon Letter K */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-0 pointer-events-none md:pointer-events-auto select-none w-[120px] sm:w-[160px] md:w-[210px]"
        as="div"
      >
        <img 
          src="/about-k.png" 
          alt="Orange Balloon Letter K" 
          className="w-full h-auto rotate-[-12deg] transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-3 hover:rotate-6 cursor-pointer"
          draggable="false"
        />
      </FadeIn>

      {/* Bottom-Left 3D Object -> Blue Glass Headphones */}
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[2.5%] md:bottom-[8%] left-[-15px] sm:left-[6%] md:left-[10%] z-0 pointer-events-none md:pointer-events-auto select-none w-[115px] sm:w-[150px] md:w-[210px]"
        as="div"
      >
        <img 
          src="/about-headphones.png" 
          alt="Blue Glass Headphones" 
          className="w-full h-auto rotate-[15deg] transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-3 hover:rotate-[30deg] cursor-pointer"
          draggable="false"
        />
      </FadeIn>

      {/* Top-Right Lego -> Pink Metallic Spring Coil */}
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-0 pointer-events-none md:pointer-events-auto select-none w-[120px] sm:w-[160px] md:w-[210px]"
        as="div"
      >
        <img 
          src="/about-coil.png" 
          alt="Pink Metallic Spring Coil" 
          className="w-full h-auto transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-3 hover:rotate-6 cursor-pointer"
          draggable="false"
        />
      </FadeIn>

      {/* Bottom-Right 3D Group -> Yellow Glass Lightning Bolt */}
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[2.5%] md:bottom-[8%] right-[-55px] sm:right-[6%] md:right-[10%] z-0 pointer-events-none md:pointer-events-auto select-none w-[190px] sm:w-[250px] md:w-[350px]"
        as="div"
      >
        <img 
          src="/about-lightning.png" 
          alt="Yellow Glass Lightning Bolt" 
          className="w-full h-auto transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-3 hover:rotate-[-6deg] cursor-pointer"
          draggable="false"
        />
      </FadeIn>

      {/* 2. Content Block */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 max-w-6xl z-10 w-full mt-10 lg:mt-0">
        {/* Left Column: Portrait Card */}
        <FadeIn
          delay={0.1}
          y={40}
          className="w-full lg:w-1/2 max-w-[220px] sm:max-w-[280px] flex justify-center"
          as="div"
        >
          <div className="w-full aspect-[4/5] relative group">
            {/* Ambient gold glow behind the card */}
            <div className="absolute -inset-3 bg-gradient-to-tr from-[#F2BF00]/30 to-[#E27E00]/35 rounded-[24px] sm:rounded-[32px] blur-lg opacity-35 group-hover:opacity-65 transition-opacity duration-500 z-0" />
            
            {/* Card Container with overflow hidden */}
            <div className="w-full h-full rounded-[24px] sm:rounded-[32px] border-2 border-[#D7E2EA]/10 overflow-hidden shadow-2xl relative z-10 bg-[#16161a]">
              <img 
                src={avatar} 
                alt="Vanzi Artist Portrait" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </FadeIn>

        {/* Right Column: Text Info */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2">
          <FadeIn 
            delay={0} 
            y={40} 
            as="h2" 
            className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2.5rem,7vw,90px)]"
          >
            {lang === 'vi' ? 'Giới thiệu' : 'About me'}
          </FadeIn>

          {/* Gap between heading and paragraph */}
          <div className="h-6 sm:h-8 md:h-10" />

          {bioText && (
            <AnimatedText
              key={bioText}
              text={bioText}
              className="text-[#D7E2EA] font-medium leading-relaxed max-w-[480px] text-[clamp(0.95rem,1.8vw,1.25rem)]"
            />
          )}

          {/* Metadata info */}
          <FadeIn delay={0.3} y={30} className="mt-8 flex flex-col gap-3 items-center lg:items-start text-left w-full">
            <div className="text-[#D7E2EA]/60 text-xs sm:text-sm uppercase tracking-widest font-mono">
              {lang === 'vi' ? 'Tên thật:' : 'Real name:'} <span className="text-[#D7E2EA] font-bold tracking-normal font-sans ml-1">{content.realName}</span>
            </div>
            <div className="text-[#D7E2EA]/60 text-xs sm:text-sm uppercase tracking-widest font-mono">
              {lang === 'vi' ? 'Ngày sinh:' : 'Date of birth:'} <span className="text-[#D7E2EA] font-bold tracking-normal font-sans ml-1">{content.dob}</span>
            </div>
            {genresText && (
              <div className="text-[#D7E2EA]/60 text-xs sm:text-sm uppercase tracking-widest font-mono">
                {lang === 'vi' ? 'Sở trường:' : 'Specialties:'} <span className="text-[#F2BF00] font-semibold tracking-normal font-sans ml-1">{genresText}</span>
              </div>
            )}
            
            {/* Press Kit Download Button */}
            <button 
              onClick={handleDownloadEPK}
              className="mt-6 flex items-center justify-center gap-2 bg-white/5 hover:bg-[#F2BF00] border border-white/10 hover:border-transparent text-white hover:text-black text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-2xl transition-all duration-300 shadow active:scale-95"
            >
              <Download className="w-4 h-4" />
              {lang === 'vi' ? 'Tải Press Kit (EPK)' : 'Download Press Kit (EPK)'}
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
