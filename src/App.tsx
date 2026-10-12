import React, { useState, useEffect } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { SearchBar } from './components/SearchBar';
import { MusicPlayer } from './components/MusicPlayer';
import { DailyBanner, getHanoiDayIndex } from './components/DailyBanner';
import { ItemCard } from './components/ItemCard';
import { Toast } from './components/Toast';
import { AddCardModal } from './components/AddCardModal';
import { ChatSimulatorModal } from './components/ChatSimulatorModal';
import { DetailModal } from './components/DetailModal';
import { HusbandWheelModal } from './components/HusbandWheelModal';
import { AnnouncementModal, WingedLetterButton } from './components/AnnouncementModal';
import { UncleMessageModal } from './components/UncleMessageModal';
import { PlotModal } from './components/PlotModal';
import { ChatNoticeModal } from './components/ChatNoticeModal';
import { ClickEmojiEffect } from './components/ClickEmojiEffect';
import { INITIAL_CARDS } from './data/initialCards';
import { CharacterCard, CategoryTag } from './types';
import { matchesCategoryTag } from './utils/filterCards';
import { Home, Star, Layers, Bell } from 'lucide-react';

const STORAGE_KEY = 'banh_bot_loc_cards_v26';

// Daily background images according to Hanoi timezone / Day of week
const CO_TRANG_DAILY_BACKGROUNDS: Record<number, string> = {
  1: 'https://i.pinimg.com/control1/1200x/9a/8b/8a/9a8b8ae30e13303d50568ee95b6c083e.jpg', // Thứ Hai
  2: 'https://i.pinimg.com/control1/1200x/ae/ac/d9/aeacd9fbf4be8f653450091828af9f73.jpg', // Thứ Ba
  3: 'https://i.pinimg.com/736x/c8/c9/b6/c8c9b6240b89c08ba5b210b9603dc2d1.jpg', // Thứ Tư
  4: 'https://i.pinimg.com/736x/78/58/bd/7858bd7eb5ed4705af8cb6eac25d5825.jpg', // Thứ Năm
  5: 'https://i.pinimg.com/control1/1200x/c2/95/d5/c295d56ea3f92958d62ca22d03f43ff4.jpg', // Thứ Sáu
  6: 'https://i.pinimg.com/control1/1200x/87/b4/73/87b473609e7a47d86c1a53189c3e255c.jpg', // Thứ Bảy
  0: 'https://i.pinimg.com/736x/98/ff/4a/98ff4a50010b009e1aee91b093686af2.jpg', // Chủ Nhật
};

const US_UK_DAILY_BACKGROUNDS: Record<number, string> = {
  1: 'https://i.pinimg.com/736x/c2/2b/d5/c22bd5807b50f174e01eb7eb6cfe523f.jpg', // Thứ Hai
  2: 'https://i.pinimg.com/1200x/1f/7e/6e/1f7e6efcb0518c256a7d810db23775d0.jpg', // Thứ Ba
  3: 'https://i.pinimg.com/736x/81/81/05/818105a86f43ed567fbdfb612e513cbf.jpg', // Thứ Tư
  4: 'https://i.pinimg.com/736x/54/45/ea/5445ea37df9c350b742c497766e988e2.jpg', // Thứ Năm
  5: 'https://i.pinimg.com/736x/ad/c5/94/adc594e398c20685c96ae5953366eecd.jpg', // Thứ Sáu
  6: 'https://i.pinimg.com/1200x/6c/5c/50/6c5c500ac611818015aa326428747224.jpg', // Thứ Bảy
  0: 'https://i.pinimg.com/736x/2a/06/87/2a0687fa79b9100d24d30d0049069eb3.jpg', // Chủ Nhật
};

export default function App() {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [hasEnteredHomeOnce, setHasEnteredHomeOnce] = useState<boolean>(false);
  const [hanoiDayIndex, setHanoiDayIndex] = useState<number>(() => getHanoiDayIndex());
  const [vibe, setVibe] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('banh_bot_loc_welcome_vibe');
      if (saved === 'us_uk') return 'us_uk';
    } catch (e) {}
    return 'co_trang';
  });

  // Listen for vibe changes
  useEffect(() => {
    const handleVibeChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setVibe(detail);
    };
    window.addEventListener('vibe-changed', handleVibeChange);
    return () => {
      window.removeEventListener('vibe-changed', handleVibeChange);
    };
  }, []);

  // Periodically update current Hanoi day index
  useEffect(() => {
    const interval = setInterval(() => {
      setHanoiDayIndex(getHanoiDayIndex());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentBgUrl = 'https://i.pinimg.com/736x/90/04/a2/9004a22ee0c9cc486bf0599cfa6b02e6.jpg';
  const [cards, setCards] = useState<CharacterCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('banh_bot_loc_cards_v25') || localStorage.getItem('banh_bot_loc_cards_v24') || localStorage.getItem('banh_bot_loc_cards_v23') || localStorage.getItem('banh_bot_loc_cards_v22') || localStorage.getItem('banh_bot_loc_cards_v21') || localStorage.getItem('banh_bot_loc_cards_v20') || localStorage.getItem('banh_bot_loc_cards_v19') || localStorage.getItem('banh_bot_loc_cards_v18') || localStorage.getItem('banh_bot_loc_cards_v17') || localStorage.getItem('banh_bot_loc_cards_v16');
      if (saved) {
        const parsed: CharacterCard[] = JSON.parse(saved);
        // Sync updated initial card properties
        const updated = parsed.map(card => {
          const init = INITIAL_CARDS.find(ic => ic.id === card.id);
          if (init) {
            return {
              ...card,
              name: init.name,
              tag: init.tag,
              tagsList: init.tagsList,
              imageUrl: init.imageUrl,
              imagesList: init.imagesList,
              chatUrl: init.chatUrl,
              copyLink: init.copyLink,
              plotUrl: init.plotUrl,
              plotContent: init.plotContent,
              chatNotice: init.chatNotice,
              description: init.description,
              greeting: init.greeting,
              personality: init.personality,
              note: init.note,
              context: init.context,
              author: init.author,
              collabNote: init.collabNote,
              collabUrl: init.collabUrl,
            };
          }
          return card;
        });
        const missing = INITIAL_CARDS.filter(ic => !updated.some(p => p.id === ic.id));
        if (missing.length > 0) {
          return [...missing, ...updated];
        }
        return updated;
      }
    } catch (e) {
      console.error('Error loading cards from localStorage', e);
    }
    return INITIAL_CARDS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<CategoryTag>('Tất cả');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWheelModalOpen, setIsWheelModalOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [isUncleModalOpen, setIsUncleModalOpen] = useState(false);
  const [selectedPlotCard, setSelectedPlotCard] = useState<CharacterCard | null>(null);
  const [selectedNoticeCard, setSelectedNoticeCard] = useState<CharacterCard | null>(null);

  const handleOpenChatLink = (card: CharacterCard) => {
    if (card.chatNotice || card.name.includes('Dương Tử Mặc')) {
      setSelectedNoticeCard(card);
    } else {
      window.open(card.chatUrl, '_blank');
    }
  };
  const [hasUnreadAnnouncement, setHasUnreadAnnouncement] = useState<boolean>(() => {
    try {
      return localStorage.getItem('banh_bot_loc_announcement_has_unread') === 'true';
    } catch {
      return false;
    }
  });

  const handleMarkAsRead = () => {
    setHasUnreadAnnouncement(false);
    try {
      localStorage.setItem('banh_bot_loc_announcement_has_unread', 'false');
    } catch (e) {
      console.error(e);
    }
  };
  const [selectedDetailCard, setSelectedDetailCard] = useState<CharacterCard | null>(null);
  const [selectedChatCard, setSelectedChatCard] = useState<CharacterCard | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState('Đã copy đường link!');
  const [showToast, setShowToast] = useState(false);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error('Error saving cards to localStorage', e);
    }
  }, [cards]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2200);
  };

  const handleEnterShop = () => {
    setShowWelcome(false);
    setHasEnteredHomeOnce(true);
    try {
      window.dispatchEvent(new CustomEvent('enter-home-page'));
    } catch (e) {}
  };

  const handleCopyToClipboard = (link: string) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        triggerToast('Đã copy đường link!');
      })
      .catch((err) => {
        console.error('Lỗi copy: ', err);
        triggerToast('Đã sao chép liên kết!');
      });
  };

  const handleToggleFavorite = (id: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = !c.isFavorite;
          triggerToast(updated ? 'Đã thêm vào Yêu thích ❤️' : 'Đã bỏ Yêu thích');
          return { ...c, isFavorite: updated };
        }
        return c;
      })
    );
  };

  const handleAddCard = (newCard: CharacterCard) => {
    setCards((prev) => [newCard, ...prev]);
    triggerToast('Thêm nhân vật mới thành công! ✨');
  };

  // Filter Cards
  const filteredCards = cards.filter((card) => {
    if (showFavoritesOnly && !card.isFavorite) {
      return false;
    }

    if (selectedTag !== 'Tất cả') {
      if (!matchesCategoryTag(card, selectedTag)) {
        return false;
      }
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = card.name.toLowerCase().includes(q);
      const matchDesc = card.description?.toLowerCase().includes(q) || false;
      const matchAuthor = card.author?.toLowerCase().includes(q) || false;
      const matchTag = card.tag.toLowerCase().includes(q);
      return matchName || matchDesc || matchAuthor || matchTag;
    }

    return true;
  });

  const favoriteCount = cards.filter((c) => c.isFavorite).length;

  return (
    <div className="min-h-screen text-[#4A4A4A] relative selection:bg-[#D4A373]/20 selection:text-[#D4A373] bg-neutral-900">
      {/* Background Image for Main App Page with 60% Dark Overlay */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <img
          key={currentBgUrl}
          src={currentBgUrl}
          alt="Main Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-opacity duration-1000"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600';
          }}
        />
        {/* Dark Overlay (reduced darkness by 10%, around 45% darkness) */}
        <div className="absolute inset-0 bg-black/45 backdrop-brightness-95" />
      </div>

      {/* 1. TRANG BƯỚC VÀO (WELCOME PAGE) */}
      {showWelcome && <WelcomePage onEnter={handleEnterShop} />}

      {/* 2. MAIN APPLICATION CONTAINER */}
      <div id="main-page" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 transition-opacity duration-500">
        
        {/* DAILY HORIZONTAL BANNER (CHANGES ACCORDING TO HANOI TIME / DAY OF WEEK) */}
        <DailyBanner />

        {/* MAIN CONTENT AREA */}
        <main className="max-w-5xl mx-auto w-full">
          {/* Search & Header Navigation */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            showFavoritesOnly={showFavoritesOnly}
            setShowFavoritesOnly={setShowFavoritesOnly}
            onGoWelcome={() => setShowWelcome(true)}
            onOpenWheel={() => setIsWheelModalOpen(true)}
            onOpenUncleMessage={() => setIsUncleModalOpen(true)}
            totalCards={cards.length}
            favoriteCount={favoriteCount}
          />

          {/* List Filter Indicator Header */}
          <div className="flex items-center justify-between mb-5 px-4 py-2.5 bg-gradient-to-r from-[#FFF0F3] via-[#FFE4E8] to-[#FFFFFF] animate-pastel-pink-flow backdrop-blur-xl rounded-2xl border-2 border-[#FFC2D1] shadow-[0_4px_20px_rgba(255,182,193,0.4)]">
            <p className="text-xs font-bold text-[#800F2F] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#C71F37]" />
              {showFavoritesOnly ? (
                <span>Danh sách Yêu thích ({filteredCards.length})</span>
              ) : (
                <span>
                  Danh mục: <span className="text-[#C71F37] font-extrabold">{selectedTag}</span> ({filteredCards.length})
                </span>
              )}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAnnouncementOpen(true)}
                className="text-[11px] font-bold text-[#800F2F] hover:text-[#590D22] flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-[#F7CAD0] transition-colors cursor-pointer shadow-2xs relative"
                title="Mở hòm thư thông báo"
              >
                <Bell className="w-3 h-3 text-[#C71F37]" />
                <span>Thông báo</span>
                {hasUnreadAnnouncement && (
                  <span className="w-2 h-2 rounded-full bg-[#ecb96d] shadow-[0_0_6px_#ecb96d] animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setShowWelcome(true)}
                className="text-[11px] font-bold text-[#800F2F] hover:text-[#590D22] flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full border border-[#F7CAD0] transition-colors cursor-pointer shadow-2xs"
              >
                <Home className="w-3 h-3 text-[#C71F37]" />
                Màn hình chào
              </button>
            </div>
          </div>

          {/* 2-column grid layout for character cards (2 frames per row, evenly aligned) */}
          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
              {filteredCards.map((card) => (
                <ItemCard
                  key={card.id}
                  card={card}
                  onCopyLink={handleCopyToClipboard}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenDetail={(c) => setSelectedDetailCard(c)}
                  onOpenChatSimulator={(c) => setSelectedChatCard(c)}
                  onOpenPlot={(c) => setSelectedPlotCard(c)}
                  onOpenChatLink={handleOpenChatLink}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center border border-[#D4A373]/30 my-6 shadow-2xs">
              <div className="w-14 h-14 rounded-full bg-[#FFFDF0] border border-[#D4A373]/40 mx-auto flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-[#D4A373] fill-[#D4A373]" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-gray-800 mb-1">Chưa tìm thấy nhân vật phù hợp</h3>
              <p className="text-xs text-gray-500 mb-5 max-w-sm mx-auto">
                Thử tìm kiếm với từ khóa khác hoặc nhấn "Thêm mới" để catalog mẫu nhân vật bạn thích.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('Tất cả');
                  setShowFavoritesOnly(false);
                }}
                className="px-5 py-2 rounded-full bg-[#FFFDF0] text-[#D4A373] border border-[#D4A373] text-xs font-bold uppercase tracking-wider hover:bg-[#D4A373] hover:text-white transition-all cursor-pointer shadow-2xs"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-[#D4A373]/20 text-center text-xs text-[#A3B18A] space-y-1 pb-8">
            <p className="font-semibold text-amber-100/90 drop-shadow-xs">Bánh Bột Lọc • Thank you for being my past.</p>
            <p className="text-[10px] tracking-wider uppercase text-amber-200/80">Bấm "Copy link" hoặc "Mở Chat" để bắt đầu trò chuyện</p>
          </footer>
        </main>
      </div>

      {/* Modals & Toast & Click Effects */}
      <ClickEmojiEffect />
      <Toast message={toastMessage} isVisible={showToast} />

      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCard={handleAddCard}
      />

      <DetailModal
        card={selectedDetailCard}
        isOpen={!!selectedDetailCard}
        onClose={() => setSelectedDetailCard(null)}
        onCopyLink={handleCopyToClipboard}
        onToggleFavorite={handleToggleFavorite}
        onOpenChatSimulator={(c) => setSelectedChatCard(c)}
        onOpenPlot={(c) => setSelectedPlotCard(c)}
        onOpenChatLink={handleOpenChatLink}
      />

      <PlotModal
        card={selectedPlotCard}
        isOpen={!!selectedPlotCard}
        onClose={() => setSelectedPlotCard(null)}
        onOpenChatLink={handleOpenChatLink}
      />

      <ChatNoticeModal
        card={selectedNoticeCard}
        isOpen={!!selectedNoticeCard}
        onClose={() => setSelectedNoticeCard(null)}
        onConfirmOpen={(url) => window.open(url, '_blank')}
      />

      <ChatSimulatorModal
        card={selectedChatCard}
        isOpen={!!selectedChatCard}
        onClose={() => setSelectedChatCard(null)}
      />

      <HusbandWheelModal
        isOpen={isWheelModalOpen}
        onClose={() => setIsWheelModalOpen(false)}
        cards={cards}
        onOpenDetail={(c) => setSelectedDetailCard(c)}
        onOpenChat={(c) => setSelectedChatCard(c)}
      />

      <AnnouncementModal
        isOpen={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(false)}
        hasUnread={hasUnreadAnnouncement}
        onMarkAsRead={handleMarkAsRead}
      />

      <UncleMessageModal
        isOpen={isUncleModalOpen}
        onClose={() => setIsUncleModalOpen(false)}
      />

      {/* FLOATING ACTION STACK AT BOTTOM-RIGHT CORNER: WINGED LETTER & VINYL MUSIC DISC */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-center gap-2.5 select-none pointer-events-auto">
        {/* Bức thư đen nhạt (#3d393f) với hai đôi cánh thiên thần trắng nhỏ (#cfcbcb) */}
        {!showWelcome && (
          <WingedLetterButton
            hasUnread={hasUnreadAnnouncement}
            onClick={() => setIsAnnouncementOpen(true)}
          />
        )}

        {/* Đĩa nhạc thu nhỏ ở góc phải dưới cùng màn hình */}
        <MusicPlayer
          isWelcomePage={showWelcome}
          hasExitedHome={hasEnteredHomeOnce && showWelcome}
        />
      </div>
    </div>
  );
}
