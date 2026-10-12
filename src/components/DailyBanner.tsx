import React, { useState, useEffect } from 'react';
import { Clock, Star } from 'lucide-react';

const DAY_5_22_BANNER = 'https://i.pinimg.com/736x/98/c0/93/98c0932e8a7087398971d71ac19b421b.jpg';
const NIGHT_23_04_BANNER = 'https://i.pinimg.com/736x/93/8a/28/938a28083040f4fa2387ecfcb9125e63.jpg';

export function getHanoiBannerImage(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: 'numeric',
      hour12: false
    });
    const hour = parseInt(formatter.format(new Date()), 10);

    // Khung giờ từ 23:00PM đến 4:00AM (giờ >= 23 hoặc giờ < 5):
    if (hour >= 23 || hour < 5) {
      return NIGHT_23_04_BANNER;
    }
    // Khung giờ từ 5:00AM đến 22:00PM (giờ từ 5 đến trước 23):
    return DAY_5_22_BANNER;
  } catch (e) {
    return DAY_5_22_BANNER;
  }
}

export function getHanoiDayIndex(): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      weekday: 'short'
    });
    const dayStr = formatter.format(new Date());
    const dayMap: Record<string, number> = {
      'Mon': 1,
      'Tue': 2,
      'Wed': 3,
      'Thu': 4,
      'Fri': 5,
      'Sat': 6,
      'Sun': 0
    };
    return dayMap[dayStr] ?? new Date().getDay();
  } catch (e) {
    const now = new Date();
    const hanoiDate = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    return hanoiDate.getUTCDay();
  }
}

export function getHanoiTimeString(): string {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long'
    }).format(new Date());
  } catch (e) {
    return '';
  }
}

export const DailyBanner: React.FC = () => {
  const [hanoiTimeStr, setHanoiTimeStr] = useState<string>(getHanoiTimeString());
  const [currentBannerImage, setCurrentBannerImage] = useState<string>(getHanoiBannerImage());
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Update time and banner image every 30 seconds
  useEffect(() => {
    const updateBannerAndClock = () => {
      setHanoiTimeStr(getHanoiTimeString());
      setCurrentBannerImage(getHanoiBannerImage());
    };
    updateBannerAndClock();
    const interval = setInterval(updateBannerAndClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-1 sm:px-0 mb-4 sm:mb-6">
      <div className="relative group rounded-2xl sm:rounded-3xl overflow-hidden border border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300">
        
        {/* Soft Radial Color Bleed */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#FFCCD5]/30 via-[#FFF0F3]/20 to-transparent pointer-events-none z-0" />
        
        {/* Banner Aspect Container */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] max-h-[320px] sm:max-h-[380px] bg-[#FFF0F3]/20 overflow-hidden z-10">
          {/* Skeleton placeholder while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF0F3] via-[#FFE4E8] to-[#FFF0F3] animate-pulse flex items-center justify-center">
              <Star className="w-8 h-8 text-[#C71F37] animate-spin fill-[#C71F37]" />
            </div>
          )}

          <img
            src={currentBannerImage}
            alt="Bánh Bột Lọc Banner"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />

          {/* Subtle gradient overlay for readability of badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Top Badge: Hanoi Time */}
          <div className="absolute top-2 sm:top-3.5 left-2 sm:left-3.5 flex flex-wrap items-center gap-2 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold border border-white/20 shadow-md">
              <Clock className="w-3.5 h-3.5 text-[#E9D8A6]" />
              <span>Nhà Bột{hanoiTimeStr ? ` • ${hanoiTimeStr}` : ''}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

