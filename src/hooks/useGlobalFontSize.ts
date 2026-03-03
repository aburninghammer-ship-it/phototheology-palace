import { useState, useEffect, useCallback } from 'react';

const FONT_SIZE_KEY = 'pt-global-font-size';
const DEFAULT_SIZE = 100; // percentage
const MIN_SIZE = 80;
const MAX_SIZE = 150;
const STEP = 10;

export function useGlobalFontSize() {
  const [fontSize, setFontSizeState] = useState(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_SIZE;
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
  }, [fontSize]);

  const setFontSize = useCallback((size: number) => {
    const clamped = Math.min(MAX_SIZE, Math.max(MIN_SIZE, size));
    setFontSizeState(clamped);
  }, []);

  const increase = useCallback(() => setFontSize(fontSize + STEP), [fontSize, setFontSize]);
  const decrease = useCallback(() => setFontSize(fontSize - STEP), [fontSize, setFontSize]);
  const reset = useCallback(() => setFontSize(DEFAULT_SIZE), [setFontSize]);

  return { fontSize, setFontSize, increase, decrease, reset, MIN_SIZE, MAX_SIZE, STEP };
}
