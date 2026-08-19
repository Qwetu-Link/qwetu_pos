// 'use client';

// import * as React from 'react';
// import { useTheme } from '@/components/theme-provider';
// import { Moon, Sun } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// export function ThemeToggle() {
//   const { resolvedTheme, setTheme } = useTheme();
//   const isDark = resolvedTheme === 'dark';

//   return (
//     <Button
//       variant="ghost"
//       size="icon"
//       className="h-9 w-9"
//       onClick={() => setTheme(isDark ? 'light' : 'dark')}
//       suppressHydrationWarning
//     >
//       {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   );
// }
