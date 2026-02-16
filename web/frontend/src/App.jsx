import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { AboutSection } from './components/AboutSection';
import { ProductCardsSection } from './components/ProductCardsSection';
import { ProductServicesSection } from './components/ProductServicesSection';
import { CarouselsSection } from './components/CarouselsSection';
import { MobileAppSection } from './components/MobileAppSection';
import { NewsletterSection } from './components/NewsletterSection';
import { NewsEventsSection } from './components/NewsEventsSection';
import { PartnersSection } from './components/PartnersSection';
import { EventsSection } from './components/EventsSection';
import { MemberReviewsSection } from './components/MemberReviewsSection';
import { HelpSection } from './components/HelpSection';
import { AboutUsPage } from './components/AboutUsPage';
import { FloatingHelpButton } from './components/FloatingHelpButton';

function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ProductCardsSection />
      <ProductServicesSection />
      <CarouselsSection />
      <MobileAppSection />
      <NewsEventsSection />
      <NewsletterSection />
      <PartnersSection />
      <EventsSection />
      <MemberReviewsSection />
      <HelpSection />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f3f5f7] overflow-x-hidden">
        <TopBar />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
        </Routes>
        <Footer />
        <FloatingHelpButton />
      </div>
    </BrowserRouter>
  );
}

