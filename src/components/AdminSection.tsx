import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Trash2, Plus, Save, BarChart2, Music, 
  FileText, Smartphone, RefreshCw, Eye, Users, Play, Lock,
  Upload, Mail
} from 'lucide-react';
import { 
  getTracks, saveTracks, getAboutContent, saveAboutContent, 
  getHeroContent, saveHeroContent, getStats, resetStats,
  getAdminPIN, saveAdminPIN, getSocialLinks, saveSocialLinks,
  getImageAssets, saveImageAssets, compressAndConvertImage,
  getGigs, saveGigs, getBookings, saveBookings, getEPK, saveEPK
} from '../utils/storage';
import type { Track, AboutContent, HeroContent, TrafficStats, GalleryImage, SocialLinks, ImageAssets, Gig, BookingInquiry } from '../utils/storage';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const AdminSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'music' | 'content' | 'bookings' | 'pwa'>('analytics');
  const [tracks, setTracks] = useState<Track[]>(getTracks);
  const [aboutContent, setAboutContent] = useState<AboutContent>(getAboutContent);
  const [heroContent, setHeroContent] = useState<HeroContent>(getHeroContent);
  const [stats, setStats] = useState<TrafficStats>(getStats);
  
  // New features states
  const [gigs, setGigs] = useState<Gig[]>(getGigs);
  const [bookings, setBookings] = useState<BookingInquiry[]>(getBookings);
  const [epkLink, setEpkLink] = useState<string>(getEPK);
  
  const [newGig, setNewGig] = useState<Omit<Gig, 'id'>>({
    date: "",
    venue: "",
    city: "",
    country: "",
    type: "Club Set",
    typeEn: "Club Set",
    status: "past"
  });
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('vanzi_admin_authenticated') === 'true';
  });
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  // Change PIN states
  const [currentPin, setCurrentPin] = useState<string>("");
  const [newPin, setNewPin] = useState<string>("");
  const [confirmNewPin, setConfirmNewPin] = useState<string>("");

  // Feedback Messages
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Song Form State
  const [newSong, setNewSong] = useState<Omit<Track, 'durationSeconds'>>({
    title: "",
    artist: "",
    genre: "",
    duration: "2:30",
    cover: "/gallery/vanzi f1 edit.jpg",
    src: "/music/ALL NIGHT.mp3"
  });

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Image Upload / Social links states
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(getSocialLinks);
  const [imageAssets, setImageAssets] = useState<ImageAssets>(getImageAssets);
  const [newGalleryImgTitle, setNewGalleryImgTitle] = useState("");
  const [newGalleryImgCategory, setNewGalleryImgCategory] = useState("Performance");

  // File upload handlers
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressAndConvertImage(file, 800, 800, 0.75);
      const updated = { ...imageAssets, avatar: base64 };
      setImageAssets(updated);
      saveImageAssets(updated);
      triggerToast("Đã cập nhật ảnh đại diện thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi tải ảnh lên, vui lòng thử lại!");
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!newGalleryImgTitle.trim()) {
      alert("Vui lòng điền tiêu đề ảnh trước khi chọn file!");
      return;
    }
    try {
      const base64 = await compressAndConvertImage(file, 800, 800, 0.75);
      const newImg: GalleryImage = {
        src: base64,
        title: newGalleryImgTitle,
        category: newGalleryImgCategory || "Performance"
      };
      const updated = {
        ...imageAssets,
        gallery: [...imageAssets.gallery, newImg]
      };
      setImageAssets(updated);
      saveImageAssets(updated);
      setNewGalleryImgTitle("");
      e.target.value = "";
      triggerToast("Đã thêm ảnh vào thư viện!");
    } catch (err) {
      console.error(err);
      alert("Lỗi tải ảnh lên, vui lòng thử lại!");
    }
  };

  const handleDeleteGalleryImage = (idxToDelete: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này khỏi thư viện?")) {
      const updated = {
        ...imageAssets,
        gallery: imageAssets.gallery.filter((_, idx) => idx !== idxToDelete)
      };
      setImageAssets(updated);
      saveImageAssets(updated);
      triggerToast("Đã xóa ảnh thư viện!");
    }
  };

  const handleStageMomentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressAndConvertImage(file, 800, 800, 0.75);
      const updated = {
        ...imageAssets,
        stageMoments: [...imageAssets.stageMoments, base64]
      };
      setImageAssets(updated);
      saveImageAssets(updated);
      e.target.value = "";
      triggerToast("Đã thêm ảnh khoảnh khắc sân khấu!");
    } catch (err) {
      console.error(err);
      alert("Lỗi tải ảnh lên, vui lòng thử lại!");
    }
  };

  const handleDeleteStageMoment = (idxToDelete: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này khỏi khoảnh khắc sân khấu?")) {
      const updated = {
        ...imageAssets,
        stageMoments: imageAssets.stageMoments.filter((_, idx) => idx !== idxToDelete)
      };
      setImageAssets(updated);
      saveImageAssets(updated);
      triggerToast("Đã xóa ảnh khoảnh khắc!");
    }
  };

  useEffect(() => {
    // Listen for PWA installer prompt
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth Submit Check
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = getAdminPIN();
    if (pinInput === storedPin) {
      sessionStorage.setItem('vanzi_admin_authenticated', 'true');
      setIsAuthenticated(true);
      setPinInput("");
      setPinError(null);
    } else {
      setPinError("Mã PIN không chính xác! Vui lòng kiểm tra lại.");
      setPinInput("");
    }
  };

  // Change PIN handler
  const handleChangePIN = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = getAdminPIN();
    if (currentPin !== storedPin) {
      alert("Mã PIN hiện tại không chính xác!");
      return;
    }
    if (!newPin || newPin.length < 4) {
      alert("Mã PIN mới phải có ít nhất 4 ký tự!");
      return;
    }
    if (newPin !== confirmNewPin) {
      alert("Xác nhận mã PIN mới không trùng khớp!");
      return;
    }
    saveAdminPIN(newPin);
    setCurrentPin("");
    setNewPin("");
    setConfirmNewPin("");
    triggerToast("Đã thay đổi mã PIN quản trị thành công!");
  };

  // 1. Save Content (Hero + About + Socials)
  const handleSaveContent = () => {
    saveAboutContent(aboutContent);
    saveHeroContent(heroContent);
    saveSocialLinks(socialLinks);
    triggerToast("Đã lưu thông tin nội dung thành công!");
  };

  // 2. Track Operations
  const parseDurationSeconds = (durStr: string): number => {
    const parts = durStr.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;
      return (minutes * 60) + seconds;
    }
    return 150; // fallback
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.title || !newSong.artist) {
      alert("Vui lòng điền tên bài hát và nghệ sĩ!");
      return;
    }
    const durationSeconds = parseDurationSeconds(newSong.duration);
    const addedTrack: Track = {
      ...newSong,
      durationSeconds
    };
    const updated = [...tracks, addedTrack];
    setTracks(updated);
    saveTracks(updated);
    // Reset form
    setNewSong({
      title: "",
      artist: "",
      genre: "Electro House",
      duration: "3:00",
      cover: "/gallery/vanzi f1 edit.jpg",
      src: "/music/ALL NIGHT.mp3"
    });
    triggerToast("Đã thêm bài hát mới!");
  };

  const handleDeleteSong = (index: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài hát này khỏi playlist?")) {
      const updated = tracks.filter((_, idx) => idx !== index);
      setTracks(updated);
      saveTracks(updated);
      triggerToast("Đã xóa bài hát khỏi danh sách!");
    }
  };

  const handleUpdateSongField = (index: number, field: keyof Track, value: string) => {
    const updated = [...tracks];
    const track = { ...updated[index] };
    
    if (field === 'duration') {
      track.duration = value;
      track.durationSeconds = parseDurationSeconds(value);
    } else {
      (track as unknown as Record<string, string>)[field as string] = value;
    }
    
    updated[index] = track;
    setTracks(updated);
    saveTracks(updated);
  };

  // 3. Stats Operations
  const handleResetStats = () => {
    if (window.confirm("Bạn có chắc chắn muốn reset toàn bộ số liệu thống kê truy cập?")) {
      resetStats();
      setStats(getStats());
      triggerToast("Đã reset thống kê truy cập!");
    }
  };

  // 4. PWA Installation Triggers
  const handleInstallApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
        if (choiceResult.outcome === 'accepted') {
          triggerToast("Bắt đầu cài đặt ứng dụng!");
        }
        setDeferredPrompt(null);
      });
    } else {
      alert("Trình duyệt của bạn hiện chưa kích hoạt installer prompt. Bạn có thể tự thêm vào màn hình chính thông qua menu trình duyệt.");
    }
  };

  // Dynamic Cover options: static files + any uploaded gallery images and avatar
  const dynamicCoverOptions = [
    "/gallery/vanzi f1 edit.jpg",
    "/gallery/anh vanzi 12.jpg",
    "/gallery/IMG_9569.jpg",
    "/gallery/IMG_9312.jpg",
    "/gallery/2959F730-64B7-41BD-8620-E6D494362380.jpg",
    imageAssets.avatar,
    ...imageAssets.gallery.map(img => img.src)
  ].filter((val, index, self) => val && self.indexOf(val) === index); // unique and truthy

  const getCoverDisplayName = (opt: string) => {
    if (opt.startsWith('data:image/')) {
      return `[Custom Upload] ${opt.substring(0, 30)}...`;
    }
    return opt.replace('/gallery/', '').replace('/', '');
  };

  // Reset backdoor counter using useRef to avoid re-renders and typescript warnings
  const lockClickCount = useRef<number>(0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-sans flex items-center justify-center px-4 relative overflow-hidden">
        {/* Dynamic decorative backdrop circles */}
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-[#F2BF00]/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-[#F2BF00]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#141416] border border-[#D7E2EA]/10 p-8 rounded-3xl text-center shadow-2xl relative z-10">
          <div 
            onClick={() => {
              lockClickCount.current += 1;
              if (lockClickCount.current >= 5) {
                if (window.confirm("Bạn có muốn đặt lại mã PIN quản trị về mặc định (2404)?")) {
                  saveAdminPIN("2404");
                  triggerToast("Mã PIN đã được reset về 2404!");
                }
                lockClickCount.current = 0;
              }
            }}
            className="w-16 h-16 bg-[#F2BF00]/10 border border-[#F2BF00]/30 rounded-full flex items-center justify-center mx-auto mb-6 text-[#F2BF00] cursor-pointer select-none active:scale-95 transition-transform"
            title="Nhấp 5 lần để reset mã PIN"
          >
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-medium uppercase tracking-widest text-white/90 mb-2">Hệ Thống Đã Khóa</h2>
          <p className="text-[10px] text-[#D7E2EA]/40 uppercase tracking-widest mb-8">Vui lòng nhập mã PIN quản trị</p>

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
            <div className="relative">
              <input
                type="password"
                placeholder="Nhập mã PIN (Mặc định: 2404)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError(null);
                }}
                className={`w-full bg-[#0c0c0e] border text-center text-lg tracking-widest outline-none px-4 py-3 rounded-2xl transition-colors ${
                  pinError ? 'border-red-500/50 focus:border-red-500' : 'border-[#D7E2EA]/10 focus:border-[#F2BF00]/50'
                }`}
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 font-medium">{pinError}</p>
            )}

            <button
              type="submit"
              className="bg-[#F2BF00] hover:bg-white text-black font-semibold uppercase text-xs tracking-widest py-3.5 rounded-2xl transition-all shadow"
            >
              Đăng Nhập
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
            <a
              href="#"
              className="text-xs text-[#D7E2EA]/40 hover:text-white transition-colors uppercase tracking-wider font-semibold inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại trang chủ
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-sans pb-16 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#F2BF00] text-black px-6 py-3 rounded-full font-bold shadow-lg text-sm animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Admin Navbar */}
      <nav className="w-full bg-[#141416]/95 border-b border-[#D7E2EA]/10 px-6 py-4 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <a 
            href="#" 
            className="p-2 rounded-full hover:bg-white/5 text-[#D7E2EA] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-base font-semibold uppercase tracking-widest text-white/95">Vanzi Control Center</h1>
            <p className="text-[9px] text-[#D7E2EA]/40 uppercase tracking-widest mt-0.5">Trang Quản Trị Hệ Thống</p>
          </div>
        </div>

        <a 
          href="#"
          className="bg-[#F2BF00] text-black hover:bg-white transition-colors text-xs font-semibold uppercase px-5 py-2.5 rounded-full tracking-widest shadow"
        >
          Xem Website
        </a>
      </nav>

      {/* Main Admin layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar (1 Column) */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left text-sm font-semibold uppercase tracking-wider transition-all border ${
              activeTab === 'analytics' 
                ? 'bg-[#F2BF00]/15 border-[#F2BF00]/50 text-[#F2BF00] shadow' 
                : 'bg-[#141416]/60 border-transparent hover:bg-[#141416]'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Thống kê truy cập
          </button>
          
          <button
            onClick={() => setActiveTab('music')}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left text-sm font-semibold uppercase tracking-wider transition-all border ${
              activeTab === 'music' 
                ? 'bg-[#F2BF00]/15 border-[#F2BF00]/50 text-[#F2BF00] shadow' 
                : 'bg-[#141416]/60 border-transparent hover:bg-[#141416]'
            }`}
          >
            <Music className="w-4 h-4" />
            Quản lý âm nhạc
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left text-sm font-semibold uppercase tracking-wider transition-all border ${
              activeTab === 'content' 
                ? 'bg-[#F2BF00]/15 border-[#F2BF00]/50 text-[#F2BF00] shadow' 
                : 'bg-[#141416]/60 border-transparent hover:bg-[#141416]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Sửa thông tin nội dung
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left text-sm font-semibold uppercase tracking-wider transition-all border ${
              activeTab === 'bookings' 
                ? 'bg-[#F2BF00]/15 border-[#F2BF00]/50 text-[#F2BF00] shadow' 
                : 'bg-[#141416]/60 border-transparent hover:bg-[#141416]'
            }`}
          >
            <Mail className="w-4 h-4" />
            Hộp thư Bookings
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left text-sm font-semibold uppercase tracking-wider transition-all border ${
              activeTab === 'pwa' 
                ? 'bg-[#F2BF00]/15 border-[#F2BF00]/50 text-[#F2BF00] shadow' 
                : 'bg-[#141416]/60 border-transparent hover:bg-[#141416]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Lối tắt điện thoại (PWA)
          </button>
        </div>

        {/* Content Panel (3 Columns) */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-6">
              
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#141416] border border-[#D7E2EA]/10 p-6 rounded-3xl text-left">
                  <div className="flex justify-between items-center mb-4 text-[#D7E2EA]/40">
                    <span className="text-[11px] uppercase font-semibold tracking-wider">Lượt Xem Trang</span>
                    <Eye className="w-4 h-4 text-[#F2BF00]" />
                  </div>
                  <h3 className="text-3xl font-light tracking-tight text-white">{stats.pageViews}</h3>
                  <p className="text-[10px] text-[#D7E2EA]/30 uppercase tracking-widest mt-1.5">Tổng số lượt tải trang</p>
                </div>

                <div className="bg-[#141416] border border-[#D7E2EA]/10 p-6 rounded-3xl text-left">
                  <div className="flex justify-between items-center mb-4 text-[#D7E2EA]/40">
                    <span className="text-[11px] uppercase font-semibold tracking-wider">Khách Truy Cập</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-light tracking-tight text-white">{stats.uniqueVisitors}</h3>
                  <p className="text-[10px] text-[#D7E2EA]/30 uppercase tracking-widest mt-1.5">Thiết bị độc nhất</p>
                </div>

                <div className="bg-[#141416] border border-[#D7E2EA]/10 p-6 rounded-3xl text-left">
                  <div className="flex justify-between items-center mb-4 text-[#D7E2EA]/40">
                    <span className="text-[11px] uppercase font-semibold tracking-wider">Lượt Nghe Nhạc</span>
                    <Play className="w-4 h-4 text-[#F2BF00]" />
                  </div>
                  <h3 className="text-3xl font-light tracking-tight text-white">
                    {Object.values(stats.trackPlays || {}).reduce((a, b) => a + b, 0)}
                  </h3>
                  <p className="text-[10px] text-[#D7E2EA]/30 uppercase tracking-widest mt-1.5">Tổng lượt nhấn Play nhạc</p>
                </div>
              </div>

              {/* Tracks Play Analytics Details */}
              <div className="bg-[#141416] border border-[#D7E2EA]/10 p-6 sm:p-8 rounded-3xl text-left">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-semibold uppercase tracking-widest text-white/90">Lượt Nghe Từng Bài Hát</h3>
                  <button 
                    onClick={handleResetStats}
                    className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D7E2EA]/50 hover:text-red-400 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Số Liệu
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {tracks.length > 0 ? (
                    tracks.map((track) => {
                      const count = stats.trackPlays?.[track.title] || 0;
                      // Calculate width pct relative to max plays
                      const allCounts = Object.values(stats.trackPlays || {});
                      const maxVal = allCounts.length > 0 ? Math.max(...allCounts, 1) : 1;
                      const widthPct = Math.min(100, (count / maxVal) * 100);

                      return (
                        <div key={track.title} className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span className="text-[#D7E2EA] truncate max-w-[70%]">{track.title}</span>
                            <span className="text-[#F2BF00]">{count} lượt nghe</span>
                          </div>
                          <div className="w-full h-2.5 bg-[#0C0C0C] rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${widthPct}%` }}
                              className="h-full bg-gradient-to-r from-[#F2BF00] to-[#E27E00] rounded-full transition-all duration-500"
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-[#D7E2EA]/40 text-center py-6">Chưa có bài hát nào trong playlist.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MUSIC MANAGER */}
          {activeTab === 'music' && (
            <div className="flex flex-col gap-8">
              
              {/* Form to Add New Song */}
              <form onSubmit={handleAddSong} className="bg-[#141416] border border-[#D7E2EA]/10 p-6 sm:p-8 rounded-3xl text-left">
                <h3 className="text-base font-semibold uppercase tracking-widest text-white/90 mb-6 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#F2BF00]" />
                  Thêm bài hát mới vào danh sách phát
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Tên bài hát</label>
                    <input 
                      type="text" 
                      placeholder="VD: ALL NIGHT"
                      value={newSong.title}
                      onChange={e => setNewSong({...newSong, title: e.target.value})}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Nghệ sĩ / Producer</label>
                    <input 
                      type="text" 
                      placeholder="VD: VANZI"
                      value={newSong.artist}
                      onChange={e => setNewSong({...newSong, artist: e.target.value})}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Thể loại nhạc</label>
                    <input 
                      type="text" 
                      placeholder="VD: Tech House, Hard Dance..."
                      value={newSong.genre}
                      onChange={e => setNewSong({...newSong, genre: e.target.value})}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Thời lượng (m:ss)</label>
                      <input 
                        type="text" 
                        placeholder="VD: 2:46"
                        value={newSong.duration}
                        onChange={e => setNewSong({...newSong, duration: e.target.value})}
                        className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm text-center"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Ảnh bìa (Cover)</label>
                      <select 
                        value={newSong.cover}
                        onChange={e => setNewSong({...newSong, cover: e.target.value})}
                        className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-3 py-2.5 rounded-xl text-sm w-full"
                      >
                        {dynamicCoverOptions.map(opt => (
                          <option key={opt} value={opt}>{getCoverDisplayName(opt)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Đường dẫn file nhạc (.mp3)</label>
                    <input 
                      type="text" 
                      placeholder="VD: /music/ALL NIGHT.mp3"
                      value={newSong.src}
                      onChange={e => setNewSong({...newSong, src: e.target.value})}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="mt-6 w-full md:w-auto bg-[#F2BF00] hover:bg-white text-black font-semibold uppercase text-xs tracking-widest px-6 py-3.5 rounded-xl transition-colors"
                >
                  Thêm bài hát
                </button>
              </form>

              {/* Edit Current Songs List */}
              <div className="bg-[#141416] border border-[#D7E2EA]/10 p-6 sm:p-8 rounded-3xl text-left">
                <h3 className="text-base font-semibold uppercase tracking-widest text-white/90 mb-6">
                  Danh sách bài hát hiện tại ({tracks.length})
                </h3>

                <div className="flex flex-col gap-6">
                  {tracks.map((track, index) => (
                    <div 
                      key={index} 
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/5 p-5 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative group"
                    >
                      {/* Song thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 flex-shrink-0">
                        <img src={track.cover} alt="" className="w-full h-full object-cover" />
                      </div>

                      {/* Inputs grid for editing song details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-grow w-full">
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] uppercase tracking-widest text-[#D7E2EA]/40">Tiêu Đề</span>
                          <input 
                            type="text" 
                            value={track.title}
                            onChange={e => handleUpdateSongField(index, 'title', e.target.value)}
                            className="bg-transparent border-b border-transparent focus:border-[#F2BF00] outline-none text-xs text-white font-bold"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] uppercase tracking-widest text-[#D7E2EA]/40">Nghệ sĩ / Producer</span>
                          <input 
                            type="text" 
                            value={track.artist}
                            onChange={e => handleUpdateSongField(index, 'artist', e.target.value)}
                            className="bg-transparent border-b border-transparent focus:border-[#F2BF00] outline-none text-xs text-[#D7E2EA]"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] uppercase tracking-widest text-[#D7E2EA]/40">Thể Loại</span>
                          <input 
                            type="text" 
                            value={track.genre}
                            onChange={e => handleUpdateSongField(index, 'genre', e.target.value)}
                            className="bg-transparent border-b border-transparent focus:border-[#F2BF00] outline-none text-xs text-[#F2BF00]/85"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] uppercase tracking-widest text-[#D7E2EA]/40">Ảnh bìa</span>
                          <select 
                            value={track.cover}
                            onChange={e => handleUpdateSongField(index, 'cover', e.target.value)}
                            className="bg-transparent border-b border-transparent focus:border-[#F2BF00] outline-none text-xs text-[#D7E2EA]/60 focus:bg-[#0c0c0e] w-full focus:max-w-[150px]"
                          >
                            {dynamicCoverOptions.map(opt => (
                              <option key={opt} value={opt}>{getCoverDisplayName(opt)}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Operations */}
                      <div className="flex items-center gap-2 self-end md:self-auto">
                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteSong(index)}
                          className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-colors"
                          title="Xóa bài hát"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT MANAGER */}
          {activeTab === 'content' && (
            <div className="bg-[#141416] border border-[#D7E2EA]/10 p-6 sm:p-8 rounded-3xl text-left flex flex-col gap-8">
              {/* 1. Hero Section Content */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#F2BF00] mb-2">Hero Section</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Tiêu đề chính Tiếng Việt (H1)</label>
                    <input 
                      type="text" 
                      value={heroContent.title}
                      onChange={e => setHeroContent({...heroContent, title: e.target.value})}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm text-white font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Tiêu đề chính English (H1 - EN)</label>
                    <input 
                      type="text" 
                      value={heroContent.titleEn || ""}
                      onChange={e => setHeroContent({...heroContent, titleEn: e.target.value})}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm text-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Mô tả ngắn Tiếng Việt</label>
                    <textarea 
                      value={heroContent.description}
                      onChange={e => setHeroContent({...heroContent, description: e.target.value})}
                      rows={2}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Mô tả ngắn English (EN)</label>
                    <textarea 
                      value={heroContent.descriptionEn || ""}
                      onChange={e => setHeroContent({...heroContent, descriptionEn: e.target.value})}
                      rows={2}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-[#D7E2EA]/10 my-2" />

              {/* 2. About Section Content */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#F2BF00] mb-2">About Section</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Họ và tên thật</label>
                    <input 
                      type="text" 
                      value={aboutContent.realName}
                      onChange={e => setAboutContent({...aboutContent, realName: e.target.value})}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Ngày sinh</label>
                    <input 
                      type="text" 
                      value={aboutContent.dob}
                      onChange={e => setAboutContent({...aboutContent, dob: e.target.value})}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Thể loại nhạc sở trường Tiếng Việt</label>
                    <input 
                      type="text" 
                      value={aboutContent.genres}
                      onChange={e => setAboutContent({...aboutContent, genres: e.target.value})}
                      placeholder="VD: Tech House, Hard Dance, Techno..."
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Thể loại nhạc sở trường English (EN)</label>
                    <input 
                      type="text" 
                      value={aboutContent.genresEn || ""}
                      onChange={e => setAboutContent({...aboutContent, genresEn: e.target.value})}
                      placeholder="VD: Tech House, Hard Dance, Techno..."
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Tiểu sử Tiếng Việt (Biography)</label>
                    <textarea 
                      value={aboutContent.bio}
                      onChange={e => setAboutContent({...aboutContent, bio: e.target.value})}
                      rows={5}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-3 rounded-xl text-sm leading-relaxed"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Tiểu sử English (Biography - EN)</label>
                    <textarea 
                      value={aboutContent.bioEn || ""}
                      onChange={e => setAboutContent({...aboutContent, bioEn: e.target.value})}
                      rows={5}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-3 rounded-xl text-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-[#D7E2EA]/10 my-2" />

              {/* Social Channels Section */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#F2BF00] mb-2">Mạng xã hội & Liên kết</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Facebook Cá Nhân (Facebook 1)</label>
                    <input 
                      type="text" 
                      value={socialLinks.fb1}
                      onChange={e => setSocialLinks({...socialLinks, fb1: e.target.value})}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Fanpage/Kênh phụ (Facebook 2)</label>
                    <input 
                      type="text" 
                      value={socialLinks.fb2}
                      onChange={e => setSocialLinks({...socialLinks, fb2: e.target.value})}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Instagram Link</label>
                    <input 
                      type="text" 
                      value={socialLinks.instagram}
                      onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">TikTok Link</label>
                    <input 
                      type="text" 
                      value={socialLinks.tiktok}
                      onChange={e => setSocialLinks({...socialLinks, tiktok: e.target.value})}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Email liên hệ / Hợp tác</label>
                  <input 
                    type="email" 
                    value={socialLinks.email}
                    onChange={e => setSocialLinks({...socialLinks, email: e.target.value})}
                    className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <hr className="border-[#D7E2EA]/10 my-2" />

              {/* Media Uploads Section */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#F2BF00] mb-2">Tải ảnh lên trang & Quản lý Media</h4>
                
                {/* Avatar Upload */}
                <div className="bg-[#0c0c0e]/80 border border-[#D7E2EA]/5 p-5 rounded-2xl flex flex-col sm:flex-row gap-5 items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-[#D7E2EA]/20 bg-neutral-900 flex-shrink-0 relative">
                    <img src={imageAssets.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-2 flex-grow w-full text-center sm:text-left">
                    <span className="text-xs font-semibold text-white">Ảnh đại diện nghệ sĩ (Avatar)</span>
                    <p className="text-[10px] text-[#D7E2EA]/40">Ảnh này hiển thị tại mục About và Trình nghe nhạc trên Banner.</p>
                    <label className="flex items-center justify-center gap-2 bg-[#F2BF00]/10 border border-[#F2BF00]/30 hover:bg-[#F2BF00] hover:text-black text-[#F2BF00] text-xs font-bold uppercase py-2 px-4 rounded-xl transition-all cursor-pointer w-max mx-auto sm:mx-0">
                      <Upload className="w-3.5 h-3.5" />
                      Tải ảnh mới
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* Gallery Management */}
                <div className="bg-[#0c0c0e]/80 border border-[#D7E2EA]/5 p-5 rounded-2xl flex flex-col gap-4">
                  <span className="text-xs font-semibold text-white">Thư viện ảnh trang chủ (Gallery Grid)</span>
                  
                  {/* Upload Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#141416]/50 p-4 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] uppercase tracking-widest text-[#D7E2EA]/40">Tiêu đề ảnh</span>
                      <input 
                        type="text" 
                        placeholder="VD: Studio Set" 
                        value={newGalleryImgTitle}
                        onChange={e => setNewGalleryImgTitle(e.target.value)}
                        className="bg-[#0c0c0e] border border-white/10 outline-none px-3 py-1.5 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] uppercase tracking-widest text-[#D7E2EA]/40">Phân loại (Category)</span>
                      <select 
                        value={newGalleryImgCategory}
                        onChange={e => setNewGalleryImgCategory(e.target.value)}
                        className="bg-[#0c0c0e] border border-white/10 outline-none px-2 py-1.5 rounded-lg text-xs"
                      >
                        <option value="Performance">Performance</option>
                        <option value="Production">Production</option>
                        <option value="Backstage">Backstage</option>
                        <option value="Live Set">Live Set</option>
                        <option value="Promo">Promo</option>
                        <option value="Behind the Scenes">Behind the Scenes</option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-end mt-2 sm:mt-0">
                      <label className="flex items-center justify-center gap-1.5 bg-[#F2BF00]/10 border border-[#F2BF00]/30 hover:bg-[#F2BF00] hover:text-black text-[#F2BF00] text-xs font-bold uppercase py-2 px-3 rounded-lg transition-all cursor-pointer text-center w-full">
                        <Upload className="w-3.5 h-3.5" />
                        Chọn ảnh & Tải lên
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleGalleryUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>

                  {/* Image Grid with Deletions */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2">
                    {imageAssets.gallery.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-white/5 bg-neutral-900">
                        <img src={img.src} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <span className="text-[8px] text-[#F2BF00] truncate font-bold">{img.category}</span>
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[9px] text-white truncate max-w-[65%] font-medium">{img.title}</span>
                            <button 
                              type="button"
                              onClick={() => handleDeleteGalleryImage(i)}
                              className="p-1 rounded bg-red-500 hover:bg-red-600 text-white transition-colors"
                              title="Xóa ảnh"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stage Moments Management */}
                <div className="bg-[#0c0c0e]/80 border border-[#D7E2EA]/5 p-5 rounded-2xl flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-white">Khoảnh khắc sân khấu (Stage Moments Carousel)</span>
                    <label className="flex items-center gap-1 bg-[#F2BF00]/10 border border-[#F2BF00]/30 hover:bg-[#F2BF00] hover:text-black text-[#F2BF00] text-[10px] font-bold uppercase py-1.5 px-3 rounded-lg transition-all cursor-pointer">
                      <Upload className="w-3 h-3" />
                      Tải thêm ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleStageMomentUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {/* Image list with Deletions */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {imageAssets.stageMoments.map((src, i) => (
                      <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden group border border-white/5 bg-neutral-900">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => handleDeleteStageMoment(i)}
                            className="p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all scale-75 group-hover:scale-100 shadow-lg"
                            title="Xóa khoảnh khắc"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="border-[#D7E2EA]/10 my-2" />

              {/* EPK Management Section */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#F2BF00] mb-2">Tài liệu báo chí (EPK)</h4>
                <p className="text-[10px] text-[#D7E2EA]/40 uppercase tracking-widest mb-1">
                  Đường dẫn liên kết tải EPK (Google Drive, Dropbox) hoặc tải trực tiếp file PDF/ZIP có kích thước nhỏ hơn 2.5MB.
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex flex-col gap-1.5 flex-grow w-full">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Liên kết EPK tùy chỉnh (URL)</label>
                    <input 
                      type="text" 
                      value={epkLink.startsWith('data:') ? "" : epkLink}
                      onChange={e => {
                        setEpkLink(e.target.value);
                        saveEPK(e.target.value);
                      }}
                      placeholder={epkLink.startsWith('data:') ? "Đã upload file trực tiếp (Xóa file để nhập URL)" : "VD: https://drive.google.com/..."}
                      disabled={epkLink.startsWith('data:')}
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm text-white disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <label className="flex items-center justify-center gap-2 bg-[#F2BF00]/10 border border-[#F2BF00]/30 hover:bg-[#F2BF00] hover:text-black text-[#F2BF00] text-xs font-bold uppercase py-3 px-5 rounded-xl transition-all cursor-pointer text-center w-full md:w-max">
                      <Upload className="w-3.5 h-3.5" />
                      Tải lên file EPK
                      <input 
                        type="file" 
                        accept=".pdf,.zip,.png,.jpg,.jpeg,.x-zip-compressed" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          if (file.size > 2.5 * 1024 * 1024) {
                            alert("Kích thước tệp quá lớn! Vui lòng chọn tệp nhỏ hơn 2.5MB.");
                            return;
                          }
                          
                          try {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              setEpkLink(base64);
                              saveEPK(base64);
                              triggerToast("Đã tải lên tệp EPK thành công!");
                            };
                            reader.readAsDataURL(file);
                          } catch (err) {
                            console.error(err);
                            alert("Lỗi tải tệp lên, vui lòng thử lại!");
                          }
                        }} 
                        className="hidden" 
                      />
                    </label>

                    {epkLink && (
                      <button 
                        type="button"
                        onClick={() => {
                          if (window.confirm("Bạn có chắc chắn muốn xóa liên kết/tệp EPK hiện tại?")) {
                            setEpkLink("");
                            saveEPK("");
                            triggerToast("Đã xóa EPK tùy chỉnh.");
                          }
                        }}
                        className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-colors"
                        title="Xóa EPK"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                {epkLink && epkLink.startsWith('data:') && (
                  <div className="text-[10px] text-emerald-400 font-medium">
                    ✓ Đã lưu trữ tệp tin EPK trong bộ nhớ trình duyệt.
                  </div>
                )}
              </div>

              <hr className="border-[#D7E2EA]/10 my-2" />

              {/* Gigs Manager Section */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#F2BF00] mb-2">Quản lý Lịch diễn (Gigs History)</h4>
                
                {/* Form to Add New Gig */}
                <div className="bg-[#0c0c0e]/80 border border-[#D7E2EA]/5 p-5 rounded-2xl flex flex-col gap-4">
                  <span className="text-xs font-semibold text-white">Thêm sự kiện biểu diễn mới</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Ngày diễn</label>
                      <input 
                        type="text" 
                        placeholder="VD: 24/04/2026"
                        value={newGig.date}
                        onChange={e => setNewGig({...newGig, date: e.target.value})}
                        className="bg-[#0c0c0e] border border-white/10 focus:border-[#F2BF00]/50 outline-none px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Địa điểm (Venue)</label>
                      <input 
                        type="text" 
                        placeholder="VD: 1900 Club"
                        value={newGig.venue}
                        onChange={e => setNewGig({...newGig, venue: e.target.value})}
                        className="bg-[#0c0c0e] border border-white/10 focus:border-[#F2BF00]/50 outline-none px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Thành phố (City)</label>
                      <input 
                        type="text" 
                        placeholder="VD: Hanoi"
                        value={newGig.city}
                        onChange={e => setNewGig({...newGig, city: e.target.value})}
                        className="bg-[#0c0c0e] border border-white/10 focus:border-[#F2BF00]/50 outline-none px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Quốc gia (Country)</label>
                      <input 
                        type="text" 
                        placeholder="VD: Vietnam"
                        value={newGig.country}
                        onChange={e => setNewGig({...newGig, country: e.target.value})}
                        className="bg-[#0c0c0e] border border-white/10 focus:border-[#F2BF00]/50 outline-none px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Thể loại sự kiện Tiếng Việt</label>
                      <input 
                        type="text" 
                        placeholder="VD: Club Set"
                        value={newGig.type}
                        onChange={e => setNewGig({...newGig, type: e.target.value})}
                        className="bg-[#0c0c0e] border border-white/10 focus:border-[#F2BF00]/50 outline-none px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Thể loại sự kiện English (EN)</label>
                      <input 
                        type="text" 
                        placeholder="VD: Club Set"
                        value={newGig.typeEn}
                        onChange={e => setNewGig({...newGig, typeEn: e.target.value})}
                        className="bg-[#0c0c0e] border border-white/10 focus:border-[#F2BF00]/50 outline-none px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>

                    <button 
                      type="button"
                      onClick={() => {
                        if (!newGig.date || !newGig.venue || !newGig.city || !newGig.country) {
                          alert("Vui lòng điền đầy đủ thông tin sự kiện!");
                          return;
                        }
                        const addedGig: Gig = {
                          ...newGig,
                          id: "gig-" + Date.now(),
                          status: 'past'
                        };
                        const updatedGigs = [addedGig, ...gigs];
                        setGigs(updatedGigs);
                        saveGigs(updatedGigs);
                        
                        setNewGig({
                          date: "",
                          venue: "",
                          city: "",
                          country: "",
                          type: "Club Set",
                          typeEn: "Club Set",
                          status: "past"
                        });
                        triggerToast("Đã thêm sự kiện lịch diễn mới!");
                      }}
                      className="bg-[#F2BF00] hover:bg-white text-black font-bold uppercase text-[10px] tracking-wider py-2.5 px-4 rounded-xl transition-all h-max w-full"
                    >
                      Thêm Lịch Diễn
                    </button>
                  </div>
                </div>

                {/* Gigs List with Deletions */}
                <div className="bg-[#0c0c0e]/50 border border-white/5 p-4 rounded-xl flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                  {gigs.length > 0 ? (
                    gigs.map((g) => (
                      <div key={g.id} className="flex justify-between items-center bg-[#141416]/80 p-3 rounded-lg border border-white/5 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-grow truncate">
                          <span className="font-mono text-[#F2BF00] font-semibold flex-shrink-0">{g.date}</span>
                          <span className="font-bold text-white truncate max-w-[150px] sm:max-w-xs">{g.venue}</span>
                          <span className="text-[#D7E2EA]/60 truncate">{g.city}, {g.country}</span>
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-[#D7E2EA]/85 flex-shrink-0">{g.type} / {g.typeEn}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
                              const updated = gigs.filter(item => item.id !== g.id);
                              setGigs(updated);
                              saveGigs(updated);
                              triggerToast("Đã xóa sự kiện lịch diễn!");
                            }
                          }}
                          className="p-1.5 rounded hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors ml-4 flex-shrink-0"
                          title="Xóa sự kiện"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#D7E2EA]/40 text-center py-4">Chưa có sự kiện nào.</p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <button 
                onClick={handleSaveContent}
                className="mt-4 flex items-center justify-center gap-2 bg-[#F2BF00] hover:bg-white text-black font-semibold uppercase text-xs tracking-widest py-3.5 rounded-xl transition-colors w-full"
              >
                <Save className="w-4 h-4" />
                Lưu Thay Đổi Nội Dung
              </button>

              <hr className="border-[#D7E2EA]/10 my-4" />

              {/* 3. Change PIN Panel */}
              <form onSubmit={handleChangePIN} className="flex flex-col gap-4 mt-2">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#F2BF00] mb-2">Đổi mã PIN bảo mật</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Mã PIN hiện tại</label>
                    <input 
                      type="password" 
                      value={currentPin}
                      onChange={e => setCurrentPin(e.target.value)}
                      placeholder="Mặc định: 2404"
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm text-center text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Mã PIN mới (tối thiểu 4 số)</label>
                    <input 
                      type="password" 
                      value={newPin}
                      onChange={e => setNewPin(e.target.value)}
                      placeholder="Nhập mã PIN mới"
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm text-center text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-medium">Xác nhận mã PIN mới</label>
                    <input 
                      type="password" 
                      value={confirmNewPin}
                      onChange={e => setConfirmNewPin(e.target.value)}
                      placeholder="Xác nhận mã PIN mới"
                      className="bg-[#0c0c0e] border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-2.5 rounded-xl text-sm text-center text-white"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-[#F2BF00]/10 border border-[#F2BF00]/30 hover:bg-[#F2BF00] hover:text-black text-[#F2BF00] font-semibold uppercase text-xs tracking-widest py-3 rounded-xl transition-all"
                >
                  Cập Nhật Mã PIN Mới
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: BOOKINGS INBOX */}
          {activeTab === 'bookings' && (
            <div className="bg-[#141416] border border-[#D7E2EA]/10 p-6 sm:p-8 rounded-3xl text-left flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold uppercase tracking-widest text-white/90">
                    Hộp thư Booking Yêu Cầu
                  </h3>
                  <p className="text-[10px] text-[#D7E2EA]/40 uppercase tracking-widest mt-0.5">
                    Danh sách yêu cầu biểu diễn nhận được từ khách truy cập website
                  </p>
                </div>
                {bookings.length > 0 && (
                  <button 
                    onClick={() => {
                      if (window.confirm("Bạn có chắc chắn muốn xóa tất cả thư booking?")) {
                        setBookings([]);
                        saveBookings([]);
                        triggerToast("Đã xóa toàn bộ thư booking!");
                      }
                    }}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Xóa tất cả
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {bookings.length > 0 ? (
                  [...bookings].reverse().map((b) => (
                    <div 
                      key={b.id} 
                      className="bg-[#0c0c0e] border border-white/5 hover:border-[#F2BF00]/20 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-start transition-all"
                    >
                      <div className="flex-grow flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="text-sm font-bold text-white">{b.clientName}</span>
                          <span className="text-[10px] bg-[#F2BF00]/10 text-[#F2BF00] px-2 py-0.5 rounded font-medium">
                            {b.eventType}
                          </span>
                          <span className="text-[10px] text-[#D7E2EA]/40 font-mono">
                            {new Date(b.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1 text-xs text-[#D7E2EA]/60">
                          <div>
                            <span className="font-semibold text-[#D7E2EA]/40">Email: </span>
                            <a href={`mailto:${b.email}`} className="text-white hover:text-[#F2BF00] hover:underline font-mono">{b.email}</a>
                          </div>
                          <div>
                            <span className="font-semibold text-[#D7E2EA]/40">Điện thoại: </span>
                            <a href={`tel:${b.phone}`} className="text-white hover:text-[#F2BF00] hover:underline font-mono">{b.phone}</a>
                          </div>
                          <div>
                            <span className="font-semibold text-[#D7E2EA]/40">Ngày sự kiện: </span>
                            <span className="text-white font-mono">{b.date}</span>
                          </div>
                          <div className="md:col-span-3">
                            <span className="font-semibold text-[#D7E2EA]/40">Địa điểm/Hội trường: </span>
                            <span className="text-white">{b.venue}</span>
                          </div>
                        </div>
                        
                        {b.message && (
                          <div className="mt-2 text-xs text-[#D7E2EA]/80 bg-[#141416]/50 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">
                            {b.message}
                          </div>
                        )}
                      </div>

                      <button 
                        type="button"
                        onClick={() => {
                          if (window.confirm("Bạn có chắc chắn muốn xóa thư booking này?")) {
                            const updated = bookings.filter(item => item.id !== b.id);
                            setBookings(updated);
                            saveBookings(updated);
                            triggerToast("Đã xóa thư booking!");
                          }
                        }}
                        className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-colors self-end sm:self-center"
                        title="Xóa thư"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-[#D7E2EA]/30">
                    <Mail className="w-8 h-8 mx-auto mb-3 text-[#D7E2EA]/20 animate-pulse" />
                    <p className="text-xs uppercase tracking-wider">Hộp thư trống</p>
                    <p className="text-[10px] lowercase text-[#D7E2EA]/20 mt-1">Các liên hệ từ khách đặt lịch sẽ hiển thị tại đây</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MOBILE SHORTCUT & PWA */}
          {activeTab === 'pwa' && (
            <div className="flex flex-col gap-6">
              
              {/* Install Trigger Card */}
              <div className="bg-[#141416] border border-[#D7E2EA]/10 p-6 sm:p-8 rounded-3xl text-left">
                <h3 className="text-base font-semibold uppercase tracking-widest text-white/90 mb-3">
                  Tạo Lối Tắt Trên Điện Thoại (Install PWA)
                </h3>
                <p className="text-sm text-[#D7E2EA]/60 leading-relaxed mb-6">
                  VANZI ON DA BEAT hỗ trợ chạy như một ứng dụng độc lập trên điện thoại mà không cần tải từ App Store. Cài đặt sẽ giúp tạo biểu tượng Vanzi ngay trên màn hình chính của bạn, hoạt động mượt mà và load cực nhanh.
                </p>

                {deferredPrompt ? (
                  <button 
                    onClick={handleInstallApp}
                    className="flex items-center gap-2 bg-[#F2BF00] hover:bg-white text-black font-semibold uppercase text-xs tracking-widest px-6 py-3.5 rounded-xl transition-colors shadow-lg"
                  >
                    <Smartphone className="w-4 h-4" />
                    Cài đặt ngay lập tức
                  </button>
                ) : (
                  <div className="bg-[#0c0c0e] border border-white/5 p-4 rounded-xl text-xs text-[#D7E2EA]/50">
                    Nút cài đặt nhanh khả dụng khi bạn truy cập trang web bằng trình duyệt Google Chrome trên Android/Máy tính.
                  </div>
                )}
              </div>

              {/* Step-by-Step Mobile Instructions */}
              <div className="bg-[#141416] border border-[#D7E2EA]/10 p-6 sm:p-8 rounded-3xl text-left">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[#F2BF00] mb-6">
                  Hướng Dẫn Thêm Vào Màn Hình Chính Thủ Công
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* iOS Safari */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-medium text-white bg-white/10 px-3 py-1.5 rounded-lg w-max uppercase">Dành cho iOS (iPhone/iPad)</span>
                    <ol className="list-decimal list-inside text-xs text-[#D7E2EA]/75 flex flex-col gap-2 leading-relaxed">
                      <li>Mở trang web bằng trình duyệt <strong className="text-white">Safari</strong>.</li>
                      <li>Nhấn vào biểu tượng <strong className="text-white">Chia sẻ (Share)</strong> ở thanh dưới cùng (hình vuông có mũi tên lên).</li>
                      <li>Cuộn xuống dưới và chọn <strong className="text-white">Thêm vào MH chính (Add to Home Screen)</strong>.</li>
                      <li>Đặt tên tùy ý và nhấn <strong className="text-white">Thêm (Add)</strong> ở góc trên bên phải.</li>
                    </ol>
                  </div>

                  {/* Android Chrome */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-medium text-white bg-white/10 px-3 py-1.5 rounded-lg w-max uppercase">Dành cho Android (Samsung/Oppo/...)</span>
                    <ol className="list-decimal list-inside text-xs text-[#D7E2EA]/75 flex flex-col gap-2 leading-relaxed">
                      <li>Mở trang web bằng trình duyệt <strong className="text-white">Google Chrome</strong>.</li>
                      <li>Nhấn vào biểu tượng <strong className="text-white">3 dấu chấm</strong> ở góc trên bên phải.</li>
                      <li>Chọn dòng <strong className="text-white">Thêm vào màn hình chính</strong> hoặc <strong className="text-white">Cài đặt ứng dụng</strong>.</li>
                      <li>Xác nhận và hệ thống sẽ tự động thêm icon ra màn hình điện thoại của bạn.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
