import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeConfig, TransitionConfig } from '@/types';

interface UIState {
  sidebarCollapsed: boolean;
  currentView: 'board' | 'list' | 'calendar' | 'gantt';
  
  // Theme settings
  theme: ThemeConfig;
  
  // Modals state
  activeModal: string | null;
  modalData: Record<string, any>;

  // Onboarding state
  onboardingComplete: boolean;
  currentOnboardingStep: number;
  
  // Actions
  toggleSidebar: () => void;
  setCurrentView: (view: 'board' | 'list' | 'calendar' | 'gantt') => void;
  
  // Theme actions
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  setAccentColor: (color: string) => void;
  toggleGlassEffect: () => void;
  setAnimationIntensity: (intensity: 'subtle' | 'medium' | 'high') => void;
  setDensity: (density: 'compact' | 'comfortable' | 'spacious') => void;
  setTransitionConfig: (config: Partial<TransitionConfig>) => void;
  
  // Modal actions
  openModal: (modalId: string, data?: Record<string, any>) => void;
  closeModal: () => void;
  
  // Onboarding actions
  completeOnboarding: () => void;
  setOnboardingStep: (step: number) => void;
  nextOnboardingStep: () => void;
  resetOnboarding: () => void;
}

// Default transition configs
const defaultTransitions: Record<'subtle' | 'medium' | 'high', TransitionConfig> = {
  subtle: {
    type: 'tween',
    duration: 0.2,
  },
  medium: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  },
  high: {
    type: 'spring',
    stiffness: 400,
    damping: 15,
    mass: 1.2,
    bounce: 0.25,
  },
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      currentView: 'board',
      
      // Theme settings
      theme: {
        mode: 'system',
        accentColor: '#3b82f6', // Primary blue color
        glassEffect: true,
        animation: {
          enabled: true,
          intensity: 'medium',
          transitions: defaultTransitions.medium,
        },
        density: 'comfortable',
      },
      
      // Modals state
      activeModal: null,
      modalData: {},
      
      // Onboarding state
      onboardingComplete: false,
      currentOnboardingStep: 0,
      
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setCurrentView: (view) => set({ currentView: view }),
      
      // Theme actions
      setThemeMode: (mode) => {
        set((state) => ({
          theme: {
            ...state.theme,
            mode,
          },
        }));
        
        // Apply theme to document
        const root = window.document.documentElement;
        
        if (mode === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.remove('light', 'dark');
          root.classList.add(systemTheme);
        } else {
          root.classList.remove('light', 'dark');
          root.classList.add(mode);
        }
      },
      
      setAccentColor: (color) => set((state) => ({
        theme: {
          ...state.theme,
          accentColor: color,
        },
      })),
      
      toggleGlassEffect: () => set((state) => ({
        theme: {
          ...state.theme,
          glassEffect: !state.theme.glassEffect,
        },
      })),
      
      setAnimationIntensity: (intensity) => set((state) => ({
        theme: {
          ...state.theme,
          animation: {
            ...state.theme.animation,
            intensity,
            transitions: defaultTransitions[intensity],
          },
        },
      })),
      
      setDensity: (density) => set((state) => ({
        theme: {
          ...state.theme,
          density,
        },
      })),
      
      setTransitionConfig: (config) => set((state) => ({
        theme: {
          ...state.theme,
          animation: {
            ...state.theme.animation,
            transitions: {
              ...state.theme.animation.transitions,
              ...config,
            },
          },
        },
      })),
      
      // Modal actions
      openModal: (modalId, data = {}) => set({
        activeModal: modalId,
        modalData: data,
      }),
      
      closeModal: () => set({
        activeModal: null,
        modalData: {},
      }),
      
      // Onboarding actions
      completeOnboarding: () => set({
        onboardingComplete: true,
      }),
      
      setOnboardingStep: (step) => set({
        currentOnboardingStep: step,
      }),
      
      nextOnboardingStep: () => set((state) => ({
        currentOnboardingStep: state.currentOnboardingStep + 1,
      })),
      
      resetOnboarding: () => set({
        onboardingComplete: false,
        currentOnboardingStep: 0,
      }),
    }),
    {
      name: 'ui-preferences',
    }
  )
);

// Initialize theme on app start
if (typeof window !== 'undefined') {
  const { setThemeMode } = useUIStore.getState();
  const storedState = JSON.parse(localStorage.getItem('ui-preferences') || '{}');
  const themeMode = storedState?.state?.theme?.mode || 'system';
  setThemeMode(themeMode);
} 