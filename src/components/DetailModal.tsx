import React from 'react';
import { X, Heart, ExternalLink, Link2, MessageSquareText, Sparkles, FileText } from 'lucide-react';
import { CharacterCard } from '../types';

interface DetailModalProps {
  card: CharacterCard | null;
  isOpen: boolean;
  onClose: () => void;
  onCopyLink: (link: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenChatSimulator?: (card: CharacterCard) => void;
  onOpenPlot?: (card: CharacterCard) => void;
  onOpenChatLink?: (card: CharacterCard) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  card,
  isOpen,
  onClose,
  onCopyLink,
  onToggleFavorite,
  onOpenChatSimulator,
  onOpenPlot,
  onOpenChatLink,
}) => {
  const images = (card?.imagesList && card.imagesList.length > 0) ? card.imagesList : card ? [card.imageUrl] : [];
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!isOpen || !card) return null;

  const handleCopy = () => {
    const linkToCopy = card.copyLink || card.chatUrl || window.location.href;
    onCopyLink(linkToCopy);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFDF0] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-[#D4A373]/40 flex flex-col max-h-[90vh]">
        {/* Cover Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#FFF9D0]">
          <img
            key={currentImageIndex}
            src={images[currentImageIndex] || card.imageUrl}
            alt={card.name}
            className="w-full h-full object-cover transition-all duration-700 animate-in fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Carousel Indicators if multiple images */}
          {images.length > 1 && (
            <div className="absolute top-4 left-6 z-20 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentImageIndex ? 'bg-amber-300 w-4' : 'bg-white/60 hover:bg-white w-1.5'
                  }`}
                  title={`Ảnh ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-white/90 text-[#D4A373] border border-[#D4A373]/30 mb-2">
              {card.tag}
            </span>
            <h2 className="font-serif text-3xl font-semibold tracking-normal text-white">{card.name}</h2>
            {card.author && (
              <p className="text-xs text-[#E6C280] font-medium mt-0.5 tracking-wide">
                Tác giả: {card.author}
              </p>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-gray-700">
          <div>
            <h4 className="text-[10px] font-bold text-[#D4A373] uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Mục thẻ / Tags
            </h4>
            <div className="flex flex-wrap gap-1.5 bg-white p-3.5 rounded-xl border border-[#D4A373]/20 shadow-2xs">
              {(card.tagsList || (card.personality ? card.personality.split(',').map(s => s.trim()) : [card.tag])).map((t, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-bold bg-[#FFF9D0] text-[#B37840] border border-[#D4A373]/30 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {card.context && (
            <div>
              <h4 className="text-[10px] font-bold text-[#D4A373] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Bối cảnh
              </h4>
              <p className="text-xs sm:text-sm font-medium leading-relaxed bg-amber-50/80 p-4 rounded-xl border border-amber-200 shadow-2xs text-[#7A3E00]">
                📌 {card.context}
              </p>
            </div>
          )}

          {card.note && (
            <div>
              <h4 className="text-[10px] font-bold text-[#D4A373] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Ghi chú (Note)
              </h4>
              <p className="text-xs sm:text-sm font-serif italic leading-relaxed bg-white p-4 rounded-xl border border-[#D4A373]/20 shadow-2xs text-stone-800">
                "{card.note}"
              </p>
            </div>
          )}

          {card.collabNote && (
            <div>
              <h4 className="text-[10px] font-bold text-[#D4A373] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Lưu ý / Collab
              </h4>
              <div className="text-xs sm:text-sm font-medium leading-relaxed bg-rose-50/80 p-3.5 rounded-xl border border-rose-200 shadow-2xs text-[#800F2F] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span>✨</span>
                  <span>{card.collabNote}</span>
                </div>
                {card.collabUrl && (
                  <a
                    href={card.collabUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C71F37] hover:underline bg-white px-3 py-1.5 rounded-full border border-rose-200 shadow-2xs w-fit"
                  >
                    <span>Mở link bài viết</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {card.personality && (
            <div>
              <h4 className="text-[10px] font-bold text-[#D4A373] uppercase tracking-widest mb-1.5">
                Tính cách &amp; Đặc điểm
              </h4>
              <p className="text-xs sm:text-sm font-normal leading-relaxed bg-white p-4 rounded-xl border border-[#D4A373]/20 shadow-2xs">
                {card.personality}
              </p>
            </div>
          )}

          {card.greeting && (
            <div>
              <h4 className="text-[10px] font-bold text-[#D4A373] uppercase tracking-widest mb-1.5">
                Lời chào mẫu
              </h4>
              <p className="text-xs sm:text-sm italic font-serif leading-relaxed bg-[#F9F6E7] p-4 rounded-xl border border-[#D4A373]/30 text-gray-800">
                "{card.greeting}"
              </p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-[#FFFDF0] border-t border-[#D4A373]/20 flex items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            {(card.plotContent || card.plotUrl) && (
              card.plotContent ? (
                <button
                  onClick={() => onOpenPlot?.(card)}
                  className="px-3.5 py-2 rounded-full bg-white text-[#D4A373] border border-[#D4A373]/40 hover:bg-amber-50 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Đọc plot
                </button>
              ) : (
                <a
                  href={card.plotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-full bg-white text-[#D4A373] border border-[#D4A373]/40 hover:bg-amber-50 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Link plot
                </a>
              )
            )}

            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-full bg-white text-[#D4A373] border border-[#D4A373]/40 hover:bg-amber-50 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Link2 className="w-3.5 h-3.5" />
              Copy link
            </button>

            <button
              onClick={() => {
                if (onOpenChatLink) {
                  onOpenChatLink(card);
                } else {
                  window.open(card.chatUrl, '_blank');
                }
              }}
              className="px-3.5 py-2 rounded-full bg-[#D4A373] text-white hover:bg-[#b08256] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Web Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
