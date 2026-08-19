// 'use client';

// import * as React from 'react';

// type Theme = 'light' | 'dark' | 'system';

// type ThemeContextValue = {
//   themes: Theme[];
//   setTheme: React.Dispatch<React.SetStateAction<string>>;
//   theme: string;
//   resolvedTheme: 'light' | 'dark';
//   systemTheme: 'light' | 'dark';
// };

// type ThemeProviderProps = React.PropsWithChildren<{
//   attribute?: 'class' | `data-${string}`;
//   defaultTheme?: Theme;
//   disableTransitionOnChange?: boolean;
//   enableSystem?: boolean;
//   storageKey?: string;
// }>;

// const ThemeContext = React.createContext<ThemeContextValue | null>(null);
// const availableThemes: Theme[] = ['light', 'dark'];
// const availableSystemThemes: Theme[] = ['light', 'dark', 'system'];
// const themeChangeEvent = 'themechange';

// function getSystemTheme(): 'light' | 'dark' {
//   if (typeof window === 'undefined') {
//     return 'light';
//   }

//   return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
// }

// function getStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
//   const stored = window.localStorage.getItem(storageKey);
//   return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : defaultTheme;
// }

// function subscribeToStoredTheme(onStoreChange: () => void) {
//   window.addEventListener('storage', onStoreChange);
//   window.addEventListener(themeChangeEvent, onStoreChange);

//   return () => {
//     window.removeEventListener('storage', onStoreChange);
//     window.removeEventListener(themeChangeEvent, onStoreChange);
//   };
// }

// function subscribeToSystemTheme(onStoreChange: () => void) {
//   const media = window.matchMedia('(prefers-color-scheme: dark)');
//   media.addEventListener('change', onStoreChange);

//   return () => media.removeEventListener('change', onStoreChange);
// }

// function disableTransitions() {
//   const style = document.createElement('style');
//   style.appendChild(document.createTextNode('*{transition:none!important}'));
//   document.head.appendChild(style);
//   window.getComputedStyle(document.body);
//   window.setTimeout(() => style.remove(), 1);
// }

// export function ThemeProvider({
//   attribute = 'class',
//   children,
//   defaultTheme = 'light',
//   disableTransitionOnChange = false,
//   enableSystem = false,
//   storageKey = 'theme',
// }: ThemeProviderProps) {
//   const theme = React.useSyncExternalStore<Theme>(
//     subscribeToStoredTheme,
//     () => getStoredTheme(storageKey, defaultTheme),
//     () => defaultTheme
//   );
//   const systemTheme = React.useSyncExternalStore<'light' | 'dark'>(
//     subscribeToSystemTheme,
//     getSystemTheme,
//     () => 'light'
//   );
//   const resolvedTheme: 'light' | 'dark' =
//     theme === 'system' && enableSystem ? systemTheme : theme === 'dark' ? 'dark' : 'light';

//   React.useEffect(() => {
//     if (disableTransitionOnChange) {
//       disableTransitions();
//     }

//     const root = document.documentElement;
//     if (attribute === 'class') {
//       root.classList.remove('light', 'dark');
//       root.classList.add(resolvedTheme);
//     } else {
//       root.setAttribute(attribute, resolvedTheme);
//     }
//     root.style.colorScheme = resolvedTheme;
//   }, [attribute, disableTransitionOnChange, resolvedTheme]);

//   const setTheme = React.useCallback<React.Dispatch<React.SetStateAction<string>>>(
//     (value) => {
//       if (typeof window === 'undefined') {
//         return;
//       }

//       const currentTheme = getStoredTheme(storageKey, defaultTheme);
//       const nextTheme = typeof value === 'function' ? value(currentTheme) : value;
//       const supportedTheme =
//         nextTheme === 'light' || nextTheme === 'dark' || nextTheme === 'system'
//           ? nextTheme
//           : defaultTheme;

//       window.localStorage.setItem(storageKey, supportedTheme);
//       window.dispatchEvent(new Event(themeChangeEvent));
//     },
//     [defaultTheme, storageKey]
//   );

//   const contextValue = React.useMemo<ThemeContextValue>(
//     () => ({
//       themes: enableSystem ? availableSystemThemes : availableThemes,
//       setTheme,
//       theme,
//       resolvedTheme,
//       systemTheme,
//     }),
//     [enableSystem, resolvedTheme, setTheme, systemTheme, theme]
//   );

//   return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
// }

// export function useTheme() {
//   const context = React.useContext(ThemeContext);

//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }

//   return context;
// }
