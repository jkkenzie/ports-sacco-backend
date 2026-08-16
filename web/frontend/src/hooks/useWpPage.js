import { useEffect, useState } from 'react';
import { fetchPageBySlug } from '../api/wp';

/**
 * Load a WordPress page by slug from portsacco/v1/page/{slug}.
 */
export function useWpPage(slug) {
  const [blocks, setBlocks] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null, notFound: false });

  useEffect(() => {
    let cancelled = false;

    setStatus({ loading: true, error: null, notFound: false });
    setBlocks([]);

    fetchPageBySlug(slug)
      .then((result) => {
        if (cancelled) return;

        if (result.status === 404) {
          setBlocks([]);
          setStatus({ loading: false, error: null, notFound: true });
          return;
        }

        if (!result.ok) {
          setBlocks([]);
          setStatus({
            loading: false,
            error: result.error || `Page request failed (${result.status || 'network'})`,
            notFound: false,
          });
          return;
        }

        const nextBlocks = result.data?.blocks ?? [];
        setBlocks(Array.isArray(nextBlocks) ? nextBlocks : []);
        setStatus({ loading: false, error: null, notFound: false });
      })
      .catch((err) => {
        if (cancelled) return;
        setBlocks([]);
        setStatus({
          loading: false,
          error: err?.message || 'Page request failed',
          notFound: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { blocks, status };
}
