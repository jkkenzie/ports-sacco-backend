import { useEffect } from 'react';

function upsertMeta(attrName, attrValue, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Update document title and Open Graph / Twitter meta tags for share previews.
 */
export function useSocialMeta({ title, description, imageUrl, url, enabled = true }) {
  useEffect(() => {
    if (!enabled) return undefined;

    const previousTitle = document.title;
    const touched = [];

    const setMeta = (attrName, attrValue, content) => {
      if (!content) return;
      const selector = `meta[${attrName}="${attrValue}"]`;
      const existing = document.querySelector(selector);
      touched.push({
        selector,
        had: Boolean(existing),
        content: existing?.getAttribute('content') || '',
      });
      upsertMeta(attrName, attrValue, content);
    };

    if (title) {
      document.title = title;
    }

    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', imageUrl);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', imageUrl);
    setMeta('name', 'description', description);

    return () => {
      document.title = previousTitle;
      touched.forEach(({ selector, had, content }) => {
        const el = document.querySelector(selector);
        if (!el) return;
        if (!had) {
          el.remove();
          return;
        }
        if (content) {
          el.setAttribute('content', content);
        } else {
          el.removeAttribute('content');
        }
      });
    };
  }, [title, description, imageUrl, url, enabled]);
}
