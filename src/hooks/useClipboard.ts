import { useState, useCallback } from 'react';

export const useClipboard = (timeout = 2000) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), timeout);
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      setIsCopied(false);
      return false;
    }
  }, [timeout]);

  return { copy, isCopied };
};