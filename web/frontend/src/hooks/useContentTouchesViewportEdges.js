import { useCallback, useLayoutEffect, useState } from 'react';

/** Pixels of tolerance when comparing panel edges to the viewport. */
export const VIEWPORT_EDGE_TOLERANCE_PX = 2;

/**
 * True when the element's box touches both left and right viewport edges
 * (i.e. it spans full width). When false, max-w-7xl has side margins — use overlay banner.
 */
export function useContentTouchesViewportEdges(ref) {
  const [touches, setTouches] = useState(true);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const { left, right } = el.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const touchesLeft = left <= VIEWPORT_EDGE_TOLERANCE_PX;
    const touchesRight = right >= viewportWidth - VIEWPORT_EDGE_TOLERANCE_PX;

    setTouches(touchesLeft && touchesRight);
  }, [ref]);

  useLayoutEffect(() => {
    measure();

    window.addEventListener('resize', measure);

    const el = ref.current;
    let observer;
    if (el && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure);
      observer.observe(el);
    }

    return () => {
      window.removeEventListener('resize', measure);
      observer?.disconnect();
    };
  }, [measure, ref]);

  return touches;
}
