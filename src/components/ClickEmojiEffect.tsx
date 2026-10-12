import React, { useEffect, useState, useRef } from 'react';

interface PawTrail {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  color: string;
}

interface FloatingEmoji {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  rotation: number;
}

const CLICK_EMOJIS = ['🐾', '🐾', '🐱', '💖', '🌸', '✨', '🤍'];
const PAW_COLORS = ['#FF8FAB', '#FB6F92', '#FFB3C1', '#F4A261', '#E76F51', '#D4A373'];

export const ClickEmojiEffect: React.FC = () => {
  const [trails, setTrails] = useState<PawTrail[]>([]);
  const [clicks, setClicks] = useState<FloatingEmoji[]>([]);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const stepCount = useRef<number>(0);

  // Mouse Move Event for Cat Paw Footprints
  useEffect(() => {
    let timeoutId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Only drop a paw footprint every ~28px of cursor movement
      if (dist > 28) {
        lastPos.current = { x: e.clientX, y: e.clientY };
        stepCount.current += 1;

        // Calculate movement angle
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        // Alternate tilt for left/right paws
        const sideTilt = (stepCount.current % 2 === 0 ? 12 : -12);
        const rotation = angle + sideTilt;
        const color = PAW_COLORS[stepCount.current % PAW_COLORS.length];
        const now = Date.now() + Math.random();

        const newPaw: PawTrail = {
          id: now,
          x: e.clientX,
          y: e.clientY,
          rotation,
          size: Math.floor(Math.random() * 4) + 16, // 16px - 20px
          color,
        };

        setTrails((prev) => [...prev.slice(-25), newPaw]);

        setTimeout(() => {
          setTrails((prev) => prev.filter((p) => p.id !== newPaw.id));
        }, 850);
      }
    };

    const handleWindowClick = (e: MouseEvent) => {
      const randomEmoji = CLICK_EMOJIS[Math.floor(Math.random() * CLICK_EMOJIS.length)];
      const size = Math.floor(Math.random() * 8) + 26; // 26px to 34px
      const now = Date.now() + Math.random();
      const rotation = (Math.random() - 0.5) * 30;

      const newBurst: FloatingEmoji = {
        id: now,
        x: e.clientX,
        y: e.clientY,
        emoji: randomEmoji,
        size,
        rotation,
      };

      setClicks((prev) => [...prev.slice(-15), newBurst]);

      setTimeout(() => {
        setClicks((prev) => prev.filter((item) => item.id !== newBurst.id));
      }, 1200);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleWindowClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleWindowClick);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      {/* Moving Cat Paw Footprints */}
      {trails.map((paw) => (
        <div
          key={paw.id}
          className="fixed animate-paw-trail"
          style={{
            left: `${paw.x}px`,
            top: `${paw.y}px`,
            ['--paw-rot' as any]: `${paw.rotation}deg`,
          }}
        >
          <svg
            width={paw.size}
            height={paw.size}
            viewBox="0 0 24 24"
            fill={paw.color}
            style={{ opacity: 0.85, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}
          >
            {/* Paw Pad Center */}
            <path d="M12 10.5C9.5 10.5 8 12.5 8 15C8 17.5 10 20 12 20.5C14 20 16 17.5 16 15C16 12.5 14.5 10.5 12 10.5Z" />
            {/* Toe 1 */}
            <ellipse cx="6" cy="9.5" rx="2" ry="2.8" transform="rotate(-25 6 9.5)" />
            {/* Toe 2 */}
            <ellipse cx="9.8" cy="6" rx="2" ry="2.8" transform="rotate(-8 9.8 6)" />
            {/* Toe 3 */}
            <ellipse cx="14.2" cy="6" rx="2" ry="2.8" transform="rotate(8 14.2 6)" />
            {/* Toe 4 */}
            <ellipse cx="18" cy="9.5" rx="2" ry="2.8" transform="rotate(25 18 9.5)" />
          </svg>
        </div>
      ))}

      {/* Click Emoji/Paw Bursts */}
      {clicks.map((item) => (
        <span
          key={item.id}
          className="fixed animate-paw-burst drop-shadow-md text-center"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            fontSize: `${item.size}px`,
            ['--burst-rot' as any]: `${item.rotation}deg`,
            lineHeight: 1,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
};

export default ClickEmojiEffect;

