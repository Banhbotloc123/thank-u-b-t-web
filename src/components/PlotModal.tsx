import React from 'react';
import { X, BookOpen, MessageCircle, ExternalLink } from 'lucide-react';
import { CharacterCard } from '../types';

interface PlotModalProps {
  card: CharacterCard | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChatLink?: (card: CharacterCard) => void;
}

export const PlotModal: React.FC<PlotModalProps> = ({ card, isOpen, onClose, onOpenChatLink }) => {
  if (!isOpen || !card || !card.plotContent) return null;

  // Split content into clean paragraphs
  const paragraphs = card.plotContent
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-[95vw] sm:w-[85vw] md:w-[80vw] max-w-4xl h-[80vh] max-h-[85vh] bg-[#FCFAF5] text-stone-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col border border-amber-900/15 overflow-hidden animate-scale-in"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - chiếm một thanh ngang trang nhã */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 bg-gradient-to-r from-[#2c2929] to-[#3a3538] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#dfafaf]/20 border border-[#dfafaf]/30 flex items-center justify-center shrink-0 text-[#f5efef]">
              <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#dfafaf]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#dfafaf] bg-white/10 px-2 py-0.5 rounded-full">
                  Plot Truyện
                </span>
                <span className="text-[11px] text-white/60 hidden sm:inline">
                  {card.tag}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#f5efef] truncate">
                {card.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nội dung Plot với font chữ chuẩn tiếng Việt không bị lỗi font */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 md:px-10 py-6 space-y-4 custom-scrollbar text-stone-700 leading-relaxed sm:leading-loose text-sm sm:text-[15px]">
          {/* Banner tựa đề truyện / note */}
          {card.note && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 shadow-2xs text-[#7A3E00] flex items-start gap-2.5">
              <span className="text-base sm:text-lg">✨</span>
              <p className="font-medium italic text-xs sm:text-sm">
                "{card.note}"
              </p>
            </div>
          )}

          {/* Các đoạn văn trong Plot */}
          <div className="space-y-3.5 sm:space-y-4 text-justify">
            {paragraphs.map((para, idx) => {
              if (para === '***') {
                return (
                  <div key={idx} className="flex items-center justify-center my-4 text-stone-400 gap-2">
                    <span className="w-8 h-px bg-stone-300" />
                    <span className="text-xs font-serif tracking-widest text-amber-800/60">✦ ✦ ✦</span>
                    <span className="w-8 h-px bg-stone-300" />
                  </div>
                );
              }

              if (para === '.' || para === '.\n.' || para === '..' || para === '...') {
                return (
                  <div key={idx} className="flex items-center justify-center py-2 text-stone-400 gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                  </div>
                );
              }

              if (para.startsWith('—-') || para.startsWith('--')) {
                return (
                  <div key={idx} className="p-3 bg-stone-100/80 rounded-xl border border-stone-200 text-stone-500 italic text-xs sm:text-[13px] my-3">
                    {para}
                  </div>
                );
              }

              // Check for livestream comment stream format (e.g. Kittymeomeo: ...)
              const commentMatch = para.match(/^([A-Za-z0-9_]{3,25}):\s*([\s\S]+)$/);
              if (commentMatch) {
                return (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl flex items-start gap-2 text-xs sm:text-[13.5px] text-stone-800 shadow-2xs my-1.5"
                  >
                    <span className="px-2 py-0.5 rounded-md bg-[#2c2929] text-[#dfafaf] font-mono text-[10.5px] sm:text-[11px] font-bold shrink-0">
                      {commentMatch[1]}
                    </span>
                    <span className="leading-snug">{commentMatch[2]}</span>
                  </div>
                );
              }

              // Highlight dialog lines
              const isDialogue = para.startsWith('"') || para.startsWith('“') || para.startsWith('”');
              const isShortOrPunchline = para === '???' || para === 'Về nhà.' || para === 'Cất cặp.' || para === 'Tôi im lặng' || para === 'À... Gì cơ??' || para === 'Ting Ting.' || para === '"Cạch."';

              if (isShortOrPunchline) {
                return (
                  <p
                    key={idx}
                    className="font-semibold text-stone-800 text-center sm:text-left py-1 text-sm sm:text-base tracking-wide"
                  >
                    {para}
                  </p>
                );
              }

              if (isDialogue) {
                return (
                  <div
                    key={idx}
                    className="pl-3.5 py-1 border-l-2 border-[#dfafaf] bg-rose-50/30 rounded-r-lg my-2"
                  >
                    <p className="font-semibold text-rose-950 italic">
                      {para}
                    </p>
                  </div>
                );
              }

              return (
                <p key={idx} className="text-stone-700 font-normal">
                  {para}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3 bg-[#F4F1EA] border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] sm:text-xs text-stone-500 truncate hidden sm:block">
            Nhấn <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] shadow-2xs">Esc</kbd> hoặc bấm ra ngoài để đóng
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-200/60 text-xs font-semibold transition-all cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                if (onOpenChatLink) {
                  onOpenChatLink(card);
                } else {
                  window.open(card.chatUrl, '_blank');
                }
              }}
              className="px-4 py-1.5 rounded-xl bg-[#2c2929] hover:bg-[#1f1d1d] text-[#f5efef] border border-[#dfafaf]/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#dfafaf]" />
              <span>Mở Chat ({card.name})</span>
              <ExternalLink className="w-3 h-3 text-white/50" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
