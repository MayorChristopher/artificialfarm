import React from 'react';
import { Helmet } from 'react-helmet';
import AboutHero from '@/components/about/AboutHero';
import MissionVision from '@/components/about/MissionVision';
import BrandSymbols from '@/components/about/BrandSymbols';
import AchievementsSection from '@/components/about/AchievementsSection';
import CoreValues from '@/components/about/CoreValues';
import ServicesSection from '@/components/about/ServicesSection';
import CallToAction from '@/components/about/CallToAction';

const AboutPage = () => {

  return (
    <>
      <Helmet>
        <title>About Us - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Learn about our mission to aid innovation in farming, seed tech, agro-input production and supply. Supporting farmers and communities through sustainable projects and research." />
      </Helmet>

      <AboutHero />
      <MissionVision />
      <BrandSymbols />
      <AchievementsSection />
      <CoreValues />
      <ServicesSection />
      <CallToAction />
    </>
  );
};

export default AboutPage;