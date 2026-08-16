import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HeaderWp } from './components/HeaderWp';
import { Footer } from './components/Footer';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { getAppBasePath } from './utils/appBase';

import { MenuProvider } from './contexts/MenuContext';
import { DynamicPage } from './pages/DynamicPage';
import { SavingsProductsPage } from './components/SavingsProductsPage';
import { SavingsProductPostPage } from './components/SavingsProductPostPage';
import { LoanProductPostPage } from './components/LoanProductPostPage';
import { LoanProductsPage } from './components/LoanProductsPage';
import { ServicesPage } from './components/ServicesPage';
import { ServicePostPage } from './components/ServicePostPage';
import { EventsPage } from './components/EventsPage';
import { EventPostPage } from './components/EventPostPage';
import { MembershipPage } from './components/MembershipPage';
import { ContactUsPage } from './components/ContactUsPage';
import { NewsPostPage } from './components/NewsPostPage';

function AppShell() {
  const location = useLocation();

  useEffect(() => {
    const isEditableTarget = (target) => {
      const el = target instanceof Element ? target : null;
      if (!el) return false;
      const tag = el.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
      if (el.isContentEditable) return true;
      return Boolean(el.closest?.('[contenteditable="true"]'));
    };

    const onContextMenu = (e) => {
      e.preventDefault();
    };

    const onKeyDown = (e) => {
      const key = (e.key || '').toLowerCase();
      const ctrlOrCmd = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      const isDevTools =
        key === 'f12' ||
        (ctrlOrCmd && shift && (key === 'i' || key === 'j' || key === 'c')) ||
        (e.metaKey && e.altKey && key === 'i');

      const isCommonBlocked =
        ctrlOrCmd && (key === 'c' || key === 'x' || key === 'v' || key === 's' || key === 'p' || key === 'u' || key === 'a');

      if (isDevTools || (!isEditableTarget(e.target) && isCommonBlocked)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('contextmenu', onContextMenu, { capture: true });
    document.addEventListener('keydown', onKeyDown, { capture: true });

    return () => {
      document.removeEventListener('contextmenu', onContextMenu, { capture: true });
      document.removeEventListener('keydown', onKeyDown, { capture: true });
    };
  }, []);

  useEffect(() => {
    // Always start from top on page navigation.
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-[#f3f5f7] overflow-x-hidden">
      <HeaderWp />
      <Routes>
        <Route path="/savings-products" element={<SavingsProductsPage />} />
        <Route path="/savings-products/:slug" element={<SavingsProductPostPage />} />
        <Route path="/loan-products" element={<LoanProductsPage />} />
        <Route path="/loan-products/:slug" element={<LoanProductPostPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServicePostPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventPostPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/news/:slug" element={<NewsPostPage />} />
        <Route path="*" element={<DynamicPage />} />
      </Routes>
      <Footer />
      <CookieConsentBanner />
    </div>
  );
}

export default function App() {
  const basename = getAppBasePath() || undefined;

  return (
    <BrowserRouter basename={basename}>
      <MenuProvider location="primary">
        <AppShell />
      </MenuProvider>
    </BrowserRouter>
  );
}
