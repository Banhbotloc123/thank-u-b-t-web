import React from 'react';
import { Link2, MessageCircle, Heart, Info, Tag, FileText, ExternalLink } from 'lucide-react';
import { CharacterCard } from '../types';

interface ItemCardProps {
  card: CharacterCard;
  onCopyLink: (link: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (card: CharacterCard) => void;
  onOpenChatSimulator?: (card: CharacterCard) => void;
  onOpenPlot?: (card: CharacterCard) => void;
  onOpenChatLink?: (card: CharacterCard) => void;
}

// 3 Màu Random Pastel: Hồng nhạt, Vàng nhạt, Xanh dương nhạt
const PASTEL_THEMES = [
  // 0: Hồng nhạt pastel
  {
    type: 'pink',
    cardBg: 'bg-[#FFF0F3]',
    borderColor: 'border-[#F7CAD0]',
    hoverBorderColor: 'group-hover:border-[#F4ACB7]',
    titleColor: 'text-[#800F2F]',
    authorColor: 'text-[#A4133C]',
    tagBg: 'bg-[#FFCCD5] text-[#800F2F] border-[#F4ACB7]',
    tagItemBg: 'bg-white/90 text-[#800F2F] border-[#F7CAD0]',
    descBg: 'bg-white/80 border-[#F7CAD0] text-[#590D22]',
    actionBtnBg: 'bg-[#FFCCD5] hover:bg-[#FFB3C1] text-[#800F2F] border-[#F4ACB7]',
    chatBtnBg: 'bg-[#E01E37] hover:bg-[#C71F37] text-white border-[#C71F37]',
    favActiveBg: 'bg-[#FFCCD5] border-[#F4ACB7] text-[#C71F37]',
    favInactiveBg: 'bg-white/90 border-[#F7CAD0] text-[#A4133C] hover:text-[#C71F37]',
    infoBtnBg: 'bg-white/90 border-[#F7CAD0] text-[#800F2F] hover:bg-[#FFCCD5]',
    tagIconColor: 'text-[#C71F37]',
    dividerBorder: 'border-[#F7CAD0]',
  },
  // 1: Vàng nhạt pastel
  {
    type: 'yellow',
    cardBg: 'bg-[#FFFBEB]',
    borderColor: 'border-[#FDE68A]',
    hoverBorderColor: 'group-hover:border-[#FCD34D]',
    titleColor: 'text-[#78350F]',
    authorColor: 'text-[#B45309]',
    tagBg: 'bg-[#FEF08A] text-[#78350F] border-[#FDE68A]',
    tagItemBg: 'bg-white/90 text-[#78350F] border-[#FDE68A]',
    descBg: 'bg-white/80 border-[#FDE68A] text-[#78350F]',
    actionBtnBg: 'bg-[#FEF08A] hover:bg-[#FDE047] text-[#78350F] border-[#FCD34D]',
    chatBtnBg: 'bg-[#D97706] hover:bg-[#B45309] text-white border-[#B45309]',
    favActiveBg: 'bg-[#FEF08A] border-[#FCD34D] text-[#D97706]',
    favInactiveBg: 'bg-white/90 border-[#FDE68A] text-[#B45309] hover:text-[#D97706]',
    infoBtnBg: 'bg-white/90 border-[#FDE68A] text-[#78350F] hover:bg-[#FEF08A]',
    tagIconColor: 'text-[#D97706]',
    dividerBorder: 'border-[#FDE68A]',
  },
  // 2: Xanh dương nhạt pastel
  {
    type: 'blue',
    cardBg: 'bg-[#F0F9FF]',
    borderColor: 'border-[#BAE6FD]',
    hoverBorderColor: 'group-hover:border-[#7DD3FC]',
    titleColor: 'text-[#0C4A6E]',
    authorColor: 'text-[#0284C7]',
    tagBg: 'bg-[#BAE6FD] text-[#0C4A6E] border-[#7DD3FC]',
    tagItemBg: 'bg-white/90 text-[#0C4A6E] border-[#BAE6FD]',
    descBg: 'bg-white/80 border-[#BAE6FD] text-[#0C4A6E]',
    actionBtnBg: 'bg-[#BAE6FD] hover:bg-[#7DD3FC] text-[#0C4A6E] border-[#38BDF8]',
    chatBtnBg: 'bg-[#0284C7] hover:bg-[#0369A1] text-white border-[#0369A1]',
    favActiveBg: 'bg-[#BAE6FD] border-[#7DD3FC] text-[#0284C7]',
    favInactiveBg: 'bg-white/90 border-[#BAE6FD] text-[#0284C7] hover:text-[#0369A1]',
    infoBtnBg: 'bg-white/90 border-[#BAE6FD] text-[#0C4A6E] hover:bg-[#BAE6FD]',
    tagIconColor: 'text-[#0284C7]',
    dividerBorder: 'border-[#BAE6FD]',
  },
];

const getPastelTheme = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash += id.charCodeAt(i);
  }
  return PASTEL_THEMES[Math.abs(hash) % PASTEL_THEMES.length];
};

export const ItemCard: React.FC<ItemCardProps> = ({
  card,
  onCopyLink,
  onToggleFavorite,
  onOpenDetail,
  onOpenChatSimulator,
  onOpenPlot,
  onOpenChatLink,
}) => {
  const theme = getPastelTheme(card.id);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const linkToCopy = card.copyLink || card.chatUrl || window.location.href;
    onCopyLink(linkToCopy);
  };

  const tagsList = card.tagsList && card.tagsList.length > 0
    ? card.tagsList
    : card.personality
    ? card.personality.split(',').map(s => s.trim()).filter(Boolean)
    : [card.tag];

  return (
    <div className="relative w-full h-full group flex">
      {/* Main Pastel Card Frame */}
      <div className={`relative w-full h-full ${theme.cardBg} rounded-2xl border ${theme.borderColor} ${theme.hoverBorderColor} p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 overflow-hidden`}>
        
        {/* Top & Middle Content Group */}
        <div className="relative z-10 flex flex-col gap-2.5 flex-1">
          {/* Header Row: Badge, Name, Author & Action Icons */}
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest border rounded-full shrink-0 ${theme.tagBg}`}>
                {card.tag}
              </span>

              <h3 className={`font-serif text-base sm:text-lg font-bold ${theme.titleColor} transition-colors leading-tight drop-shadow-2xs`}>
                {card.name}
              </h3>

              {card.author && (
                <span className={`text-[11px] sm:text-xs ${theme.authorColor} font-medium border-l border-current/30 pl-2`}>
                  Tác giả: <span className="font-semibold">{card.author}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onToggleFavorite(card.id)}
                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                  card.isFavorite ? theme.favActiveBg : theme.favInactiveBg
                }`}
                title={card.isFavorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
              >
                <Heart className={`w-3.5 h-3.5 ${card.isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onOpenDetail(card)}
                className={`p-1.5 rounded-full border transition-colors cursor-pointer ${theme.infoBtnBg}`}
                title="Xem chi tiết"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tags List Row */}
          {tagsList.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag className={`w-3 h-3 ${theme.tagIconColor} shrink-0`} />
              {tagsList.map((t, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-md shadow-2xs ${theme.tagItemBg}`}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Note / Description / Context Box */}
          {(card.note || card.description || card.context) && (
            <div className={`${theme.descBg} p-2.5 sm:p-3 rounded-xl`}>
              {(card.note || card.description) && (
                <p className="font-serif italic text-xs sm:text-[13px] leading-relaxed whitespace-pre-line line-clamp-3">
                  "{card.note || card.description}"
                </p>
              )}
              {card.context && (
                <p className="mt-1.5 pt-1.5 border-t border-black/5 text-[11px] font-sans font-medium text-amber-900 not-italic flex items-start gap-1">
                  <span className="shrink-0">📌</span>
                  <span className="line-clamp-2">
                    <strong className="text-[#800F2F] font-semibold">Bối cảnh: </strong>
                    {card.context}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Collab Note Banner if present */}
          {card.collabNote && (
            <div>
              {card.collabUrl ? (
                <a
                  href={card.collabUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[#800F2F] bg-rose-50/90 hover:bg-rose-100/90 border border-rose-200/80 rounded-lg transition-colors shadow-2xs"
                  title="Mở bài viết collab"
                >
                  <span className="flex items-center gap-1 truncate">
                    <span>✨</span>
                    <span className="truncate">{card.collabNote}</span>
                  </span>
                  <ExternalLink className="w-3 h-3 shrink-0 text-[#C71F37]" />
                </a>
              ) : (
                <div className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-[#800F2F] bg-rose-50/90 border border-rose-200/80 rounded-lg shadow-2xs">
                  <span>✨</span>
                  <span className="truncate">{card.collabNote}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Action Link Buttons */}
        <div className={`relative z-10 flex items-center gap-1.5 sm:gap-2 pt-2 border-t ${theme.dividerBorder} mt-auto`}>
          {(card.plotContent || card.plotUrl) && (
            card.plotContent ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPlot?.(card);
                }}
                className={`py-1.5 sm:py-2 px-2.5 rounded-xl border text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs shrink-0 ${theme.actionBtnBg}`}
                title="Mở nội dung plot"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Plot</span>
              </button>
            ) : (
              <a
                href={card.plotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`py-1.5 sm:py-2 px-2.5 rounded-xl border text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs shrink-0 ${theme.actionBtnBg}`}
                title="Mở liên kết plot"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Plot</span>
              </a>
            )
          )}

          <button
            onClick={handleCopy}
            className={`${(card.plotContent || card.plotUrl) ? 'px-2.5' : 'flex-1 px-3'} py-1.5 sm:py-2 rounded-xl border text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs ${theme.actionBtnBg}`}
            title="Sao chép link prompt"
          >
            <Link2 className="w-3.5 h-3.5 shrink-0" />
            <span>{(card.plotContent || card.plotUrl) ? 'Copy' : 'Copy link'}</span>
          </button>

          <button
            onClick={() => {
              if (onOpenChatLink) {
                onOpenChatLink(card);
              } else {
                window.open(card.chatUrl, '_blank');
              }
            }}
            className={`flex-1 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md border ${theme.chatBtnBg}`}
            title="Mở liên kết web chat gốc"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Mở Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

