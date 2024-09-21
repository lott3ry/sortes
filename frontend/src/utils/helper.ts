export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const debounce = (func: (...args: any) => void, wait: number) => {
  let timer: NodeJS.Timeout | null = null;

  return (...args: any) => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func(...args);
      timer = null;
    }, wait);
  };
};

export const once = (func: (...args: any) => void) => {
  let called = false;

  return (...args: any) => {
    if (!called) {
      called = true;
      func(...args);
    }
  };
};
