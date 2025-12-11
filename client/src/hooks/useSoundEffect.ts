import { useCallback, useRef, useEffect } from 'react';

type SoundEffect = 'success' | 'error' | 'notification' | 'celebration' | 'click' | 'coin';

// Frecuencias y duraciones para generar sonidos con Web Audio API
const SOUND_CONFIGS: Record<SoundEffect, { frequencies: number[]; durations: number[]; type: OscillatorType; gain: number }> = {
  success: {
    frequencies: [523.25, 659.25, 783.99], // C5, E5, G5 - acorde mayor
    durations: [0.1, 0.1, 0.15],
    type: 'sine',
    gain: 0.15,
  },
  error: {
    frequencies: [200, 150],
    durations: [0.15, 0.2],
    type: 'square',
    gain: 0.1,
  },
  notification: {
    frequencies: [880, 1108.73], // A5, C#6
    durations: [0.08, 0.12],
    type: 'sine',
    gain: 0.12,
  },
  celebration: {
    frequencies: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6 - fanfarria
    durations: [0.1, 0.1, 0.1, 0.25],
    type: 'sine',
    gain: 0.15,
  },
  click: {
    frequencies: [1000],
    durations: [0.03],
    type: 'sine',
    gain: 0.08,
  },
  coin: {
    frequencies: [1318.51, 1567.98], // E6, G6 - sonido de moneda
    durations: [0.08, 0.15],
    type: 'sine',
    gain: 0.12,
  },
};

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      return null;
    }
  }
  return audioContext;
}

/**
 * Reproduce un sonido usando Web Audio API
 */
function playSound(effect: SoundEffect): boolean {
  const ctx = getAudioContext();
  if (!ctx) return false;

  // Resumir contexto si está suspendido (requerido por políticas de autoplay)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const config = SOUND_CONFIGS[effect];
  let startTime = ctx.currentTime;

  config.frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(config.gain, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + config.durations[i]);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + config.durations[i]);

    startTime += config.durations[i] * 0.7; // Overlap para suavizar
  });

  return true;
}

/**
 * useSoundEffect - Hook para efectos de sonido
 * 
 * @param enabled - Si los sonidos están habilitados (respeta preferencias del usuario)
 * 
 * @example
 * const { play, setEnabled } = useSoundEffect();
 * play('success'); // Reproduce sonido de éxito
 */
export function useSoundEffect(enabled: boolean = true) {
  const isEnabled = useRef(enabled);

  useEffect(() => {
    isEnabled.current = enabled;
  }, [enabled]);

  const play = useCallback((effect: SoundEffect) => {
    if (!isEnabled.current) return false;
    return playSound(effect);
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    isEnabled.current = value;
  }, []);

  return {
    play,
    setEnabled,
    isEnabled: isEnabled.current,
  };
}

/**
 * Función standalone para reproducir sonido sin hook
 * Verifica las preferencias del usuario antes de reproducir
 */
export function triggerSound(effect: SoundEffect): boolean {
  // Verificar preferencias del usuario
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('treevu-user-preferences');
      if (stored) {
        const prefs = JSON.parse(stored);
        if (prefs.soundEnabled === false) return false;
      }
    } catch {}
  }
  return playSound(effect);
}

export default useSoundEffect;
