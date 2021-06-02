import { DependencyList, useCallback, useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement = HTMLDivElement>(fn: () => void, deps: DependencyList) {
  const ref = useRef<T>(null);
  const callback = useCallback(fn, deps);

  useEffect(() => {
    let startedWhenMounted = false;
    let startedInside = false;

    const start = (event: Event) => {
      startedWhenMounted = Boolean(ref.current);
      startedInside = Boolean(ref.current?.contains(event.target as Node));
    };

    const listener = (event: Event) => {
      if (!startedWhenMounted || startedInside || ref.current?.contains(event.target as Node)) {
        return;
      }

      callback();
    };

    document.addEventListener('mousedown', start);
    document.addEventListener('touchstart', start);
    document.addEventListener('click', listener);

    return () => {
      document.removeEventListener('mousedown', start);
      document.removeEventListener('touchstart', start);
      document.removeEventListener('click', listener);
    };
  }, [ref, callback]);

  return ref;
}
