export interface Track {
  title: string;
  artist: string;
  genre: string;
  duration: string;
  durationSeconds: number;
  cover: string;
  src: string;
}

export interface AboutContent {
  bio: string;
  bioEn: string;
  realName: string;
  dob: string;
  genres: string;
  genresEn: string;
}

export interface HeroContent {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export interface Gig {
  id: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  type: string;
  typeEn: string;
  status: 'past' | 'upcoming';
}

export interface BookingInquiry {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  date: string;
  venue: string;
  eventType: string;
  message: string;
  createdAt: string;
}

export interface GalleryImage {
  src: string;
  title: string;
  category: string;
}

export interface SocialLinks {
  fb1: string;
  fb2: string;
  instagram: string;
  tiktok: string;
  email: string;
}

export interface ImageAssets {
  avatar: string;
  gallery: GalleryImage[];
  stageMoments: string[];
}


export interface TrafficStats {
  pageViews: number;
  uniqueVisitors: number;
  trackPlays: Record<string, number>;
}

const DEFAULT_TRACKS: Track[] = [
  {
    title: "ALL NIGHT",
    artist: "VANZI",
    genre: "Tech House",
    duration: "2:46",
    durationSeconds: 166,
    cover: "/gallery/vanzi f1 edit.jpg",
    src: "/music/ALL NIGHT.mp3"
  },
  {
    title: "CHINA DANCE",
    artist: "VANZI",
    genre: "Hard Dance",
    duration: "2:12",
    durationSeconds: 132,
    cover: "/gallery/anh vanzi 12.jpg",
    src: "/music/CHINA DANCE.mp3"
  },
  {
    title: "DAME UN GRR",
    artist: "VANZI",
    genre: "Tech House",
    duration: "2:00",
    durationSeconds: 120,
    cover: "/gallery/IMG_9569.jpg",
    src: "/music/DAME UN GRR .mp3"
  },
  {
    title: "Beauty And A Beat (ft. Nicki Minaj)",
    artist: "Justin Bieber x VANZI",
    genre: "Electro Pop",
    duration: "1:38",
    durationSeconds: 98,
    cover: "/gallery/IMG_9312.jpg",
    src: "/music/Justin Bieber - Beauty And A Beat ft. Nicki Minaj .mp3"
  },
  {
    title: "Rock It (Wilkinson Remix)",
    artist: "Wilkinson x VANZI",
    genre: "Drum & Bass",
    duration: "4:12",
    durationSeconds: 253,
    cover: "/gallery/2959F730-64B7-41BD-8620-E6D494362380.jpg",
    src: "/music/Rock It - Wilkinson Remix.mp3"
  }
];

const DEFAULT_ABOUT: AboutContent = {
  bio: "DJ VANZI (Since 2016) – Người dẫn dắt cảm xúc và kết nối đám đông qua những hành trình âm thanh độc bản. Không thỏa hiệp với những giới hạn, âm nhạc của VANZI là sự biến hóa linh hoạt giữa năng lượng tươi sáng, những khoảng lặng bay bổng và chất Techno gai góc, huyền bí. 10 năm thực chiến, một bản sắc riêng biệt.",
  bioEn: "DJ VANZI (Since 2016) – Guiding emotions and connecting crowds through unique sonic journeys. Uncompromising with limits, VANZI's music is a dynamic transition between bright energy, floating pauses, and gritty, mysterious Techno. 10 years of experience, one distinct identity.",
  realName: "Nguyễn Việt Anh",
  dob: "24/04/1998",
  genres: "Tech House, Hard Dance, Techno, Deep House, VinaHouse",
  genresEn: "Tech House, Hard Dance, Techno, Deep House, VinaHouse"
};

const DEFAULT_HERO: HeroContent = {
  title: "Hi, i'm vanzi",
  titleEn: "Hi, i'm vanzi",
  description: "a dj & producer driven by crafting striking and unforgettable sets",
  descriptionEn: "a dj & producer driven by crafting striking and unforgettable sets"
};

const DEFAULT_GIGS: Gig[] = [
  {
    id: "gig-1",
    date: "12/04/2026",
    venue: "1900 Le Théâtre",
    city: "Hanoi",
    country: "Vietnam",
    type: "Club Set",
    typeEn: "Club Set",
    status: "past"
  },
  {
    id: "gig-2",
    date: "28/03/2026",
    venue: "Ravolution Music Festival",
    city: "HCMC",
    country: "Vietnam",
    type: "Mainstage",
    typeEn: "Mainstage",
    status: "past"
  },
  {
    id: "gig-4",
    date: "31/12/2025",
    venue: "Countdown 2026",
    city: "Hanoi",
    country: "Vietnam",
    type: "Festival",
    typeEn: "Festival",
    status: "past"
  },
  {
    id: "gig-5",
    date: "26/07/2025",
    venue: "Tomorrowland",
    city: "Boom",
    country: "Belgium",
    type: "Mainstage",
    typeEn: "Mainstage",
    status: "past"
  },
  {
    id: "gig-6",
    date: "22/03/2025",
    venue: "Ultra Music Festival",
    city: "Miami",
    country: "USA",
    type: "Worldwide Stage",
    typeEn: "Worldwide Stage",
    status: "past"
  }
];

const DEFAULT_SOCIAL: SocialLinks = {
  fb1: "https://www.facebook.com/viet.anh.nguyen.291622/",
  fb2: "https://www.facebook.com/xDJ.VANZ",
  instagram: "https://www.instagram.com/vietanhnguyen.raw/",
  tiktok: "https://www.tiktok.com/@dj_vanz",
  email: "nguyenvietanh2169@gmail.com"
};

const DEFAULT_IMAGES: ImageAssets = {
  avatar: "/vanzi-photo.jpg",
  gallery: [
    {
      src: "/gallery/vanzi f1 edit.jpg",
      title: "DJ Deck Control",
      category: "Performance"
    },
    {
      src: "/gallery/IMG_9569.jpg",
      title: "Studio Session",
      category: "Production"
    },
    {
      src: "/gallery/2959F730-64B7-41BD-8620-E6D494362380.jpg",
      title: "Sound Check",
      category: "Backstage"
    },
    {
      src: "/gallery/616454703_3834944400133424_9041727728842679266_n.jpg",
      title: "Neon Club Vibe",
      category: "Live Set"
    },
    {
      src: "/gallery/IMG_9312.jpg",
      title: "EP Portrait",
      category: "Promo"
    },
    {
      src: "/gallery/anh vanzi 12.jpg",
      title: "Backstage Prep",
      category: "Behind the Scenes"
    }
  ],
  stageMoments: [
    "/gallery/show/IMG_0097.JPG",
    "/gallery/show/484809765_960371929623079_2202573474252920259_n.jpg",
    "/gallery/show/484890275_961088009551471_8778091926097455371_n.jpg",
    "/gallery/show/IMG_0098.JPG",
    "/gallery/show/484993629_959867376340201_3404273182109211280_n.jpg",
    "/gallery/show/485004195_960246179635654_450419896515082030_n.jpg",
    "/gallery/show/IMG_0100.JPG",
    "/gallery/show/485579790_960718872921718_4885328115208143225_n.jpg",
    "/gallery/show/485727424_3562261694068364_1764924610546573723_n.jpg",
    "/gallery/show/IMG_0103.JPG",
    "/gallery/show/IMG_1465.JPG",
    "/gallery/show/135552272_2504632613164616_2798930206340704749_n.jpg",
    "/gallery/show/IMG_5087.JPG"
  ]
};

const KEYS = {
  TRACKS: "vanzi_tracks",
  ABOUT: "vanzi_about",
  HERO: "vanzi_hero",
  STATS: "vanzi_stats",
  VISITED: "vanzi_visited",
  PIN: "vanzi_admin_pin",
  SOCIAL: "vanzi_social",
  IMAGES: "vanzi_images",
  GIGS: "vanzi_gigs",
  BOOKINGS: "vanzi_bookings",
  EPK: "vanzi_epk"
};

export const getTracks = (): Track[] => {
  const data = localStorage.getItem(KEYS.TRACKS);
  if (!data) {
    localStorage.setItem(KEYS.TRACKS, JSON.stringify(DEFAULT_TRACKS));
    return DEFAULT_TRACKS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_TRACKS;
  }
};

export const saveTracks = (tracks: Track[]): void => {
  localStorage.setItem(KEYS.TRACKS, JSON.stringify(tracks));
};

export const getAboutContent = (): AboutContent => {
  const data = localStorage.getItem(KEYS.ABOUT);
  if (!data) {
    localStorage.setItem(KEYS.ABOUT, JSON.stringify(DEFAULT_ABOUT));
    return DEFAULT_ABOUT;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_ABOUT;
  }
};

export const saveAboutContent = (content: AboutContent): void => {
  localStorage.setItem(KEYS.ABOUT, JSON.stringify(content));
};

export const getHeroContent = (): HeroContent => {
  const data = localStorage.getItem(KEYS.HERO);
  if (!data) {
    localStorage.setItem(KEYS.HERO, JSON.stringify(DEFAULT_HERO));
    return DEFAULT_HERO;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_HERO;
  }
};

export const saveHeroContent = (content: HeroContent): void => {
  localStorage.setItem(KEYS.HERO, JSON.stringify(content));
};

export const getStats = (): TrafficStats => {
  const data = localStorage.getItem(KEYS.STATS);
  const defaultStats: TrafficStats = { pageViews: 0, uniqueVisitors: 0, trackPlays: {} };
  if (!data) {
    localStorage.setItem(KEYS.STATS, JSON.stringify(defaultStats));
    return defaultStats;
  }
  try {
    return JSON.parse(data);
  } catch {
    return defaultStats;
  }
};

export const incrementPageView = (): void => {
  const stats = getStats();
  stats.pageViews += 1;
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
};

export const incrementUniqueVisitor = (): void => {
  const visited = localStorage.getItem(KEYS.VISITED);
  if (!visited) {
    localStorage.setItem(KEYS.VISITED, "true");
    const stats = getStats();
    stats.uniqueVisitors += 1;
    localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  }
};

export const incrementTrackPlay = (title: string): void => {
  const stats = getStats();
  if (!stats.trackPlays) {
    stats.trackPlays = {};
  }
  stats.trackPlays[title] = (stats.trackPlays[title] || 0) + 1;
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
};

export const resetStats = (): void => {
  const defaultStats: TrafficStats = { pageViews: 0, uniqueVisitors: 0, trackPlays: {} };
  localStorage.setItem(KEYS.STATS, JSON.stringify(defaultStats));
  localStorage.removeItem(KEYS.VISITED);
};

export const getAdminPIN = (): string => {
  return localStorage.getItem(KEYS.PIN) || "2404";
};

export const saveAdminPIN = (pin: string): void => {
  localStorage.setItem(KEYS.PIN, pin);
};

export const getSocialLinks = (): SocialLinks => {
  const data = localStorage.getItem(KEYS.SOCIAL);
  if (!data) {
    localStorage.setItem(KEYS.SOCIAL, JSON.stringify(DEFAULT_SOCIAL));
    return DEFAULT_SOCIAL;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_SOCIAL;
  }
};

export const saveSocialLinks = (links: SocialLinks): void => {
  localStorage.setItem(KEYS.SOCIAL, JSON.stringify(links));
};

export const getImageAssets = (): ImageAssets => {
  const data = localStorage.getItem(KEYS.IMAGES);
  if (!data) {
    localStorage.setItem(KEYS.IMAGES, JSON.stringify(DEFAULT_IMAGES));
    return DEFAULT_IMAGES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_IMAGES;
  }
};

export const saveImageAssets = (assets: ImageAssets): void => {
  localStorage.setItem(KEYS.IMAGES, JSON.stringify(assets));
};

export const compressAndConvertImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate dimensions to maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string); // fallback to original base64 if canvas context fails
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const getGigs = (): Gig[] => {
  const data = localStorage.getItem(KEYS.GIGS);
  if (!data) {
    localStorage.setItem(KEYS.GIGS, JSON.stringify(DEFAULT_GIGS));
    return DEFAULT_GIGS;
  }
  try {
    let list = JSON.parse(data) as Gig[];
    const originalLength = list.length;
    
    // Remove Kaizen Club if exists
    list = list.filter(g => g.venue !== "Kaizen Club");
    
    // Add Tomorrowland if missing
    if (!list.some(g => g.venue === "Tomorrowland")) {
      list.push({
        id: "gig-5",
        date: "26/07/2025",
        venue: "Tomorrowland",
        city: "Boom",
        country: "Belgium",
        type: "Mainstage",
        typeEn: "Mainstage",
        status: "past"
      });
    }
    
    // Add Ultra Music Festival if missing
    if (!list.some(g => g.venue === "Ultra Music Festival")) {
      list.push({
        id: "gig-6",
        date: "22/03/2025",
        venue: "Ultra Music Festival",
        city: "Miami",
        country: "USA",
        type: "Worldwide Stage",
        typeEn: "Worldwide Stage",
        status: "past"
      });
    }
    
    if (list.length !== originalLength || originalLength === 0) {
      localStorage.setItem(KEYS.GIGS, JSON.stringify(list));
    }
    return list;
  } catch {
    return DEFAULT_GIGS;
  }
};

export const saveGigs = (gigs: Gig[]): void => {
  localStorage.setItem(KEYS.GIGS, JSON.stringify(gigs));
};

export const getBookings = (): BookingInquiry[] => {
  const data = localStorage.getItem(KEYS.BOOKINGS);
  if (!data) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveBookings = (bookings: BookingInquiry[]): void => {
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
};

export const addBookingInquiry = (inquiry: Omit<BookingInquiry, 'id' | 'createdAt'>): void => {
  const bookings = getBookings();
  const newInquiry: BookingInquiry = {
    ...inquiry,
    id: "booking-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
    createdAt: new Date().toISOString()
  };
  bookings.push(newInquiry);
  saveBookings(bookings);
};

export const getEPK = (): string => {
  return localStorage.getItem(KEYS.EPK) || "";
};

export const saveEPK = (epk: string): void => {
  localStorage.setItem(KEYS.EPK, epk);
};
