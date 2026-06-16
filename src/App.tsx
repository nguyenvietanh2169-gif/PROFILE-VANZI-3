import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { MusicPlayerSection } from './components/MusicPlayerSection';
import { MarqueeSection } from './components/MarqueeSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { VideoSection } from './components/VideoSection';
import { StageMomentsSection } from './components/StageMomentsSection';
import { GigsSection } from './components/GigsSection';
import { BookingFormSection } from './components/BookingFormSection';
import { ArrowUpRight, Facebook, Instagram, Settings, Globe } from 'lucide-react';
import { FadeIn } from './components/FadeIn';
import { AdminSection } from './components/AdminSection';
import { incrementPageView, incrementUniqueVisitor, getSocialLinks } from './utils/storage';

const TikTokIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [socialLinks] = useState(getSocialLinks);
  const [lang, setLang] = useState<'vi' | 'en'>(() => (localStorage.getItem('vanzi_lang') as 'vi' | 'en') || 'vi');

  const toggleLanguage = () => {
    const nextLang = lang === 'vi' ? 'en' : 'vi';
    setLang(nextLang);
    localStorage.setItem('vanzi_lang', nextLang);
  };

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    
    // Log traffic stats on load if not viewing admin panel
    if (window.location.hash !== '#admin') {
      incrementPageView();
      incrementUniqueVisitor();
    }
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentHash === '#admin') {
    return <AdminSection />;
  }
  return (
    <div className="bg-[#0C0C0C] text-[#D7E2EA] w-full min-h-screen overflow-x-clip select-none font-sans relative">
      
      {/* Floating Language Switcher Toggle */}
      <div className="fixed top-6 right-6 z-[90]">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 bg-[#141416]/80 hover:bg-white hover:text-black border border-[#D7E2EA]/10 hover:border-white/20 backdrop-blur-md px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#D7E2EA] transition-all duration-300 shadow-2xl active:scale-95 group"
          title={lang === 'vi' ? 'Chuyển sang Tiếng Anh' : 'Switch to Vietnamese'}
        >
          <Globe className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
        </button>
      </div>

      {/* 1. Hero Section */}
      <HeroSection lang={lang} />

      {/* 1.5. Studio Music Player Section */}
      <MusicPlayerSection />

      {/* 2. Marquee Section */}
      <MarqueeSection />

      {/* 3. About Section */}
      <AboutSection lang={lang} />

      {/* 4. Gallery Section */}
      <GallerySection />

      {/* 5. Video Section */}
      <VideoSection />

      {/* 5.5. Stage Moments (Show Gallery) Section */}
      <StageMomentsSection />

      {/* 5.6. Past Gigs Timeline Section */}
      <GigsSection lang={lang} />

      {/* 5.7. Quick Booking Form Section */}
      <BookingFormSection lang={lang} />

      {/* 6. Contact / Footer Section */}
      <footer 
        id="contact" 
        className="bg-[#0C0C0C] py-20 px-6 md:px-10 border-t border-[#D7E2EA]/10 relative z-30"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <FadeIn delay={0} y={20} className="flex flex-col text-left" as="div">
            <span className="text-[#D7E2EA]/50 text-xs sm:text-sm uppercase tracking-widest font-medium mb-2">
              {lang === 'vi' ? 'Hãy hợp tác cùng tôi' : "Let's collaborate"}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight hero-heading">
              {lang === 'vi' ? 'Khởi động dự án' : 'Start a Project'}
            </h2>
            <a 
              href={`mailto:${socialLinks.email}`} 
              className="text-[#D7E2EA] text-xl sm:text-2xl md:text-3xl font-light mt-4 hover:opacity-75 transition-opacity flex items-center gap-2 group"
            >
              {socialLinks.email}
              <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </FadeIn>

          <FadeIn 
            delay={0.15} 
            y={20} 
            className="flex flex-col md:items-end text-left md:text-right gap-6"
            as="div"
          >
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-start md:justify-end">
              {socialLinks.fb1 && (
                <a
                  href={socialLinks.fb1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D7E2EA]/60 hover:text-white transition-colors flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest font-medium"
                >
                  <Facebook className="w-4 h-4 text-neon-cyan" />
                  Facebook 1
                </a>
              )}
              {socialLinks.fb2 && (
                <a
                  href={socialLinks.fb2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D7E2EA]/60 hover:text-white transition-colors flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest font-medium"
                >
                  <Facebook className="w-4 h-4 text-neon-orange" />
                  Facebook 2
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D7E2EA]/60 hover:text-white transition-colors flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest font-medium"
                >
                  <Instagram className="w-4 h-4 text-neon-cyan" />
                  Instagram
                </a>
              )}
              {socialLinks.tiktok && (
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D7E2EA]/60 hover:text-white transition-colors flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest font-medium"
                >
                  <TikTokIcon className="w-4 h-4 text-neon-orange" />
                  TikTok
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 md:justify-end">
              <p className="text-[#D7E2EA]/30 text-xs sm:text-sm">
                &copy; {new Date().getFullYear()} Vanzi. All rights reserved.
              </p>
              <span className="text-[#D7E2EA]/20">•</span>
              <a 
                href="#admin" 
                className="text-[#D7E2EA]/30 hover:text-[#F2BF00] transition-colors flex items-center gap-1 text-xs"
                title="System Settings"
              >
                <Settings className="w-3.5 h-3.5 animate-[spin_8s_linear_infinite]" />
                Admin
              </a>
            </div>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
}

export default App;
