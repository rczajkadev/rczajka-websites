'use client';

import { useEffect, useState } from 'react';

export const useDebouncedValue = <T>(value: T, delayMs: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => window.clearTimeout(handler);
  }, [value, delayMs]);

  return debouncedValue;
};
