import React from 'react'
import { TopBar } from './TopBar'
import { Header } from './Header'
import { HeroSection } from './HeroSection'
import { StatsSection } from './StatsSection'
import { AboutSection } from './AboutSection'
import { ProductCardsSection } from './ProductCardsSection'
import { ProductServicesSection } from './ProductServicesSection'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ProductCardsSection />
      <ProductServicesSection />
    </div>
  )
}

export default HomePage
