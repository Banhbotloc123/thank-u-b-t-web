import React, { useState } from 'react';
import { X, Check, CheckCheck, Bell, ChevronDown, ChevronUp, Sparkles, Clock } from 'lucide-react';

export interface PastAnnouncement {
  id: string;
  title: string;
  date: string;
  summary: string;
  details?: string;
}

const PAST_ANNOUNCEMENTS: PastAnnouncement[] = [];

interface WingedLetterButtonProps {
  hasUnread: boolean;
  onClick: () => void;
}

export const WingedLetterButton: React.FC<WingedLetterButtonProps> = ({ hasUnread, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center p-1 cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 group focus:outline-none select-none ${
        hasUnread ? 'animate-letter-vibrate' : ''
      }`}
      title={hasUnread ? 'Có thông báo mới chưa đọc! Bấm để mở thư' : 'Mở hòm thư thông báo'}
    >
      {/* Cánh thiên thần bên trái màu trắng #cfcbcb */}
      <svg
        className="w-5 h-6 text-[#cfcbcb] drop-shadow-xs -mr-1.5 transition-transform group-hover:-translate-x-0.5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M21 3C18 3 13 4.5 10 7.5C7.5 10 6 13 6 16.5C6 18.5 7 20 8.5 21C7 19.5 6.5 17 7 14.5C7.5 12 9.5 9.5 12 8C10.5 10 10 12.5 10.5 15C11 17 12 18.5 13.5 19.5C12.5 18 12.5 16 13 14C13.5 12 15 10 17 9C16 11 16 13 17 14.5C18 16 19.5 17 21 17.5C20.5 15.5 20.5 13 21 11C21.5 8.5 22 5.5 21 3Z" />
      </svg>

      {/* Bức thư đen nhạt #3d393f */}
      <div className="relative w-9 h-7 rounded-md bg-[#3d393f] border border-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-center transition-transform group-hover:scale-105">
        {/* Nếp gấp thư */}
        <svg
          className="w-5 h-4 text-[#f5efef]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>

        {/* Chấm nhỏ màu vàng nhạt #ecb96d khi có thông báo mới mà chưa đọc */}
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ecb96d] rounded-full ring-2 ring-[#3d393f] shadow-[0_0_8px_#ecb96d] animate-pulse" />
        )}
      </div>

      {/* Cánh thiên thần bên phải màu trắng #cfcbcb */}
      <svg
        className="w-5 h-6 text-[#cfcbcb] drop-shadow-xs -ml-1.5 scale-x-[-1] transition-transform group-hover:translate-x-0.5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M21 3C18 3 13 4.5 10 7.5C7.5 10 6 13 6 16.5C6 18.5 7 20 8.5 21C7 19.5 6.5 17 7 14.5C7.5 12 9.5 9.5 12 8C10.5 10 10 12.5 10.5 15C11 17 12 18.5 13.5 19.5C12.5 18 12.5 16 13 14C13.5 12 15 10 17 9C16 11 16 13 17 14.5C18 16 19.5 17 21 17.5C20.5 15.5 20.5 13 21 11C21.5 8.5 22 5.5 21 3Z" />
      </svg>
    </button>
  );
};

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasUnread?: boolean;
  onMarkAsRead?: () => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  hasUnread = false,
  onMarkAsRead,
}) => {
  const [expandedPastId, setExpandedPastId] = useState<string | null>(null);

  if (!isOpen) return null;

  const togglePastItem = (id: string) => {
    setExpandedPastId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* Backdrop mỏng nhẹ để click ngoài đóng khung */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs animate-fadeIn"
        onClick={onClose}
      />

      {/* Khung bé mở lên từ hình bức thư ở góc phải dưới, không chiếm trọn màn hình */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] max-w-[350px] sm:max-w-[370px] max-h-[82vh] overflow-y-auto no-scrollbar bg-[#d6d6d6] text-[#2c2929] rounded-3xl p-4 shadow-[0_15px_45px_rgba(0,0,0,0.5)] border border-white/80 animate-scaleUp flex flex-col gap-3 select-none">
        
        {/* Top Header: Tiêu đề + Nút đóng */}
        <div className="flex items-center justify-between pb-1.5 border-b border-black/10">
          <div className="flex items-center gap-2">
            {/* Mini Winged Letter Icon */}
            <div className="w-6 h-5 rounded bg-[#3d393f] flex items-center justify-center text-[#f5efef] shadow-xs">
              <span className="text-[10px]">💌</span>
            </div>
            <span className="font-serif font-bold text-sm text-[#2c2929] tracking-wide">
              Hòm Thư Thông Báo
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/60 hover:bg-white text-gray-700 hover:text-gray-900 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Đóng"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Nút Đánh dấu là đã đọc */}
        <div className="w-full">
          {hasUnread ? (
            <button
              onClick={onMarkAsRead}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold bg-[#3d393f] text-[#f5efef] hover:bg-[#2c2929] transition-all shadow-xs active:scale-95 cursor-pointer border border-white/20 group"
            >
              <Check className="w-3.5 h-3.5 text-[#ecb96d] group-hover:scale-110 transition-transform" />
              <span>Đánh dấu là đã đọc</span>
              <span className="w-2 h-2 rounded-full bg-[#ecb96d] shadow-[0_0_6px_#ecb96d] animate-pulse ml-1" />
            </button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 py-1 px-3 text-[11px] font-semibold text-neutral-600 bg-white/50 rounded-full border border-white/40">
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đã đánh dấu là đã đọc</span>
            </div>
          )}
        </div>

        {/* Khung Thông Báo Hiện Tại: Dòng chữ "To my love" + Banner ngang */}
        <div className="w-full bg-white/45 rounded-2xl p-2.5 border border-white/70 shadow-2xs flex flex-col items-center">
          {/* Dòng chữ "To my love" font hoàng gia uốn lượn trắng phai xuống xám */}
          <div className="pt-1 pb-1 text-center w-full">
            <h2
              className="text-3xl sm:text-4xl font-normal leading-tight tracking-wide bg-gradient-to-b from-[#f5efef] to-[#7c7980] bg-clip-text text-transparent filter drop-shadow-[0_1px_2px_rgba(50,50,50,0.5)]"
              style={{ fontFamily: "'Pinyon Script', 'Great Vibes', 'Alex Brush', cursive" }}
            >
              To my love
            </h2>
          </div>

          {/* Ảnh biểu ngữ ngang */}
          <div className="w-full mt-1 overflow-hidden rounded-xl shadow-xs border border-white/60 bg-neutral-200">
            <img
              src="https://i.pinimg.com/736x/8f/e9/e4/8fe9e4a17414abe733aa5929ddb82a32.jpg"
              alt="To my love banner"
              referrerPolicy="no-referrer"
              className="w-full aspect-[2.35/1] object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Danh mục các thông báo trước */}
        <div className="w-full flex flex-col gap-1.5 pt-1">
          <div className="flex items-center gap-1.5 px-1 text-xs font-bold text-neutral-700">
            <Clock className="w-3.5 h-3.5 text-[#3d393f]" />
            <span>Danh mục các thông báo trước</span>
          </div>

          {PAST_ANNOUNCEMENTS.length > 0 ? (
            <div className="flex flex-col gap-1.5 max-h-[170px] overflow-y-auto pr-0.5 no-scrollbar">
              {PAST_ANNOUNCEMENTS.map((item) => {
                const isExpanded = expandedPastId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => togglePastItem(item.id)}
                    className="rounded-xl bg-white/60 hover:bg-white/80 border border-white/70 p-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-[#3d393f] truncate">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-medium">
                          {item.date}
                        </span>
                      </div>

                      <div className="p-0.5 text-neutral-500">
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-600 mt-1 leading-snug">
                      {item.summary}
                    </p>

                    {isExpanded && item.details && (
                      <div className="mt-1.5 pt-1.5 border-t border-black/5 text-[10.5px] text-neutral-700 italic leading-relaxed animate-fadeIn">
                        {item.details}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 px-3 rounded-xl bg-white/50 border border-white/60 text-neutral-500 text-xs italic shadow-2xs">
              Hiện chưa có thông báo nào.
            </div>
          )}
        </div>

      </div>
    </>
  );
};
