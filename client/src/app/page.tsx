import React from 'react'
import Navbar from './components/common/Navbar';
import Hero from './components/home/Hero';
import FeatureGrid from './components/home/FeatureGrid';
import HowItWorks from './components/home/HowItWorks';
import Footer from './components/common/Footer';

function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <Footer />
    </div>
  )
}

export default HomePage