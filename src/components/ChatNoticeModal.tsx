import React from 'react';
import { AlertCircle, ExternalLink, X, HeartHandshake } from 'lucide-react';
import { CharacterCard } from '../types';

interface ChatNoticeModalProps {
  card: CharacterCard | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmOpen: (url: string) => void;
}

export const ChatNoticeModal: React.FC<ChatNoticeModalProps> = ({
  card,
  isOpen,
  onClose,
  onConfirmOpen,
}) => {
  if (!isOpen || !card) return null;

  const noticeText =
    card.chatNotice ||
    '!!NẾU AI KHÔNG TỰ CHUYỂN SANG GIAI ĐOẠN HIỆN TẠI(Dương tử mặc lớn) SAU TỐI ĐA 8 tin nhắn THÌ CÁC BẠN NHỚ NHẮC AI NHA!! Vì mình set tin nhắn đầu là nuôi ẻm á';

  const handleProceed = () => {
    onConfirmOpen(card.chatUrl);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FCFBF7] text-stone-800 rounded-3xl shadow-2xl border border-amber-300/40 overflow-hidden animate-scale-in"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-2 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500" />

        {/* Header */}
        <div className="p-5 sm:p-6 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/90 border border-amber-300 flex items-center justify-center text-amber-700 shadow-inner shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-300/60 inline-flex items-center gap-1">
                <span>⚠️</span> Lưu ý trước khi trò chuyện
              </span>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5">
                {card.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-all cursor-pointer"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="px-5 sm:px-6 py-3 space-y-4">
          {/* Highlight Notice Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-rose-50/40 to-amber-50 border-2 border-amber-300/80 shadow-inner text-stone-800">
            <div className="flex items-start gap-2.5">
              <span className="text-xl shrink-0 mt-0.5">📢</span>
              <div className="space-y-2">
                <p className="font-bold text-rose-800 text-xs sm:text-[13.5px] uppercase tracking-wide leading-snug">
                  Tin nhắn quan trọng từ tác giả:
                </p>
                <div className="p-3 bg-white/90 rounded-xl border border-amber-200 shadow-2xs">
                  <p className="text-xs sm:text-[14px] font-semibold text-stone-900 leading-relaxed whitespace-pre-wrap">
                    {noticeText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-100/70 p-3 rounded-xl border border-stone-200">
            <HeartHandshake className="w-4 h-4 text-rose-500 shrink-0" />
            <p className="text-[11.5px] sm:text-xs leading-normal">
              Nhắc nhẹ AI nếu sau 8 tin nhắn char chưa lớn để có trải nghiệm cốt truyện trọn vẹn nhất nhé!
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 pt-3 bg-stone-100/60 border-t border-stone-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            Quay lại
          </button>
          <button
            onClick={handleProceed}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2c2929] to-[#453f41] hover:from-[#1e1c1c] hover:to-[#332f30] text-[#f5efef] border border-amber-400/30 text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
          >
            <span>Đã hiểu & Mở Chat ngay</span>
            <ExternalLink className="w-4 h-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
