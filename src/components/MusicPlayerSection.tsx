import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Volume2, SkipBack, SkipForward, Shuffle, Repeat, 
  Search, Plus, Check
} from 'lucide-react';
import { FadeIn } from './FadeIn';

const TRACKS = [
  {
    title: "Body Rock (Mike Candys Edit)",
    artist: "Mike Candys & Vanzi",
    duration: "3:42",
    durationSeconds: 222,
    cover: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85"
  },
  {
    title: "Aquarius (Trance Mix)",
    artist: "CARYS",
    duration: "4:15",
    durationSeconds: 255,
    cover: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85"
  },
  {
    title: "Lavender Haze (Vanzi Remix)",
    artist: "Taylor Swift x Vanzi",
    duration: "3:12",
    durationSeconds: 192,
    cover: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85"
  },
  {
    title: "Wildfire (Festival Mix)",
    artist: "Klaas & Vanzi",
    duration: "2:54",
    durationSeconds: 174,
    cover: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
  }
];

export const MusicPlayerSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(2); // Default to Lavender Haze
  const [currentTime, setCurrentTime] = useState(85); // 1:25 default
  const [volume, setVolume] = useState(80);
  const [isFollowed, setIsFollowed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentTrack = TRACKS[currentTrackIndex];

  // Timer loop for simulation
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.durationSeconds) {
            return 0; // Loop
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentTrackIndex, currentTrack.durationSeconds]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setCurrentTime(0);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setCurrentTime(0);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(e.target.value));
  };

  // Filter tracks based on search input query
  const filteredTracks = TRACKS.map((track, originalIndex) => ({ ...track, originalIndex }))
    .filter(track => 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <section 
      id="music-player" 
      className="bg-[#0C0C0C] py-24 px-4 sm:px-6 md:px-10 w-full relative z-20"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Heading */}
        <FadeIn delay={0} y={30} as="h2" className="hero-heading font-black uppercase text-center text-[clamp(2.5rem,8vw,110px)] mb-16 sm:mb-20">
          Studio Player
        </FadeIn>

        {/* Dashboard Workstation Card */}
        <FadeIn 
          delay={0.15} 
          y={40} 
          className="w-full bg-[#141416] border border-[#D7E2EA]/10 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col gap-6"
          as="div"
        >
          {/* 1. Top Search Bar */}
          <div className="w-full flex justify-between items-center">
            <div className="relative max-w-xs w-full flex items-center">
              <Search className="w-4 h-4 text-[#D7E2EA]/40 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tracks, remixes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1c1f] text-sm text-[#D7E2EA] placeholder-[#D7E2EA]/40 pl-9 pr-4 py-2.5 rounded-full border border-transparent focus:border-[#D7E2EA]/20 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 2. Middle Grid: Banner (Left) + Top Tracks (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 w-full">
            
            {/* Banner (Left Column, spans 6 cols on desktop) */}
            <div className="lg:col-span-6">
              <div 
                style={{
                  background: 'linear-gradient(135deg, #1C1200 0%, #7A5300 45%, #F2BF00 100%)',
                  boxShadow: '0px 10px 30px rgba(242, 191, 0, 0.15)'
                }}
                className="w-full h-64 md:h-[320px] rounded-3xl relative overflow-hidden flex flex-col justify-between p-6 md:p-8 text-left"
              >
                {/* Visual gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-0" />

                <div className="flex flex-col items-start max-w-[55%] z-10 relative">
                  <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#D7E2EA] mb-3">
                    Featured Release
                  </span>
                  <h3 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-none">
                    VANZI
                  </h3>
                  <p className="text-white/75 text-xs sm:text-sm mt-3 font-light leading-relaxed">
                    The &apos;Tomorrow Never Comes&apos; is the first track of the new EP coming Summer 2026.
                  </p>
                </div>

                <div className="flex gap-3 z-10 relative">
                  <button 
                    onClick={() => handleTrackSelect(2)}
                    className="bg-white text-black font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full hover:scale-105 transition-transform active:scale-95 shadow-lg"
                  >
                    PLAY
                  </button>
                  <button 
                    onClick={() => setIsFollowed(!isFollowed)}
                    className="bg-white/15 backdrop-blur-md border border-white/25 text-white font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-white/25 transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    {isFollowed ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    {isFollowed ? "FOLLOWED" : "FOLLOW"}
                  </button>
                </div>

                {/* New artist photo overlay */}
                <img
                  src="/vanzi-photo.jpg"
                  alt="Vanzi Visual"
                  className="absolute right-0 top-0 bottom-0 w-[42%] md:w-[45%] h-full object-cover z-10 select-none rounded-r-3xl"
                  draggable="false"
                />
              </div>
            </div>

            {/* Top Tracks (Right Column, spans 4 cols on desktop) */}
            <div className="lg:col-span-4 flex flex-col text-left justify-start">
              <h4 className="text-xs uppercase tracking-widest font-black text-[#D7E2EA] mb-4">
                TOP TRACKS
              </h4>
              <div className="flex flex-col gap-3">
                {filteredTracks.length > 0 ? (
                  filteredTracks.map((track) => {
                    const isActive = currentTrackIndex === track.originalIndex;
                    return (
                      <div 
                        key={track.originalIndex}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 group cursor-pointer ${
                          isActive 
                            ? 'bg-[#F2BF00]/15 border-[#F2BF00]/45 shadow-md' 
                            : 'bg-[#1c1c1f]/40 border-transparent hover:bg-[#1c1c1f]/80'
                        }`}
                      >
                        <div 
                          className="flex items-center gap-3 flex-grow" 
                          onClick={() => handleTrackSelect(track.originalIndex)}
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-[#D7E2EA]/10">
                            <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col text-left max-w-[140px] sm:max-w-[180px]">
                            <span className="text-xs font-semibold truncate text-[#D7E2EA] group-hover:text-[#F2BF00] transition-colors">
                              {track.title}
                            </span>
                            <span className="text-[10px] text-[#D7E2EA]/50 truncate mt-0.5">
                              {track.artist}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => isActive ? togglePlay() : handleTrackSelect(track.originalIndex)}
                          className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
                            isActive && isPlaying
                              ? 'bg-white text-black hover:bg-neutral-200 shadow'
                              : 'border border-[#D7E2EA]/30 text-[#D7E2EA] hover:bg-white hover:text-black hover:border-white'
                          }`}
                        >
                          {isActive && isPlaying ? "STOP" : "PLAY"}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-[#D7E2EA]/40 text-center py-8">
                    No tracks match your search.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 3. Media Player Controls Bar */}
          <div className="w-full bg-[#1b1b1e] border border-[#D7E2EA]/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
            
            {/* Left Track details */}
            <div className="flex items-center gap-3 w-full md:w-1/4">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-[#D7E2EA]/10 shadow animate-pulse">
                <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left truncate max-w-[200px]">
                <span className="text-sm font-semibold truncate text-[#D7E2EA]">
                  {currentTrack.title}
                </span>
                <span className="text-xs text-[#D7E2EA]/50 truncate mt-0.5">
                  {currentTrack.artist}
                </span>
              </div>
            </div>

            {/* Center Controls & Progress bar */}
            <div className="flex flex-col items-center gap-2 flex-grow w-full md:max-w-xl">
              <div className="flex items-center gap-6 text-[#D7E2EA]/60">
                <button className="hover:text-white transition-colors">
                  <Shuffle className="w-4 h-4" />
                </button>
                <button onClick={handlePrevTrack} className="hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current text-black ml-0" />
                  ) : (
                    <Play className="w-5 h-5 fill-current text-black ml-0.5" />
                  )}
                </button>
                <button onClick={handleNextTrack} className="hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>
                <button className="hover:text-white transition-colors">
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar slider */}
              <div className="flex items-center gap-3 w-full text-xs font-mono text-[#D7E2EA]/40">
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={currentTrack.durationSeconds}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="flex-grow h-1.5 rounded-full bg-[#3e3e42] accent-[#F2BF00] appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #F2BF00 ${((currentTime / currentTrack.durationSeconds) * 100)}%, #3e3e42 ${((currentTime / currentTrack.durationSeconds) * 100)}%)`
                  }}
                />
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Right Volume control */}
            <div className="flex items-center gap-2 w-full md:w-1/4 justify-end text-[#D7E2EA]/60">
              <Volume2 className="w-4 h-4" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-20 md:w-24 h-1 rounded-full bg-[#3e3e42] accent-white appearance-none cursor-pointer focus:outline-none"
                style={{
                  background: `linear-gradient(to right, white ${volume}%, #3e3e42 ${volume}%)`
                }}
              />
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  );
};
