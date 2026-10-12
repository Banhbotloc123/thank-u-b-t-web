import React, { useEffect, useRef, useState } from 'react';
import { X, Heart, Star, Music, Volume2, VolumeX, Play, Pause, ExternalLink } from 'lucide-react';

interface UncleMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HOAC_CAN_NGHIEM_GIF = 'https://i.pinimg.com/originals/85/74/a9/8574a92b6a7baa69f18a894e7b5aff98.gif';
const UNCLE_YOUTUBE_ID = 'ucRVDoFkcxc';
const UNCLE_SONG_URL = 'https://youtu.be/ucRVDoFkcxc?si=BNbAQ9cgAVeQK7P7';

export const UncleMessageModal: React.FC<UncleMessageModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const unclePlayerRef = useRef<any>(null);
  const containerId = 'uncle-youtube-audio-player';

  // Handle stopping homepage music when opened, and resuming homepage music when closed
  useEffect(() => {
    if (isOpen) {
      // Pause homepage music
      window.dispatchEvent(new CustomEvent('pause-main-music'));
      setIsPlaying(true);
    } else {
      // Clean up uncle player if open state flips
      if (unclePlayerRef.current) {
        try {
          if (typeof unclePlayerRef.current.pauseVideo === 'function') {
            unclePlayerRef.current.pauseVideo();
          }
        } catch (e) {
          console.error(e);
        }
      }
      // Resume homepage music
      window.dispatchEvent(new CustomEvent('resume-main-music'));
    }
  }, [isOpen]);

  // Initialize YouTube player for Chú nhỏ's song (volume 80%)
  useEffect(() => {
    if (!isOpen) return;

    let destroyed = false;

    const setupUnclePlayer = () => {
      if (destroyed || !window.YT || !window.YT.Player) return;

      try {
        unclePlayerRef.current = new window.YT.Player(containerId, {
          height: '0',
          width: '0',
          videoId: UNCLE_YOUTUBE_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            loop: 1,
            playlist: UNCLE_YOUTUBE_ID,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event: any) => {
              try {
                if (typeof event.target.unMute === 'function') {
                  event.target.unMute();
                }
                // Volume 80% per user request
                event.target.setVolume(80);
                event.target.playVideo();
                setIsPlaying(true);
              } catch (err) {
                console.error('Uncle audio play error:', err);
              }
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                // Loop
                try {
                  event.target.playVideo();
                } catch {
                  // ignore
                }
              }
            },
          },
        });
      } catch (e) {
        console.error('Error creating uncle player:', e);
      }
    };

    if (window.YT && window.YT.Player) {
      setupUnclePlayer();
    } else {
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(interval);
          setupUnclePlayer();
        }
      }, 200);
      return () => clearInterval(interval);
    }

    return () => {
      destroyed = true;
      if (unclePlayerRef.current) {
        try {
          if (typeof unclePlayerRef.current.destroy === 'function') {
            unclePlayerRef.current.destroy();
          }
        } catch {
          // ignore
        }
        unclePlayerRef.current = null;
      }
    };
  }, [isOpen]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const player = unclePlayerRef.current;
    if (!player) return;
    try {
      if (isPlaying) {
        if (typeof player.pauseVideo === 'function') {
          player.pauseVideo();
          setIsPlaying(false);
        }
      } else {
        if (typeof player.unMute === 'function') player.unMute();
        if (typeof player.setVolume === 'function') player.setVolume(80);
        if (typeof player.playVideo === 'function') {
          player.playVideo();
          setIsPlaying(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const player = unclePlayerRef.current;
    if (!player) return;
    try {
      if (isMuted) {
        if (typeof player.unMute === 'function') player.unMute();
        if (typeof player.setVolume === 'function') player.setVolume(80);
        setIsMuted(false);
      } else {
        if (typeof player.mute === 'function') player.mute();
        setIsMuted(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      {/* Hidden YouTube Audio Iframe */}
      <div className="hidden" aria-hidden="true">
        <div id={containerId} />
      </div>

      {/* Modal Container */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#FFF5F7] via-[#FFF0F3] to-[#FFFFFF] rounded-3xl border-2 border-[#FFC2D1] shadow-[0_10px_40px_rgba(255,182,193,0.5)] overflow-hidden flex flex-col my-auto">
        
        {/* Header Bar */}
        <div className="relative px-5 py-3.5 bg-gradient-to-r from-[#800F2F] via-[#A4133C] to-[#C71F37] text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-amber-300">
              <Heart className="w-4 h-4 fill-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Hoắc Cẩn Nghiêm</span>
                <span className="text-[10px] bg-amber-400 text-rose-950 px-2 py-0.5 rounded-full font-extrabold uppercase">
                  Chú nhỏ
                </span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          
          <div className="relative flex flex-col items-center w-full">
            <Star className="absolute -top-3 -left-2 w-5 h-5 text-amber-400 fill-amber-300 animate-pulse" />
            <Star className="absolute -top-3 -right-2 w-5 h-5 text-rose-400 fill-rose-300 animate-bounce" />

            {/* Hoắc Cẩn Nghiêm GIF (Landscape, No Border) */}
            <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-3.5 shadow-sm">
              <img
                src={HOAC_CAN_NGHIEM_GIF}
                alt="Hoắc Cẩn Nghiêm"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <h4 className="font-serif text-xl font-bold text-[#800F2F] mb-2.5">
              Hoắc Cẩn Nghiêm
            </h4>

            {/* Lời nhắn */}
            <div className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-[#FFF0F3] to-[#FFE4E8] border border-[#F4ACB7] text-[#590D22] shadow-sm relative mb-3">
              <p className="font-serif italic text-lg sm:text-xl font-bold text-[#A4133C]">
                "Bé con , đừng thức khuya"
              </p>
              <Heart className="w-4 h-4 text-[#C71F37] fill-[#C71F37] absolute -top-2 -right-1 animate-bounce" />
            </div>

            {/* Biểu ngữ nhỏ dưới lời nhắn: Biểu ngữ ngang với ảnh nền mới */}
            <div
              className="w-full relative overflow-hidden rounded-xl border border-white/50 px-3.5 py-2.5 shadow-md flex items-center justify-between gap-2.5 transition-all bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://i.pinimg.com/736x/e2/88/a2/e288a21baaa4401f7193cdc619e63c35.jpg")',
              }}
            >
              {/* Lớp phủ nhẹ giúp nổi bật ảnh nền và giữ độ tương phản cho chữ */}
              <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px] pointer-events-none" />

              <div className="relative z-10 flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isPlaying ? 'bg-[#C71F37] text-white shadow-xs' : 'bg-white/85 text-[#C71F37]'}`}>
                  <Music className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce' : ''}`} />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="font-serif font-bold text-xs sm:text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] tracking-wide truncate">
                    Nhạc của anh.
                  </span>
                  <span className="text-[10px] text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-medium truncate">
                    Âm lượng 80% • Đang phát riêng
                  </span>
                </div>
              </div>

              {/* Music Controls for Chú nhỏ's song */}
              <div className="relative z-10 flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-7 h-7 rounded-full bg-[#C71F37] text-white hover:bg-[#800F2F] active:scale-95 transition-all flex items-center justify-center shadow-xs cursor-pointer"
                  title={isPlaying ? 'Tạm dừng nhạc của anh' : 'Phát nhạc của anh'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-7 h-7 rounded-full bg-white/85 hover:bg-white text-[#800F2F] active:scale-95 transition-all flex items-center justify-center shadow-xs cursor-pointer border border-white/60"
                  title={isMuted ? 'Bật âm lượng (80%)' : 'Tắt tiếng'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <a
                  href={UNCLE_SONG_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-white/85 hover:bg-white text-[#800F2F] active:scale-95 transition-all flex items-center justify-center shadow-xs cursor-pointer border border-white/60"
                  title="Mở trên YouTube"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-1 px-6 py-2 rounded-full bg-gradient-to-r from-[#C71F37] to-[#800F2F] text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#FFF0F3] border-t border-[#F7CAD0] text-center text-[11px] text-[#A4133C] font-semibold">
          <span>💖 Lời nhắn ngọt ngào dành riêng cho em</span>
        </div>
      </div>
    </div>
  );
};

