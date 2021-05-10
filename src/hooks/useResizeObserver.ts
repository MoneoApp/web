import { useLayoutEffect, useRef, useState } from 'react';

export function useResizeObserver<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [rect, setRect] = useState<DOMRectReadOnly>();

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      setRect(entries[0].contentRect);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [ref, rect] as const;
}
