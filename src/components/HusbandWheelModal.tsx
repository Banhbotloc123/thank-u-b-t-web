import React, { useState, useEffect, useRef } from 'react';
import { X, Dices, Sparkles, Heart, MessageSquare, ExternalLink, RefreshCw, Trophy, Star } from 'lucide-react';
import { CharacterCard } from '../types';
import { matchesCategoryTag } from '../utils/filterCards';

interface HusbandWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: CharacterCard[];
  onOpenDetail: (card: CharacterCard) => void;
  onOpenChat: (card: CharacterCard) => void;
}

const PASTEL_COLORS = [
  '#FFCCD5', // Pink
  '#FFB7B2', // Coral
  '#FFDAC1', // Peach
  '#E2F0CB', // Mint
  '#B5EAD7', // Pastel Green
  '#C7CEEA', // Pastel Blue
  '#E8AEB7', // Rose
  '#F3C4FB', // Pastel Purple
  '#F7D6C8', // Soft Orange
  '#D8E2DC', // Soft Teal
];

const RANDOM_WINNER_IMAGES = [
  'https://i.pinimg.com/1200x/01/e3/42/01e342f63a1a30f8c42533ee07bde797.jpg',
  'https://i.pinimg.com/736x/ef/b7/1a/efb71ace005560daa3eb5d505f48dedd.jpg',
  'https://i.pinimg.com/736x/03/a4/c2/03a4c222da642cec0251a86f03ee2159.jpg',
  'https://i.pinimg.com/736x/03/6a/53/036a53111b2a77a84413d4272f73a77f.jpg',
];

export const HusbandWheelModal: React.FC<HusbandWheelModalProps> = ({
  isOpen,
  onClose,
  cards,
  onOpenDetail,
  onOpenChat,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('Tất cả');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [winner, setWinner] = useState<CharacterCard | null>(null);
  const [winnerImage, setWinnerImage] = useState<string>('');
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; color: string; delay: number }>>([]);

  // Filter available characters based on tag
  const pool = cards.filter((c) => matchesCategoryTag(c, selectedTag));

  const activePool = pool.length > 0 ? pool : cards;

  useEffect(() => {
    if (!isOpen) {
      setWinner(null);
      setIsSpinning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning || activePool.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    // Pick random index
    const randomIndex = Math.floor(Math.random() * activePool.length);
    const chosenCard = activePool[randomIndex];

    // Calculate rotation angle
    const totalSegments = activePool.length;
    const segmentAngle = 360 / totalSegments;
    
    // Position of segment index (top is 0 degrees or -90 offset)
    // To land pointer (pointing down at top = 0 deg) inside segment `randomIndex`
    const targetSegmentCenter = randomIndex * segmentAngle + segmentAngle / 2;
    
    // Add extra 5-8 full spins (1800-2880 deg) + offset to align target at top pointer (360 - targetSegmentCenter)
    const extraSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const finalRotation = currentRotation + extraSpins + (360 - (targetSegmentCenter % 360));

    setCurrentRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(chosenCard);
      const randomImg = RANDOM_WINNER_IMAGES[Math.floor(Math.random() * RANDOM_WINNER_IMAGES.length)];
      setWinnerImage(randomImg);

      // Trigger Confetti effect
      const newConfetti = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 90 + 5,
        color: PASTEL_COLORS[i % PASTEL_COLORS.length],
        delay: Math.random() * 0.5,
      }));
      setConfetti(newConfetti);
    }, 4500);
  };

  const sliceAngle = 360 / (activePool.length || 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      {/* Confetti Animation */}
      {winner && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((item) => (
            <div
              key={item.id}
              className="absolute top-0 w-3 h-3 rounded-full animate-bounce"
              style={{
                left: `${item.left}%`,
                backgroundColor: item.color,
                animationDuration: `${1.5 + Math.random()}s`,
                animationDelay: `${item.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#FFF0F3] via-[#FFE4E8] to-[#FFFFFF] rounded-3xl border-2 border-[#FFC2D1] shadow-[0_10px_40px_rgba(255,182,193,0.5)] p-5 sm:p-6 overflow-hidden my-auto">
        {/* Soft Radial Bleed */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFCCD5]/40 via-transparent to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSpinning}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-[#800F2F] hover:bg-[#FFCCD5] border border-[#F7CAD0] transition-transform active:scale-90 cursor-pointer shadow-xs disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="relative z-10 text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCCD5] text-[#800F2F] text-xs font-bold uppercase tracking-wider mb-2 border border-[#F4ACB7] shadow-xs">
            <Dices className="w-4 h-4 text-[#C71F37] animate-spin" style={{ animationDuration: '6s' }} />
            <span>Vòng quay định mệnh</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#590D22] tracking-tight">
            Nên chơi anh chồng nào?
          </h2>
          <p className="text-xs text-[#A4133C] font-semibold mt-1">
            Xoay vòng quay để chọn ngẫu nhiên anh chồng đồng hành cùng bạn hôm nay ✨
          </p>
        </div>

        {/* Tag Filters */}
        <div className="relative z-10 flex justify-center gap-1.5 sm:gap-2 mb-4 flex-wrap">
          {['Tất cả', 'Only BG', 'Only BL', 'BG/BL'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (!isSpinning) {
                  setSelectedTag(tag);
                  setWinner(null);
                }
              }}
              disabled={isSpinning}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                selectedTag === tag
                  ? 'bg-[#C71F37] text-white border-[#F4ACB7] shadow-xs scale-105'
                  : 'bg-white/90 text-[#800F2F] border-[#F7CAD0] hover:bg-[#FFCCD5]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Wheel Canvas & Pointer Section */}
        <div className="relative z-10 flex flex-col items-center justify-center my-3">
          {/* Top Pointer */}
          <div className="z-20 -mb-4 text-[#C71F37] filter drop-shadow-md">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-[#C71F37]" />
          </div>

          {/* Wheel Container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-[#FFC2D1] shadow-[0_0_25px_rgba(255,182,193,0.6)] p-1 bg-white overflow-hidden">
            <div
              className="w-full h-full rounded-full relative overflow-hidden transition-transform ease-out"
              style={{
                transform: `rotate(${currentRotation}deg)`,
                transitionDuration: isSpinning ? '4.5s' : '0s',
                transitionTimingFunction: 'cubic-bezier(0.15, 0.9, 0.2, 1)',
              }}
            >
              {/* SVG Wheel Segments */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {activePool.map((card, idx) => {
                  const startAngle = idx * sliceAngle;
                  const endAngle = (idx + 1) * sliceAngle;
                  
                  // Convert polar to cartesian
                  const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                  const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                  const color = PASTEL_COLORS[idx % PASTEL_COLORS.length];

                  // Text rotation angle
                  const midAngle = startAngle + sliceAngle / 2;

                  return (
                    <g key={card.id}>
                      <path d={pathData} fill={color} stroke="#FFFFFF" strokeWidth="0.8" />
                      {/* Name Label */}
                      <g transform={`rotate(${midAngle}, 50, 50)`}>
                        <text
                          x="50"
                          y="18"
                          fill="#590D22"
                          fontSize={activePool.length > 10 ? '3' : '3.6'}
                          fontWeight="bold"
                          textAnchor="middle"
                          transform="rotate(90, 50, 18)"
                          className="select-none font-sans"
                        >
                          {card.name.length > 10 ? card.name.substring(0, 9) + '…' : card.name}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Wheel Center Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || activePool.length === 0}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#C71F37] via-[#A4133C] to-[#590D22] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider border-4 border-white shadow-lg flex flex-col items-center justify-center gap-0.5 hover:scale-105 active:scale-95 transition-transform cursor-pointer z-20 disabled:opacity-75"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${isSpinning ? 'animate-spin' : 'animate-pulse'}`} />
              <span>{isSpinning ? '...' : 'QUAY'}</span>
            </button>
          </div>
        </div>

        {/* Winner Result Card */}
        {winner && (
          <div className="relative z-10 mt-4 p-4 rounded-2xl bg-white/95 border-2 border-[#F4ACB7] shadow-md animate-fadeIn text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFCCD5] text-[#800F2F] text-[11px] font-bold mb-2">
              <Trophy className="w-3.5 h-3.5 text-[#C71F37]" />
              <span>Anh chồng định mệnh của bạn!</span>
            </div>

            <div className="flex items-center justify-center gap-3 my-2 text-left">
              <img
                src={winnerImage || winner.imageUrl}
                alt={winner.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#F4ACB7] shadow-xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg font-bold text-[#590D22] truncate">
                  {winner.name}
                </h3>
                <span className="inline-block px-2 py-0.5 rounded-md bg-[#FFF0F3] text-[#A4133C] text-[10px] font-bold border border-[#F7CAD0] mt-0.5">
                  {winner.tag}
                </span>
                {winner.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1 italic">
                    "{winner.description}"
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              <button
                onClick={() => {
                  onClose();
                  onOpenChat(winner);
                }}
                className="flex-1 py-2 px-3 rounded-full bg-[#C71F37] hover:bg-[#A4133C] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Trò chuyện ngay</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenDetail(winner);
                }}
                className="py-2 px-3 rounded-full bg-white hover:bg-[#FFF0F3] text-[#800F2F] border border-[#F7CAD0] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C71F37]" />
                <span>Xem chi tiết</span>
              </button>

              <button
                onClick={handleSpin}
                className="py-2 px-3 rounded-full bg-[#FFCCD5] hover:bg-[#F4ACB7] text-[#800F2F] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                title="Quay lại chọn anh chồng khác"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Quay lại</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
