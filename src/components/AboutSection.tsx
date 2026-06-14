import React from 'react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';

export const AboutSection: React.FC = () => {
  return (
    <section 
      id="about" 
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-20 bg-[#0C0C0C] text-center overflow-hidden"
    >
      {/* 1. Absolute Decorative 3D Images */}
      {/* Top-Left Moon */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-0 pointer-events-none md:pointer-events-auto select-none w-[120px] sm:w-[160px] md:w-[210px]"
        as="div"
      >
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" 
          alt="Moon 3D Render" 
          className="w-full h-auto transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-3 hover:rotate-6 cursor-pointer"
          draggable="false"
        />
      </FadeIn>

      {/* Bottom-Left 3D Object */}
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-0 pointer-events-none md:pointer-events-auto select-none w-[100px] sm:w-[140px] md:w-[180px]"
        as="div"
      >
        <img 
          src="/smiley-orange.png" 
          alt="Smiley 3D Icon" 
          className="w-full h-auto transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-3 hover:rotate-[-6deg] cursor-pointer"
          draggable="false"
        />
      </FadeIn>

      {/* Top-Right Lego */}
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-0 pointer-events-none md:pointer-events-auto select-none w-[120px] sm:w-[160px] md:w-[210px]"
        as="div"
      >
        <img 
          src="/lego-orange.png" 
          alt="Lego 3D Block" 
          className="w-full h-auto transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-3 hover:rotate-6 cursor-pointer"
          draggable="false"
        />
      </FadeIn>

      {/* Bottom-Right 3D Group */}
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-0 pointer-events-none md:pointer-events-auto select-none w-[130px] sm:w-[170px] md:w-[220px]"
        as="div"
      >
        <img 
          src="/cursor-blue.png" 
          alt="Cursor 3D Icon" 
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
                src="/vanzi-photo.jpg" 
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
            About me
          </FadeIn>

          {/* Gap between heading and paragraph */}
          <div className="h-6 sm:h-8 md:h-10" />

          <AnimatedText
            text="DJ VANZI (Since 2016) – Người dẫn dắt cảm xúc và kết nối đám đông qua những hành trình âm thanh độc bản. Không thỏa hiệp với những giới hạn, âm nhạc của VANZI là sự biến hóa linh hoạt giữa năng lượng tươi sáng, những khoảng lặng bay bổng và chất Techno gai góc, huyền bí. 10 năm thực chiến, một bản sắc riêng biệt."
            className="text-[#D7E2EA] font-medium leading-relaxed max-w-[480px] text-[clamp(0.95rem,1.8vw,1.25rem)]"
          />

          {/* Metadata info */}
          <FadeIn delay={0.3} y={30} className="mt-8 flex flex-col gap-3 items-center lg:items-start text-left">
            <div className="text-[#D7E2EA]/60 text-xs sm:text-sm uppercase tracking-widest font-mono">
              Real name: <span className="text-[#D7E2EA] font-bold tracking-normal font-sans ml-1">Nguyễn Việt Anh</span>
            </div>
            <div className="text-[#D7E2EA]/60 text-xs sm:text-sm uppercase tracking-widest font-mono">
              Date of birth: <span className="text-[#D7E2EA] font-bold tracking-normal font-sans ml-1">24/04/1998</span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
