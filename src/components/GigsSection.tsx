import React, { useState } from 'react';
import { getGigs } from '../utils/storage';
import type { Gig } from '../utils/storage';
import { Calendar, MapPin, Music } from 'lucide-react';
import { FadeIn } from './FadeIn';

interface GigsSectionProps {
  lang: 'vi' | 'en';
}

export const GigsSection: React.FC<GigsSectionProps> = ({ lang }) => {
  const [gigs] = useState<Gig[]>(() => getGigs().filter(g => g.status === 'past'));

  return (
    <section 
      id="gigs" 
      className="relative py-20 sm:py-28 w-full bg-[#0C0C0C] border-b border-white/5 overflow-hidden"
    >
      {/* Decorative Blur Ambient Glows */}
      <div className="absolute top-[30%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#F2BF00]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#E27E00]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center md:text-left mb-12 sm:mb-16">
          <FadeIn delay={0} y={30} as="div">
            <span className="text-[#F2BF00] text-xs sm:text-sm uppercase tracking-widest font-mono font-bold mb-2 block">
              {lang === 'vi' ? 'HÀNH TRÌNH ĐÃ QUA' : 'SONIC JOURNEY'}
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight hero-heading leading-none">
              {lang === 'vi' ? 'Sự Kiện Đã Qua' : 'Past Gigs'}
            </h2>
          </FadeIn>
        </div>

        {/* Gigs Timeline / List */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {gigs.length > 0 ? (
            gigs.map((gig, index) => (
              <FadeIn 
                key={gig.id} 
                delay={index * 0.08} 
                y={20}
                className="w-full"
                as="div"
              >
                <div 
                  className="bg-[#141416]/60 border border-[#D7E2EA]/10 hover:border-white/20 p-5 sm:p-6 rounded-3xl transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md"
                >
                  {/* Date & Venue details */}
                  <div className="flex items-center gap-4 flex-grow min-w-0">
                    {/* Calendar Badge */}
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center flex-shrink-0 text-[#D7E2EA] group-hover:bg-[#F2BF00]/10 group-hover:border-[#F2BF00]/30 transition-all">
                      <Calendar className="w-5 h-5 text-[#D7E2EA]/60 group-hover:text-[#F2BF00] transition-colors" />
                    </div>

                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-[10px] sm:text-xs font-mono text-[#D7E2EA]/40 uppercase tracking-widest">
                        {gig.date}
                      </span>
                      <h4 className="text-lg sm:text-xl font-bold uppercase text-white truncate tracking-wide mt-0.5">
                        {gig.venue}
                      </h4>
                    </div>
                  </div>

                  {/* Location & Show Type details */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full md:w-auto md:justify-end">
                    {/* Location Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-[#D7E2EA]/60 font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{gig.city}, {gig.country}</span>
                    </div>

                    {/* Show Type Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-[#F2BF00]/80 font-bold bg-[#F2BF00]/5 px-3 py-1.5 rounded-full border border-[#F2BF00]/15">
                      <Music className="w-3.5 h-3.5 text-[#F2BF00]" />
                      <span>{lang === 'vi' ? gig.type : gig.typeEn}</span>
                    </div>
                  </div>

                </div>
              </FadeIn>
            ))
          ) : (
            <p className="text-sm text-[#D7E2EA]/40 text-center py-10 font-medium">
              {lang === 'vi' ? 'Không có sự kiện nào gần đây.' : 'No recent gigs found.'}
            </p>
          )}
        </div>

      </div>
    </section>
  );
};
