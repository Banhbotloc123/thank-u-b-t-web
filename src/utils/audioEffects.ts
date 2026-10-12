// Crystal-Clear Audio Effect Synthesizer (Âm thanh trong trẻo)
let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// Mouse audio effects disabled per user request ("Bỏ âm thanh chuột đi")
export const playClickSound = (_volume = 0.25) => {
  // Disabled
};

export const playMouseMoveSound = (_throttleMs = 320, _volume = 0.10) => {
  // Disabled
};
