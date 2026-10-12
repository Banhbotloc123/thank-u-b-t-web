import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Shuffle, 
  ChevronDown, 
  ChevronUp, 
  Volume2, 
  VolumeX,
  Radio,
  ExternalLink,
  X
} from 'lucide-react';

export interface Song {
  id: number;
  title: string;
  youtubeId: string;
  startSeconds: number;
  endSeconds: number;
  timeRangeLabel: string;
  youtubeUrl: string;
}

export const SONGS: Song[] = [
  {
    id: 1,
    title: 'Fallen Angel',
    youtubeId: 's466YCiHfKw',
    startSeconds: 311,
    endSeconds: 336,
    timeRangeLabel: '5:11 - 5:36',
    youtubeUrl: 'https://youtu.be/s466YCiHfKw?si=f_q7UApfIjxqE5m_'
  },
  {
    id: 2,
    title: 'Lana Del Rey',
    youtubeId: 'TdrL3QxjyVw',
    startSeconds: 0,
    endSeconds: 265,
    timeRangeLabel: '0:00 - 4:25',
    youtubeUrl: 'https://youtu.be/TdrL3QxjyVw?si=6gVQtAsqcjNGUenF'
  }
];

export const CHINA_SONGS = SONGS;
export const USUK_SONGS = SONGS;
export type PlaylistCategory = 'all';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MusicPlayerProps {
  isWelcomePage?: boolean;
  hasExitedHome?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  isWelcomePage = false,
  hasExitedHome = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  // Track whether the user explicitly stopped/paused the main music
  const isManuallyPausedRef = useRef<boolean>(false);
  // Track whether uncle modal has silenced main music
  const isSuppressedByUncleRef = useRef<boolean>(false);
  
  // Volume rules:
  // - Homepage: 80%
  // - Welcome page / On entering web: 80% (or 40% if returning)
  const computeTargetVolume = () => {
    if (!isWelcomePage) return 80;
    if (hasExitedHome) return 40;
    return 80;
  };

  const [volume, setVolume] = useState<number>(computeTargetVolume());
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const volumeRef = useRef<number>(computeTargetVolume());
  const isMutedRef = useRef<boolean>(false);
  const isShuffleRef = useRef<boolean>(false);
  const currentIndexRef = useRef<number>(0);
  const pendingPlayRef = useRef<boolean>(false);
  const isWelcomePageRef = useRef<boolean>(isWelcomePage);
  const hasExitedHomeRef = useRef<boolean>(hasExitedHome);

  volumeRef.current = volume;
  isMutedRef.current = isMuted;
  isShuffleRef.current = isShuffle;
  currentIndexRef.current = currentIndex;
  isWelcomePageRef.current = isWelcomePage;
  hasExitedHomeRef.current = hasExitedHome;

  const currentPlaylist = SONGS;
  const currentSong = currentPlaylist[currentIndex] || currentPlaylist[0];

  const startMusicPlayback = (vol?: number, force = false) => {
    if (!force && (isManuallyPausedRef.current || isSuppressedByUncleRef.current)) {
      return;
    }
    const player = playerRef.current;
    const targetVol = vol !== undefined ? vol : volumeRef.current;
    if (player && typeof player.playVideo === 'function') {
      try {
        if (!isMutedRef.current && typeof player.unMute === 'function') {
          player.unMute();
        }
        if (typeof player.setVolume === 'function') {
          player.setVolume(isMutedRef.current ? 0 : targetVol);
        }
        player.playVideo();
        setIsPlaying(true);
      } catch (e) {
        console.error('Error starting playback:', e);
      }
    } else {
      pendingPlayRef.current = true;
    }
  };

  const pauseMusicPlayback = (hardMute = false) => {
    const player = playerRef.current;
    if (player) {
      try {
        if (typeof player.pauseVideo === 'function') {
          player.pauseVideo();
        }
        if (hardMute && typeof player.mute === 'function') {
          player.mute();
        }
        if (hardMute && typeof player.setVolume === 'function') {
          player.setVolume(0);
        }
        setIsPlaying(false);
      } catch (e) {
        console.error('Error pausing playback:', e);
      }
    }
  };

  // Listen for direct trigger signals
  useEffect(() => {
    const handleEnterHomeSignal = () => {
      isManuallyPausedRef.current = false;
      setVolume(80);
      volumeRef.current = 80;
      if (playerRef.current && typeof playerRef.current.unMute === 'function') {
        playerRef.current.unMute();
      }
      startMusicPlayback(80, true);
    };

    window.addEventListener('enter-home-page', handleEnterHomeSignal);
    window.addEventListener('play-music-now', handleEnterHomeSignal);

    const handlePauseSignal = () => {
      isSuppressedByUncleRef.current = true;
      pauseMusicPlayback(true);
    };

    const handleResumeSignal = () => {
      isSuppressedByUncleRef.current = false;
      // Only resume if user hadn't explicitly turned off main music
      if (!isManuallyPausedRef.current) {
        if (playerRef.current && typeof playerRef.current.unMute === 'function' && !isMutedRef.current) {
          playerRef.current.unMute();
        }
        startMusicPlayback(80, true);
      }
    };

    window.addEventListener('pause-main-music', handlePauseSignal);
    window.addEventListener('resume-main-music', handleResumeSignal);

    return () => {
      window.removeEventListener('enter-home-page', handleEnterHomeSignal);
      window.removeEventListener('play-music-now', handleEnterHomeSignal);
      window.removeEventListener('pause-main-music', handlePauseSignal);
      window.removeEventListener('resume-main-music', handleResumeSignal);
    };
  }, []);

  // Handle page transitions & volume adjustment
  useEffect(() => {
    const targetVol = computeTargetVolume();
    setVolume(targetVol);
    volumeRef.current = targetVol;

    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try {
        if (!isMutedRef.current) {
          playerRef.current.setVolume(targetVol);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (!isManuallyPausedRef.current && !isSuppressedByUncleRef.current) {
      startMusicPlayback(targetVol);
    }
  }, [isWelcomePage, hasExitedHome]);

  // Load YouTube IFrame API script
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    function initPlayer() {
      if (playerRef.current) return;
      const initSong = SONGS[0];
      playerRef.current = new window.YT.Player('youtube-audio-element', {
        height: '0',
        width: '0',
        videoId: initSong.youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          start: initSong.startSeconds,
          end: initSong.endSeconds,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            setIsPlayerReady(true);
            const targetVol = computeTargetVolume();
            try {
              if (isManuallyPausedRef.current || isSuppressedByUncleRef.current) {
                if (typeof event.target.pauseVideo === 'function') {
                  event.target.pauseVideo();
                }
                return;
              }
              if (typeof event.target.unMute === 'function') {
                event.target.unMute();
              }
              event.target.setVolume(targetVol);
              event.target.playVideo();
              setIsPlaying(true);
            } catch (e) {
              console.log('Autoplay attempt onReady:', e);
            }
            pendingPlayRef.current = false;
          },
          onStateChange: (event: any) => {
            if (event.data === 0) {
              handleNextWithFade();
            } else if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2) {
              setIsPlaying(false);
            }
          }
        }
      });
    }
  }, []);

  // Listen for user gestures on the web to trigger audio if not manually paused
  useEffect(() => {
    const handleGesture = () => {
      if (isManuallyPausedRef.current || isSuppressedByUncleRef.current) {
        return;
      }
      const player = playerRef.current;
      const targetVol = computeTargetVolume();
      if (player && typeof player.getPlayerState === 'function') {
        const state = player.getPlayerState();
        if (state !== 1) {
          startMusicPlayback(targetVol);
        }
      } else {
        pendingPlayRef.current = true;
      }
    };

    window.addEventListener('click', handleGesture, { passive: true });
    window.addEventListener('touchstart', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture, { passive: true });
    window.addEventListener('pointerdown', handleGesture, { passive: true });

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('pointerdown', handleGesture);
    };
  }, [isPlayerReady, isWelcomePage, hasExitedHome]);

  // Monitor playback time to enforce endSeconds loop/next
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const time = playerRef.current.getCurrentTime();
          const song = SONGS[currentIndexRef.current];
          if (song && time >= song.endSeconds - 0.5) {
            handleNextWithFade();
          }
        } catch (e) {
          console.error(e);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Smooth Fade out -> Switch song -> Fade in
  const transitionToSong = (targetIndex: number) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const nextSong = SONGS[targetIndex] || SONGS[0];
    const player = playerRef.current;

    if (!player || typeof player.setVolume !== 'function') {
      setCurrentIndex(targetIndex);
      isTransitioningRef.current = false;
      return;
    }

    const startVol = isMuted ? 0 : volumeRef.current;
    let currentVol = startVol;

    // Step 1: Volume fade out
    const fadeOutTimer = setInterval(() => {
      currentVol -= 20;
      if (currentVol <= 0) {
        currentVol = 0;
        clearInterval(fadeOutTimer);
        try {
          player.setVolume(0);
        } catch (e) {}

        // Step 2: Switch song index
        setCurrentIndex(targetIndex);

        if (typeof player.loadVideoById === 'function') {
          player.loadVideoById({
            videoId: nextSong.youtubeId,
            startSeconds: nextSong.startSeconds,
            endSeconds: nextSong.endSeconds,
          });
          player.playVideo();
          setIsPlaying(true);

          // Step 3: Volume fade in
          let inVol = 0;
          const targetVol = isMuted ? 0 : volumeRef.current;
          const fadeInTimer = setInterval(() => {
            inVol += 20;
            if (inVol >= targetVol) {
              inVol = targetVol;
              clearInterval(fadeInTimer);
              isTransitioningRef.current = false;
            }
            try {
              player.setVolume(inVol);
            } catch (e) {}
          }, 80);
        } else {
          isTransitioningRef.current = false;
        }
      } else {
        try {
          player.setVolume(currentVol);
        } catch (e) {}
      }
    }, 80);
  };

  const getNextIndex = () => {
    if (isShuffleRef.current) {
      let rand = Math.floor(Math.random() * SONGS.length);
      if (rand === currentIndexRef.current && SONGS.length > 1) {
        rand = (rand + 1) % SONGS.length;
      }
      return rand;
    }
    return (currentIndexRef.current + 1) % SONGS.length;
  };

  const getPrevIndex = () => {
    if (isShuffleRef.current) {
      let rand = Math.floor(Math.random() * SONGS.length);
      if (rand === currentIndexRef.current && SONGS.length > 1) {
        rand = (rand + 1) % SONGS.length;
      }
      return rand;
    }
    return (currentIndexRef.current - 1 + SONGS.length) % SONGS.length;
  };

  const handleNextWithFade = () => {
    const nextIdx = getNextIndex();
    transitionToSong(nextIdx);
  };

  const handlePrevWithFade = () => {
    const prevIdx = getPrevIndex();
    transitionToSong(prevIdx);
  };

  const togglePlayPause = () => {
    const player = playerRef.current;
    if (!player) return;

    try {
      if (isPlaying) {
        isManuallyPausedRef.current = true;
        if (typeof player.pauseVideo === 'function') {
          player.pauseVideo();
        }
        if (typeof player.mute === 'function') {
          player.mute();
        }
        setIsPlaying(false);
      } else {
        isManuallyPausedRef.current = false;
        if (!isMuted && typeof player.unMute === 'function') {
          player.unMute();
        }
        if (typeof player.setVolume === 'function') {
          player.setVolume(isMuted ? 0 : (volume || 80));
        }
        if (typeof player.playVideo === 'function') {
          player.playVideo();
        }
        setIsPlaying(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseInt(e.target.value, 10);
    setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
      isMutedRef.current = false;
    }
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(newVol);
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    isMutedRef.current = nextMute;
    if (playerRef.current) {
      try {
        if (nextMute) {
          if (typeof playerRef.current.mute === 'function') {
            playerRef.current.mute();
          }
          if (typeof playerRef.current.setVolume === 'function') {
            playerRef.current.setVolume(0);
          }
        } else {
          if (typeof playerRef.current.unMute === 'function') {
            playerRef.current.unMute();
          }
          if (typeof playerRef.current.setVolume === 'function') {
            playerRef.current.setVolume(volume || 80);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const [showMiniControls, setShowMiniControls] = useState<boolean>(false);

  return (
    <>
      {/* Hidden YouTube iframe container */}
      <div className="hidden" aria-hidden="true">
        <div id="youtube-audio-element" />
      </div>

      {/* Floating Vinyl Music Disc Widget */}
      <div className="relative select-none">
        {/* Disc Button */}
        <button
          onClick={togglePlayPause}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowMiniControls(!showMiniControls);
          }}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-neutral-950 border-2 border-white/40 shadow-[0_8px_25px_rgba(0,0,0,0.65)] flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 group focus:outline-none"
          title={isPlaying ? `Đang phát: ${currentSong.title} (Bấm để tạm dừng, nhấp phải/giữ để mở điều khiển)` : 'Bấm để phát nhạc'}
        >
          {/* Vinyl Disc Body with Circular Image */}
          <div
            className={`w-full h-full rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-700 shadow-inner ${
              isPlaying ? 'animate-[spin_4.5s_linear_infinite]' : ''
            }`}
          >
            <img
              src="https://i.pinimg.com/1200x/1e/90/cb/1e90cbc5fdf8dce7a09cd5b8442254e7.jpg"
              alt="Đĩa nhạc"
              className="w-full h-full object-cover rounded-full select-none pointer-events-none"
            />

            {/* Vinyl Center Hole */}
            <div className="absolute w-3.5 h-3.5 rounded-full bg-neutral-950/80 border border-white/50 flex items-center justify-center shadow-sm z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 border border-neutral-400" />
            </div>

            {/* Subtle Vinyl Grooves & Circular Glass Sheen */}
            <div className="absolute inset-0 rounded-full border border-black/20 pointer-events-none" />
            <div className="absolute inset-1.5 rounded-full border border-white/15 pointer-events-none" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none opacity-40" />
          </div>

          {/* Mini Play/Pause overlay badge at corner of disc */}
          <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[#3d393f] border border-white/40 flex items-center justify-center text-white text-[9px] shadow-sm z-20">
            {isPlaying ? (
              <Pause className="w-2.5 h-2.5 fill-white text-white" />
            ) : (
              <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
            )}
          </div>
        </button>

        {/* Mini Control Toggle dot button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMiniControls(!showMiniControls);
          }}
          className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-black/80 hover:bg-black text-[#f5efef] border border-white/30 flex items-center justify-center text-[9px] cursor-pointer shadow-xs active:scale-90"
          title="Mở bảng điều khiển nhạc"
        >
          ♫
        </button>

        {/* Mini Popover Controls Floating next to the Disc */}
        {showMiniControls && (
          <div className="absolute bottom-14 right-0 w-64 bg-[#2c2929] text-[#f5efef] border border-white/20 rounded-2xl p-3 shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-scaleUp z-50">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Music className="w-3.5 h-3.5 text-[#dfafaf] shrink-0" />
                <span className="text-xs font-bold text-[#dfafaf] truncate">
                  {currentSong.title}
                </span>
              </div>
              <button
                onClick={() => setShowMiniControls(false)}
                className="text-white/60 hover:text-white p-0.5 rounded cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="text-[10px] text-neutral-400 mb-2 font-mono flex items-center justify-between">
              <span>Đoạn nhạc: {currentSong.timeRangeLabel}</span>
              <span>{isPlaying ? '▶ Đang phát' : '⏸ Đang dừng'}</span>
            </div>

            {/* Playback action buttons */}
            <div className="flex items-center justify-center gap-3 mb-2.5">
              <button
                onClick={handlePrevWithFade}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer active:scale-95"
                title="Bài trước"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={togglePlayPause}
                className="p-2 rounded-full bg-[#dfafaf] hover:bg-[#ecd0d0] text-[#2c2929] transition-all cursor-pointer active:scale-95 shadow-sm"
                title={isPlaying ? 'Tạm dừng' : 'Phát'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button
                onClick={handleNextWithFade}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer active:scale-95"
                title="Bài tiếp"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
              <button
                onClick={toggleMute}
                className="text-neutral-400 hover:text-white cursor-pointer"
                title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#dfafaf]"
                title="Âm lượng"
              />
              <span className="text-[10px] text-neutral-400 w-6 text-right">
                {isMuted ? 0 : volume}%
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
