import React from 'react';
import { AdSpace } from '../components/AdSpace';
import { Hero } from '../components/Hero';
import { CategoryGrid, ComparisonTable, HowItWorks, MaintainerCTA, TrustSignals } from '../components/HomeSections';
import { ProjectExplorer } from '../components/ProjectExplorer';

/**
 * Landing page. Search state lives in the URL, so the hero box and the
 * explorer below stay in sync and results can be shared as a link.
 */
export const DiscoverPage: React.FC = () => (
  <>
    <Hero />
    <TrustSignals />

    <ProjectExplorer title="Trending projects" pageSize={12} />

    <div className="container">
      <AdSpace type="banner" />
    </div>

    <HowItWorks />
    <CategoryGrid />
    <ComparisonTable />
    <MaintainerCTA />
  </>
);

export default DiscoverPage;
