import { useCallback } from 'react';

type HapticPattern = 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy' | 'selection';

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  success: [10, 50, 10],      // Doble vibración corta
  error: [50, 30, 50, 30, 50], // Triple vibración de error
  warning: [30, 20, 30],       // Doble vibración media
  light: 10,                   // Vibración muy corta
  medium: 25,                  // Vibración media
  heavy: 50,                   // Vibración larga
  selection: 5,                // Micro vibración para selección
};

/**
 * useHaptic - Hook para feedback háptico en dispositivos móviles
 * Usa la Web Vibration API cuando está disponible
 * 
 * @example
 * const { vibrate, isSupported } = useHaptic();
 * vibrate('success'); // Vibración de éxito
 */
export function useHaptic() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const vibrate = useCallback((pattern: HapticPattern = 'light') => {
    if (!isSupported) return false;
    
    try {
      const vibrationPattern = HAPTIC_PATTERNS[pattern];
      return navigator.vibrate(vibrationPattern);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
      return false;
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    navigator.vibrate(0);
  }, [isSupported]);

  return {
    vibrate,
    stop,
    isSupported,
  };
}

/**
 * Función standalone para vibración rápida sin hook
 * Verifica las preferencias del usuario antes de vibrar
 */
export function triggerHaptic(pattern: HapticPattern = 'light'): boolean {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) {
    return false;
  }
  
  // Verificar preferencias del usuario
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('treevu-user-preferences');
      if (stored) {
        const prefs = JSON.parse(stored);
        if (prefs.hapticEnabled === false) return false;
      }
    } catch {}
  }
  
  try {
    const vibrationPattern = HAPTIC_PATTERNS[pattern];
    return navigator.vibrate(vibrationPattern);
  } catch {
    return false;
  }
}

export default useHaptic;
