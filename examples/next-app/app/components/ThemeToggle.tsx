'use client';

import { useState, useEffect } from 'react';
import { Button } from '@brandplan/ui';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Initialize theme from document
    const currentTheme = document.documentElement.dataset.theme as 'dark' | 'light' | undefined;
    setTheme(currentTheme || 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    if (newTheme === 'dark') {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = 'light';
    }
  };

  return (
    <Button
      variant="outline"
      tone="primary"
      size="sm"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </Button>
  );
}
