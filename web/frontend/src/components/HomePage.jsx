import React from 'react'
import { TopBar } from './TopBar'
import { Header } from './Header'
import { HeroSection } from './HeroSection'
import { HomeStatsBlock, HOME_STATS_DEFAULT_PROPS } from '../blocks/HomeStatsBlock'
import { AboutSection } from './AboutSection'
import { ProductCardsSection } from './ProductCardsSection'
import { ProductServicesSection } from './ProductServicesSection'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <HeroSection />
      <HomeStatsBlock {...HOME_STATS_DEFAULT_PROPS} />
      <AboutSection />
      <ProductCardsSection />
      <ProductServicesSection />
    </div>
  )
}

export default HomePage