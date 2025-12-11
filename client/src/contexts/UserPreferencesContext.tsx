import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface UserPreferences {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  animationsEnabled: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setSoundEnabled: (enabled: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  toggleHaptic: () => void;
  toggleAnimations: () => void;
}

const STORAGE_KEY = 'treevu-user-preferences';

const defaultPreferences: UserPreferences = {
  soundEnabled: true,
  hapticEnabled: true,
  animationsEnabled: true,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | null>(null);

function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') return defaultPreferences;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load user preferences:', e);
  }
  return defaultPreferences;
}

function savePreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (e) {
    console.warn('Failed to save user preferences:', e);
  }
}

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    setPreferences(loadPreferences());
    setIsLoaded(true);
  }, []);

  // Save preferences when they change
  useEffect(() => {
    if (isLoaded) {
      savePreferences(preferences);
    }
  }, [preferences, isLoaded]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setPreferences(prev => ({ ...prev, soundEnabled: enabled }));
  }, []);

  const setHapticEnabled = useCallback((enabled: boolean) => {
    setPreferences(prev => ({ ...prev, hapticEnabled: enabled }));
  }, []);

  const setAnimationsEnabled = useCallback((enabled: boolean) => {
    setPreferences(prev => ({ ...prev, animationsEnabled: enabled }));
  }, []);

  const toggleSound = useCallback(() => {
    setPreferences(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const toggleHaptic = useCallback(() => {
    setPreferences(prev => ({ ...prev, hapticEnabled: !prev.hapticEnabled }));
  }, []);

  const toggleAnimations = useCallback(() => {
    setPreferences(prev => ({ ...prev, animationsEnabled: !prev.animationsEnabled }));
  }, []);

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        setSoundEnabled,
        setHapticEnabled,
        setAnimationsEnabled,
        toggleSound,
        toggleHaptic,
        toggleAnimations,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return context;
}

/**
 * Hook simplificado para verificar si los sonidos están habilitados
 */
export function useSoundPreference(): boolean {
  const context = useContext(UserPreferencesContext);
  return context?.preferences.soundEnabled ?? true;
}

/**
 * Hook simplificado para verificar si el haptic está habilitado
 */
export function useHapticPreference(): boolean {
  const context = useContext(UserPreferencesContext);
  return context?.preferences.hapticEnabled ?? true;
}

export default UserPreferencesContext;
