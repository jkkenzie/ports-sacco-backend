import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMenuByLocation } from '../api/wp';

const MenuContext = createContext({
  items: [],
  loading: true,
  error: null,
  reload: () => {},
});

export function MenuProvider({ children, location = 'primary' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stripMobileBanking = useCallback((list) => {
    const shouldDrop = (item) => {
      const label = String(item?.label || '').toLowerCase();
      const url = String(item?.url || '').toLowerCase();
      return label.includes('mobile banking') || url.includes('mobile-banking');
    };
    const walk = (arr) =>
      (Array.isArray(arr) ? arr : [])
        .filter((it) => it && typeof it === 'object' && !shouldDrop(it))
        .map((it) => ({
          ...it,
          children: walk(it.children),
        }));
    return walk(list);
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchMenuByLocation(location)
      .then((r) => {
        if (!r.ok) {
          setError(`Menu request failed (${r.status})`);
          setItems([]);
          return;
        }
        setItems(stripMobileBanking(r.items));
      })
      .catch((e) => {
        setError(e?.message || 'Menu request failed');
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [location, stripMobileBanking]);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo(
    () => ({
      items,
      loading,
      error,
      reload,
    }),
    [items, loading, error, reload],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  return useContext(MenuContext);
}
