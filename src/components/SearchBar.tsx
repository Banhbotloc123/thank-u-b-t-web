import React from 'react';
import { Search, X, Home, Star, Dices, Sparkles, Heart } from 'lucide-react';
import { CategoryTag } from '../types';

const FacebookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTag: CategoryTag;
  setSelectedTag: (tag: CategoryTag) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (val: boolean) => void;
  onGoWelcome?: () => void;
  onOpenWheel?: () => void;
  onOpenUncleMessage?: () => void;
  totalCards: number;
  favoriteCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedTag,
  setSelectedTag,
  showFavoritesOnly,
  setShowFavoritesOnly,
  onGoWelcome,
  onOpenWheel,
  onOpenUncleMessage,
}) => {
  const tags: { label: CategoryTag; dotColor: string }[] = [
    { label: 'Tất cả', dotColor: 'bg-[#D4A373]' },
    { label: 'Only BG', dotColor: 'bg-[#E01E37]' },
    { label: 'Only BL', dotColor: 'bg-[#0284C7]' },
    { label: 'BG/BL', dotColor: 'bg-[#D97706]' },
  ];

  return (
    <div className="space-y-2 sm:space-y-2.5 mb-4 p-2.5 sm:p-3.5 rounded-2xl border border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.35)] relative overflow-hidden">
      {/* Background Image: c93e39d929b0fb6f7513e78ea2d6957c.jpg with 13% slight blur and subtle dark overlay to highlight the white neon text */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://i.pinimg.com/736x/c9/3e/39/c93e39d929b0fb6f7513e78ea2d6957c.jpg"
          alt="Khung card background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-700"
          style={{
            filter: 'blur(1.8px)', // Hiệu ứng mờ nhẹ 13%
          }}
        />
        {/* Soft dark overlay to make white neon text and controls pop sharply (reduced darkness by 10%) */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 space-y-2.5 sm:space-y-3">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 sm:pb-2.5 border-b border-white/20 gap-2 sm:gap-2.5">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {onGoWelcome && (
              <button
                onClick={onGoWelcome}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 border border-[#F7CAD0] text-[#800F2F] hover:bg-[#FFCCD5] hover:text-[#590D22] transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Quay lại trang đầu"
              >
                <Home className="w-3.5 h-3.5 text-[#C71F37]" />
                <span>Quay lại</span>
              </button>
            )}

            <div className="flex items-center gap-2.5">
              {/* Character Avatar Image Frame */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#FFCCD5] via-[#F4ACB7] to-[#FFC2D1] shadow-xs border border-[#F4ACB7] overflow-hidden transition-transform duration-300 hover:scale-105">
                  <img
                    src="https://i.pinimg.com/736x/36/28/fe/3628fe8b24e8361bd93e105f6a0db67f.jpg"
                    alt="Bột Character"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top rounded-full"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {/* Title: Thank You For Being My Past with royal cursive font, neon white glow, and NO stars */}
                  <span
                    className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#f5efef] tracking-wide leading-tight select-none drop-shadow-[0_0_12px_rgba(255,255,255,0.95)]"
                    style={{
                      fontFamily: "'Pinyon Script', 'Great Vibes', 'Alex Brush', cursive",
                      textShadow: '0 0 6px #ffffff, 0 0 14px #ffffff, 0 0 25px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.85), 0 2px 4px rgba(128,15,47,0.5)'
                    }}
                  >
                    Thank You For Being My Past
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <a
                      href="https://www.facebook.com/profile.php?id=61590688029529"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/85 text-[#f5efef] border border-white/30 hover:border-white/70 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                      style={{
                        textShadow: '0 0 4px #ffffff, 0 0 10px rgba(255,255,255,0.9), 0 0 18px rgba(255,255,255,0.7)'
                      }}
                      title="Ghé thăm Fanpage của Bột"
                    >
                      <FacebookIcon className="w-3 h-3 text-[#f5efef] drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                      <span>Fanpage</span>
                    </a>
                    <a
                      href="https://www.facebook.com/song.an.113815"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/85 text-[#f5efef] border border-white/30 hover:border-white/70 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                      style={{
                        textShadow: '0 0 4px #ffffff, 0 0 10px rgba(255,255,255,0.9), 0 0 18px rgba(255,255,255,0.7)'
                      }}
                      title="Facebook cá nhân"
                    >
                      <FacebookIcon className="w-3 h-3 text-[#f5efef] drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                      <span>Fb cá nhân</span>
                    </a>
                    <a
                      href="https://www.instagram.com/hate.chocolatee/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/85 text-[#f5efef] border border-white/30 hover:border-white/70 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                      style={{
                        textShadow: '0 0 4px #ffffff, 0 0 10px rgba(255,255,255,0.9), 0 0 18px rgba(255,255,255,0.7)'
                      }}
                      title="Instagram"
                    >
                      <InstagramIcon className="w-3 h-3 text-[#f5efef] drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                      <span>Insta</span>
                    </a>
                  </div>
                </div>

                <span className="text-[11px] sm:text-xs font-semibold text-rose-100/95 mt-0.5 drop-shadow-xs">
                  Các yêu chơi vui.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Search - Nền màu xám nhạt (#d4d2d2) */}
        <div className="relative group/search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm nhóc thối nào?"
            className="w-full py-2 sm:py-2.5 pl-10 pr-9 border border-neutral-400/80 rounded-full text-xs sm:text-sm outline-none bg-[#d4d2d2] text-[#2c2929] placeholder-[#595555] font-semibold focus:ring-2 focus:ring-neutral-400 focus:border-neutral-600 transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-[#4a4747] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4747] hover:text-[#1a1a1a] p-1 rounded-full hover:bg-neutral-300 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dedicated "Nên chơi anh chồng nào?" Prominent Section - Nền màu #2c2929 với các item màu #dfafaf */}
        {onOpenWheel && (
          <div className="relative overflow-hidden rounded-xl bg-[#2c2929] border border-[#dfafaf]/35 p-2.5 sm:p-3 shadow-md flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left transition-all hover:border-[#dfafaf]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#222020] text-[#dfafaf] flex items-center justify-center shrink-0 shadow-xs border border-[#dfafaf]/40">
                <Dices className="w-5 h-5 text-[#dfafaf] animate-bounce" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-extrabold text-[#dfafaf] flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>Nên chơi anh chồng nào?</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#dfafaf] fill-[#dfafaf]" />
                </h3>
                <p className="text-[11px] text-[#dfafaf]/85 font-medium">
                  Đang phân vân chọn nhân vật? Vòng quay định mệnh sẽ chọn giúp bạn ✨
                </p>
              </div>
            </div>

            <button
              onClick={onOpenWheel}
              className="shrink-0 px-4 py-1.5 sm:py-2 rounded-full text-xs font-extrabold bg-[#dfafaf] text-[#2c2929] border border-[#dfafaf] hover:bg-[#ecd0d0] hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer flex items-center gap-1.5 group"
            >
              <Dices className="w-3.5 h-3.5 text-[#2c2929] group-hover:rotate-180 transition-transform duration-500" />
              <span>Xoay vòng quay ngay</span>
            </button>
          </div>
        )}

        {/* Khung card nhỏ "Lời nhắn từ anh ấy" */}
        {onOpenUncleMessage && (
          <div
            onClick={onOpenUncleMessage}
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#FFF0F3] via-[#FFE4E8] to-[#FFCCD5] border border-[#F4ACB7] p-2 sm:px-3 shadow-2xs hover:shadow-xs hover:border-[#C71F37] transition-all cursor-pointer flex items-center justify-between gap-2.5 group"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#C71F37] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Heart className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
              </div>
              <span className="font-serif font-bold text-xs sm:text-sm text-[#590D22] group-hover:text-[#C71F37] transition-colors">
                Lời nhắn từ anh ấy
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#C71F37] bg-white/90 px-2.5 py-0.5 rounded-full border border-[#F4ACB7] group-hover:bg-[#C71F37] group-hover:text-white transition-all shadow-2xs">
              <span>💌 Xem</span>
            </div>
          </div>
        )}

        {/* Category Tag Filters */}
        <div className="relative group/tags pt-0.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x py-1 px-0.5 w-full justify-start sm:justify-center whitespace-nowrap active:cursor-grabbing select-none">
            {tags.map((item) => {
              const isSelected = selectedTag === item.label && !showFavoritesOnly;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setShowFavoritesOnly(false);
                    setSelectedTag(item.label);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer border shadow-2xs ${
                    isSelected
                      ? 'border-[#F4ACB7] bg-[#FFCCD5] text-[#800F2F] font-extrabold shadow-xs scale-102 ring-1 ring-[#F4ACB7]'
                      : 'border-[#F7CAD0] bg-white/90 text-[#800F2F] hover:bg-[#FFCCD5] hover:border-[#F4ACB7]'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-[#C71F37]' : item.dotColor}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

