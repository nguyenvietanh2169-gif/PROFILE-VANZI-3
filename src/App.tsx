import { HeroSection } from './components/HeroSection';
import { MusicPlayerSection } from './components/MusicPlayerSection';
import { MarqueeSection } from './components/MarqueeSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { VideoSection } from './components/VideoSection';
import { StageMomentsSection } from './components/StageMomentsSection';
import { ArrowUpRight, Facebook, Instagram } from 'lucide-react';
import { FadeIn } from './components/FadeIn';

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
  return (
    <div className="bg-[#0C0C0C] text-[#D7E2EA] w-full min-h-screen overflow-x-clip select-none font-sans">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 1.5. Studio Music Player Section */}
      <MusicPlayerSection />

      {/* 2. Marquee Section */}
      <MarqueeSection />

      {/* 3. About Section */}
      <AboutSection />

      {/* 4. Gallery Section */}
      <GallerySection />

      {/* 5. Video Section */}
      <VideoSection />

      {/* 5.5. Stage Moments (Show Gallery) Section */}
      <StageMomentsSection />

      {/* 6. Contact / Footer Section */}
      <footer 
        id="contact" 
        className="bg-[#0C0C0C] py-20 px-6 md:px-10 border-t border-[#D7E2EA]/10 relative z-30"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <FadeIn delay={0} y={20} className="flex flex-col text-left" as="div">
            <span className="text-[#D7E2EA]/50 text-xs sm:text-sm uppercase tracking-widest font-medium mb-2">
              Let&apos;s collaborate
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight hero-heading">
              Start a Project
            </h2>
            <a 
              href="mailto:nguyenvietanh2169@gmail.com" 
              className="text-[#D7E2EA] text-xl sm:text-2xl md:text-3xl font-light mt-4 hover:opacity-75 transition-opacity flex items-center gap-2 group"
            >
              nguyenvietanh2169@gmail.com
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
              <a
                href="https://www.facebook.com/viet.anh.nguyen.291622/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D7E2EA]/60 hover:text-white transition-colors flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest font-medium"
              >
                <Facebook className="w-4 h-4 text-neon-cyan" />
                Facebook 1
              </a>
              <a
                href="https://www.facebook.com/xDJ.VANZ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D7E2EA]/60 hover:text-white transition-colors flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest font-medium"
              >
                <Facebook className="w-4 h-4 text-neon-orange" />
                Facebook 2
              </a>
              <a
                href="https://www.instagram.com/vietanhnguyen.raw/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D7E2EA]/60 hover:text-white transition-colors flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest font-medium"
              >
                <Instagram className="w-4 h-4 text-neon-cyan" />
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@dj_vanz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D7E2EA]/60 hover:text-white transition-colors flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest font-medium"
              >
                <TikTokIcon className="w-4 h-4 text-neon-orange" />
                TikTok
              </a>
            </div>
            <p className="text-[#D7E2EA]/30 text-xs sm:text-sm mt-2">
              &copy; {new Date().getFullYear()} Vanzi. All rights reserved.
            </p>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
}

export default App;
