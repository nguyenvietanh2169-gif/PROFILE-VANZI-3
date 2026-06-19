import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, SkipBack, SkipForward, Shuffle, Repeat, 
  Search
} from 'lucide-react';
import { FadeIn } from './FadeIn';
import { getTracks, incrementTrackPlay, getImageAssets } from '../utils/storage';
import type { Track } from '../utils/storage';

export const MusicPlayerSection: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Default to first track (ALL NIGHT)
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [searchQuery, setSearchQuery] = useState("");
  const [tracks] = useState<Track[]>(getTracks);
  const [avatar] = useState<string>(() => getImageAssets().avatar);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  const [isDspEnabled, setIsDspEnabled] = useState(true);
  const eqRef = useRef<BiquadFilterNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  
  // Workaround for mobile background audio playback (prevents iOS suspension)
  const audioDestNodeRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  const initAudioContext = () => {
    if (audioContextRef.current || !audioRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      
      audioRef.current.crossOrigin = "anonymous";
      
      const source = ctx.createMediaElementSource(audioRef.current);
      
      // Create EQ node (boost low-mids for warmth on phone speakers)
      const eq = ctx.createBiquadFilter();
      eq.type = 'peaking';
      eq.frequency.setValueAtTime(120, ctx.currentTime);
      eq.Q.setValueAtTime(1.0, ctx.currentTime);
      eq.gain.setValueAtTime(3.5, ctx.currentTime);
      
      // Create compressor node (smooth out and master the sound)
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-24, ctx.currentTime);
      compressor.knee.setValueAtTime(30, ctx.currentTime);
      compressor.ratio.setValueAtTime(4, ctx.currentTime); // 4:1 ratio
      compressor.attack.setValueAtTime(0.012, ctx.currentTime); // 12ms attack
      compressor.release.setValueAtTime(0.25, ctx.currentTime); // 250ms release

      // Create MediaStreamDestination and background audio element to support background play
      let dest: AudioNode = ctx.destination;
      if ('createMediaStreamDestination' in ctx) {
        const destNode = ctx.createMediaStreamDestination();
        const bgAudio = document.createElement('audio');
        bgAudio.id = 'player-bg-audio-elem';
        bgAudio.srcObject = destNode.stream;
        
        audioDestNodeRef.current = destNode;
        bgAudioRef.current = bgAudio;
        dest = destNode;
      }

      // Save references
      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      eqRef.current = eq;
      compressorRef.current = compressor;

      // Set up initial routing: Source -> Analyser statically
      source.connect(analyser);

      // Route Analyser dynamically
      if (isDspEnabled) {
        analyser.connect(eq);
        eq.connect(compressor);
        compressor.connect(dest);
      } else {
        analyser.connect(dest);
      }
    } catch (err) {
      console.warn("Failed to initialize Web Audio API Visualizer/DSP:", err);
    }
  };

  // Dynamically update audio routing when isDspEnabled changes
  useEffect(() => {
    if (!audioContextRef.current || !analyserRef.current || !eqRef.current || !compressorRef.current) return;
    try {
      analyserRef.current.disconnect();
      eqRef.current.disconnect();
      compressorRef.current.disconnect();

      const dest = audioDestNodeRef.current || audioContextRef.current.destination;

      if (isDspEnabled) {
        analyserRef.current.connect(eqRef.current);
        eqRef.current.connect(compressorRef.current);
        compressorRef.current.connect(dest);
      } else {
        analyserRef.current.connect(dest);
      }
    } catch (err) {
      console.warn("Failed to update audio routing:", err);
    }
  }, [isDspEnabled]);

  const resumeAudioContext = async () => {
    initAudioContext();
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  // Audio Visualizer Canvas Render Loop
  useEffect(() => {
    let active = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const draw = () => {
      if (!active) return;
      animationFrameRef.current = requestAnimationFrame(draw);
      
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      
      const barWidth = 3;
      const gap = 2;
      const barCount = Math.floor(width / (barWidth + gap));
      
      let dataArray = new Uint8Array(0);
      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
      }
      
      for (let i = 0; i < barCount; i++) {
        let val: number;
        if (isPlaying) {
          if (dataArray.length > 0) {
            const percent = dataArray[i % dataArray.length] / 255;
            val = percent * height;
          } else {
            const time = Date.now() * 0.004;
            val = (Math.sin(i * 0.3 + time) * 0.4 + 0.6) * height * 0.6;
            val += Math.random() * 4;
          }
        } else {
          val = 1;
        }
        
        if (isPlaying && val < 2) val = 2;
        if (val > height) val = height;
        
        const x = i * (barWidth + gap);
        const y = height - val;
        
        const gradient = ctx.createLinearGradient(0, height, 0, y);
        gradient.addColorStop(0, '#E27E00');
        gradient.addColorStop(1, '#F2BF00');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, val);
      }
    };
    
    draw();
    
    return () => {
      active = false;
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  const currentTrack = tracks[currentTrackIndex] || {
    title: "",
    artist: "",
    genre: "",
    duration: "0:00",
    durationSeconds: 0,
    cover: "",
    src: ""
  };

  // Timer loop for simulation (only for mock tracks that have no src file)
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && !currentTrack.src) {
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
  }, [isPlaying, currentTrackIndex, currentTrack.durationSeconds, currentTrack.src]);

  // Synchronize audio element source, background element source and playback state
  useEffect(() => {
    const audio = audioRef.current;
    const bgAudio = bgAudioRef.current;
    if (!audio) return;

    const trackSrc = currentTrack.src;
    const isNewSource = audio.getAttribute('data-src') !== trackSrc;

    if (trackSrc) {
      if (isNewSource) {
        audio.src = trackSrc;
        audio.setAttribute('data-src', trackSrc);
        audio.load();
      }

      if (isPlaying) {
        audio.play().then(() => {
          if (bgAudio) {
            bgAudio.play().catch((err) => console.log("bgAudio play failed:", err));
          }
        }).catch((err) => console.log("Audio play failed:", err));
      } else {
        audio.pause();
        if (bgAudio) bgAudio.pause();
      }
    } else {
      audio.src = "";
      audio.removeAttribute('data-src');
      if (bgAudio) bgAudio.pause();
    }
  }, [currentTrack.src, isPlaying]);

  // Synchronize OS Lock Screen Media Session Controls & Metadata
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const track = tracks[currentTrackIndex];
    if (!track) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist || 'DJ VANZI',
      album: 'VANZI ON DA BEAT',
      artwork: [
        { src: window.location.origin + track.cover, sizes: '512x512', type: 'image/jpeg' }
      ]
    });

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

    // Set action handlers
    try {
      navigator.mediaSession.setActionHandler('play', () => {
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        handlePrevTrack();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        handleNextTrack();
      });
    } catch (err) {
      console.warn("Failed to set MediaSession action handlers:", err);
    }
  }, [currentTrackIndex, isPlaying, tracks]);

  // Volume control effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    const nextPlayState = !isPlaying;
    setIsPlaying(nextPlayState);
    if (nextPlayState) {
      resumeAudioContext();
      if (currentTrack?.title) {
        incrementTrackPlay(currentTrack.title);
      }
    }
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
    resumeAudioContext();
    const selectedTrack = tracks[index];
    if (selectedTrack?.title) {
      incrementTrackPlay(selectedTrack.title);
    }
  };

  const handleNextTrack = () => {
    if (tracks.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    resumeAudioContext();
    const nextTrack = tracks[nextIndex];
    if (isPlaying && nextTrack?.title) {
      incrementTrackPlay(nextTrack.title);
    }
  };

  const handlePrevTrack = () => {
    if (tracks.length === 0) return;
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    resumeAudioContext();
    const prevTrack = tracks[prevIndex];
    if (isPlaying && prevTrack?.title) {
      incrementTrackPlay(prevTrack.title);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current && currentTrack.src) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && currentTrack.src) {
      setCurrentTime(Math.floor(audioRef.current.currentTime));
    }
  };

  const handleTrackEnded = () => {
    handleNextTrack();
  };

  // Filter tracks based on search input query
  const filteredTracks = tracks.map((track, originalIndex) => ({ ...track, originalIndex }))
    .filter(track => 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <section 
      id="music-player" 
      className="bg-[#0C0C0C] py-24 px-4 sm:px-6 md:px-10 w-full relative z-20"
    >
      {/* Hidden audio element for real playback */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

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

            <button 
              onClick={() => setIsDspEnabled(!isDspEnabled)}
              className="bg-[#1c1c1f] hover:bg-[#252529] text-xs text-[#D7E2EA] font-semibold py-2 px-4 rounded-full border border-[#D7E2EA]/10 flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              title="Bật/Tắt hiệu ứng làm ấm âm thanh (DSP Mastering)"
            >
              <span 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isDspEnabled 
                    ? 'bg-[#00c853] shadow-[0_0_8px_#00c853]' 
                    : 'bg-[#ff5252]'
                }`}
              />
              DSP: {isDspEnabled ? 'ON' : 'OFF'}
            </button>
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

                <img
                  src={avatar}
                  alt="Vanzi Visual"
                  className="absolute right-0 top-0 bottom-0 w-[42%] md:w-[45%] h-full object-cover object-[38%_center] z-10 select-none rounded-r-3xl"
                  draggable="false"
                />
              </div>
            </div>

            {/* Top Tracks (Right Column, spans 4 cols on desktop) */}
            <div className="lg:col-span-4 flex flex-col text-left justify-start">
              <h4 className="text-xs uppercase tracking-widest font-black text-[#D7E2EA] mb-4">
                TOP TRACKS
              </h4>
              <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredTracks.length > 0 ? (
                  filteredTracks.map((track) => {
                    const isActive = currentTrackIndex === track.originalIndex;
                    return (
                      <div 
                        key={track.originalIndex}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-500 group cursor-pointer relative overflow-hidden ${
                          isActive 
                            ? 'liquid-glass-active border-white/20' 
                            : 'bg-[#1c1c1f]/40 border-transparent hover:bg-[#1c1c1f]/80'
                        }`}
                      >
                        {/* Liquid fluid animated blobs behind the text content */}
                        {isActive && (
                          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-2xl">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-black/10 z-10" />
                            <div className="absolute -top-[50%] -left-[30%] w-[130px] h-[130px] rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/15 blur-[20px] animate-liquid-blob-1" />
                            <div className="absolute -bottom-[50%] -right-[30%] w-[130px] h-[130px] rounded-full bg-gradient-to-r from-cyan-500/15 to-blue-600/20 blur-[20px] animate-liquid-blob-2" />
                          </div>
                        )}

                        <div 
                          className="flex items-center gap-3 flex-grow min-w-0 relative z-10" 
                          onClick={() => handleTrackSelect(track.originalIndex)}
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-[#D7E2EA]/10 bg-[#0c0c0e]">
                            <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col text-left flex-grow min-w-0 overflow-hidden whitespace-nowrap">
                            <div className="overflow-hidden w-full">
                              <span 
                                className={`text-xs font-bold transition-colors ${
                                  isActive 
                                    ? 'text-white drop-shadow-[0_2px_4px_rgba(255,255,255,0.25)]' 
                                    : 'text-[#D7E2EA] group-hover:text-[#F2BF00]'
                                } ${
                                  track.title.length > 20 
                                    ? 'animate-marquee-text' 
                                    : 'truncate block'
                                }`}
                              >
                                {track.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 overflow-hidden">
                              <span className="text-[10px] text-[#D7E2EA]/50 truncate">
                                {track.artist}
                              </span>
                              <span className={`text-[8px] sm:text-[9px] px-1.5 py-0.25 rounded border font-mono flex-shrink-0 transition-colors ${
                                isActive 
                                  ? 'text-white bg-white/15 border-white/25' 
                                  : 'text-[#F2BF00]/70 bg-[#F2BF00]/10 border-[#F2BF00]/20'
                              }`}>
                                {track.genre}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="w-10 flex justify-end flex-shrink-0 ml-3 relative z-10">
                          <button
                            onClick={() => isActive ? togglePlay() : handleTrackSelect(track.originalIndex)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isActive && isPlaying
                                ? 'bg-white text-black hover:bg-neutral-200 shadow'
                                : 'border border-[#D7E2EA]/30 text-[#D7E2EA] hover:bg-white hover:text-black hover:border-white'
                            }`}
                          >
                            {isActive && isPlaying ? (
                              <Pause className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </button>
                        </div>
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
            
            {/* Left side: Spinning Vinyl Cover + Visualizer */}
            <div className="flex items-center w-full md:flex-1 min-w-0 justify-start gap-4">
              <div 
                className={`w-10 h-10 rounded-full overflow-hidden border border-[#D7E2EA]/10 shadow flex-shrink-0 relative ${
                  isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''
                }`}
              >
                <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
                {/* Center hole of vinyl record */}
                <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[#1b1b1e] border border-white/10" />
              </div>
              
              {/* Audio Visualizer Canvas */}
              <canvas 
                ref={canvasRef} 
                className="w-24 h-8 opacity-75 hidden sm:block" 
                width="96" 
                height="32" 
              />
            </div>

            {/* Center Controls & Progress bar */}
            <div className="flex flex-col items-center gap-2.5 flex-grow w-full md:max-w-xl">
              {/* Play buttons group */}
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

              {/* Compact Track Name & Artist under the Play buttons group */}
              <div className="flex items-center gap-2 text-[11px] text-[#D7E2EA]/85 bg-black/40 px-3 py-1 rounded-full border border-white/5 max-w-full overflow-hidden whitespace-nowrap">
                <span className="font-bold text-white truncate max-w-[120px] sm:max-w-[180px]">
                  {currentTrack.title}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[#D7E2EA]/60 truncate max-w-[80px] sm:max-w-[120px]">
                  {currentTrack.artist}
                </span>
                <span className="text-[8px] text-[#F2BF00]/85 bg-[#F2BF00]/10 px-1.5 py-0.25 rounded border border-[#F2BF00]/25 font-mono flex-shrink-0">
                  {currentTrack.genre}
                </span>
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
            <div className="flex items-center gap-2 w-full md:flex-1 justify-end text-[#D7E2EA]/60">
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
