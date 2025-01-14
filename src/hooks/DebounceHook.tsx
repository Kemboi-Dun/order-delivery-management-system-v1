import { useRef } from "react";

const useCustomDebounce = (func: Function, delay: number) => {
  const timeoutRef = useRef<number | null>(null);
  const debouncedFunc = (...args: any[]) => {
    return new Promise((resolve) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        resolve(func(...args));
      }, delay);
    });
  };
  return debouncedFunc;
};

export default useCustomDebounce;
