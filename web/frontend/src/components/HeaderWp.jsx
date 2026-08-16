import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { TopBar } from './TopBar';
import { FALLBACK_HEADER_DATA, getHeaderData } from '../services/headerApi';
import { fetchMenuByLocation } from '../api/wp';

export function HeaderWp() {
  const [data, setData] = useState(FALLBACK_HEADER_DATA);
  const [topbarLoginMenuItems, setTopbarLoginMenuItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getHeaderData(), fetchMenuByLocation('topbar_member_login')])
      .then(([headerResult, loginMenuResult]) => {
        if (cancelled) return;
        setData(headerResult || FALLBACK_HEADER_DATA);
        setTopbarLoginMenuItems(loginMenuResult?.ok ? (loginMenuResult.items || []) : []);
      })
      .catch(() => {
        if (cancelled) return;
        setData(FALLBACK_HEADER_DATA);
        setTopbarLoginMenuItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {data?.topbar?.enabled === false ? null : <TopBar {...(data.topbar || {})} loginMenuItems={topbarLoginMenuItems} />}
      <Header headerBgColor={data?.main?.bgColor} logoAsset={data?.main?.logo} />
    </>
  );
}

