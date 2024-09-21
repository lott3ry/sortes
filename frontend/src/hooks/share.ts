import { useCallback } from 'react';
import { showSucc } from '../utils/notify';

export const useShareSwap = () => {
  const handleShare = useCallback(async (swapId: string, swapName: string) => {
    const url = `${window.location.origin}/play?swap=${swapId}`;
    const shareData = {
      title: 'Web3 Sortes',
      text: `Come to swap pool ${swapName}!`,
      url,
    };

    // use Web Share API if browser support
    if (
      navigator.share !== undefined &&
      navigator.canShare !== undefined &&
      navigator.canShare(shareData)
    ) {
      navigator.share(shareData);
    }
    await navigator.clipboard.writeText(url);
    showSucc('Swap link copied to clipboard!');
  }, []);
  return handleShare;
};
