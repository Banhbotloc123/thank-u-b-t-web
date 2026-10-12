import React, { useState, useEffect, useRef } from 'react';

interface WelcomePageProps {
  onEnter: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter }) => {
  const bgImage = 'https://i.pinimg.com/736x/42/46/5a/42465aeac75faab7d8d6aeb6c411a30c.jpg';
  const fullText = "Đẹp hơn cả lần đầu gặp gỡ, chính là ngày ta tương phùng.";

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context on demand
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Mechanical keyboard sound synthesizer via Web Audio API
  const playMechanicalSound = (isSpace: boolean) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      if (isSpace) {
        // Spacebar: deeper, resonant mechanical "bộp" sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200 + Math.random() * 25, t);
        osc.frequency.exponentialRampToValueAtTime(75, t + 0.07);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.085);
      } else {
        // Regular key: crisp mechanical click + subtle thock
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();

        clickOsc.type = 'sine';
        clickOsc.frequency.setValueAtTime(2500 + Math.random() * 500, t);
        clickOsc.frequency.exponentialRampToValueAtTime(900, t + 0.025);

        clickGain.gain.setValueAtTime(0.18, t);
        clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);

        clickOsc.start(t);
        clickOsc.stop(t + 0.035);

        // Body thock
        const thockOsc = ctx.createOscillator();
        const thockGain = ctx.createGain();

        thockOsc.type = 'triangle';
        thockOsc.frequency.setValueAtTime(450 + Math.random() * 80, t);
        thockOsc.frequency.exponentialRampToValueAtTime(150, t + 0.045);

        thockGain.gain.setValueAtTime(0.18, t);
        thockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        thockOsc.connect(thockGain);
        thockGain.connect(ctx.destination);

        thockOsc.start(t);
        thockOsc.stop(t + 0.055);
      }
    } catch (e) {
      // Audio error ignored safely
    }
  };

  // Cursor blinking every 0.5s
  useEffect(() => {
    if (!isTransitioning) return;
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, [isTransitioning]);

  // Typewriter effect simulating human typing speed: 50ms - 80ms per character
  useEffect(() => {
    if (!isTransitioning) return;

    let currentIndex = 0;
    let timer: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        const nextChar = fullText[currentIndex];
        const isSpace = nextChar === ' ';
        playMechanicalSound(isSpace);

        currentIndex++;
        setDisplayedText(fullText.slice(0, currentIndex));

        // Speed between 50ms and 80ms
        const delay = Math.floor(Math.random() * 31) + 50;
        timer = setTimeout(typeNextChar, delay);
      }
    };

    // Small brief pause before typing starts
    timer = setTimeout(typeNextChar, 180);

    return () => {
      clearTimeout(timer);
    };
  }, [isTransitioning]);

  // Click on "BANH BOT LOC" triggers the transition screen
  const handleStartTransition = () => {
    getAudioContext();
    setIsTransitioning(true);
  };

  // Click during/after transition proceeds to homepage & starts music playback
  const handleProceedToHome = () => {
    try {
      window.dispatchEvent(new CustomEvent('enter-home-page'));
    } catch (e) {}
    onEnter();
  };

  // TRANSITION SCREEN: Pure Black #000000, Fullscreen, Typewriter Effect & Mechanical Keyboard Sound
  if (isTransitioning) {
    return (
      <div
        id="transition-page"
        onClick={handleProceedToHome}
        className="fixed inset-0 w-full h-screen z-[10000] bg-[#000000] text-[#FFFFFF] flex flex-col justify-center items-center px-4 overflow-hidden select-none cursor-pointer"
        style={{ margin: 0, padding: 0 }}
      >
        {/* Dòng chữ nhỏ xuất hiện trước màn hình (Mờ khoảng 40%): "Lạch cạch (Bấm tiếp)" */}
        <div className="mb-6 sm:mb-8 text-center z-10 pointer-events-none">
          <p className="font-sharp-slender text-xs sm:text-sm text-white/40 tracking-[0.3em] uppercase">
            Lạch cạch (Bấm tiếp)
          </p>
        </div>

        {/* Dòng chữ chiếm 30% màn hình, căn theo chiều ngang, font chữ mảnh sắc */}
        <div className="w-[88vw] sm:w-[50vw] md:w-[30vw] max-w-xl text-center flex flex-col items-center justify-center">
          <h2 className="font-sharp-slender font-light italic text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed sm:leading-loose text-[#FFFFFF] tracking-widest inline">
            <span>{displayedText}</span>
            {/* Blinking Vertical Bar Cursor (|) every 0.5 seconds */}
            <span
              className={`inline-block font-mono font-extralight ml-1 text-[#FFFFFF] transition-opacity duration-75 ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ verticalAlign: 'baseline' }}
            >
              |
            </span>
          </h2>
        </div>
      </div>
    );
  }

  // INITIAL WELCOME SCREEN: Darkened 30% background & Blinking Gothic pure white "Bánh Bột Lọc"
  return (
    <div
      id="welcome-page"
      className="fixed inset-0 w-full h-screen z-[9999] flex flex-col justify-center items-center px-4 transition-all duration-500 ease-in-out overflow-hidden select-none"
    >
      {/* Background Image (Darkened by 30% / Brightness 70%) */}
      <img
        src={bgImage}
        alt="Welcome Background"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.05] transition-opacity duration-700"
      />

      {/* 30% Dark Overlay for deep, atmospheric contrast */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Center: Dòng chữ BANH BOT LOC (Gothic, #ffffff, nhấp nháy, click vào chuyển tiếp sang trang chủ) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <button
          onClick={handleStartTransition}
          className="group relative cursor-pointer outline-none transition-transform duration-300 hover:scale-105 active:scale-95 p-6"
          title="Bấm để tiếp tục"
          aria-label="Vào trang chuyển tiếp BANH BOT LOC"
        >
          <h1 className="font-gothic text-white text-white-pure animate-gothic-blink text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.2em] sm:tracking-[0.25em] uppercase text-center transition-all duration-300 drop-shadow-[0_0_25px_rgba(255,255,255,0.85)]">
            BANH BOT LOC
          </h1>
        </button>
      </div>
    </div>
  );
};
