import { useCallback } from 'react';
import { showSucc } from '../utils/notify';

export const useCopy = ({
  text,
}: {
  text?: string;
} = {}) => {
  const handleCopy = useCallback(
    async (swapId?: string, route?: string) => {
      const finalUrl = swapId
        ? `${window.location.origin}/play?swap=${swapId}`
        : `${window.location.origin}/${route}`;

      await navigator.clipboard.writeText(finalUrl);
      showSucc(text || 'Link copied to clipboard.');
    },
    [text]
  );
  return handleCopy;
};
