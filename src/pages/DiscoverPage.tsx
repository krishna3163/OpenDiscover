import React from 'react';
import { Hero } from '../components/Hero';
import { ProjectList } from '../components/ProjectList';
import { AdSpace } from '../components/AdSpace';
import { TrustSignals, HowItWorks, CategoryGrid, ComparisonTable, MaintainerCTA } from '../components/HomeSections';

export const DiscoverPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = React.useState('');

    return (
        <>
            <Hero onSearch={setSearchQuery} />
            <TrustSignals />
            <HowItWorks />

            {/* Featured Projects Section */}
            <ProjectList searchQuery={searchQuery} />

            <div className="container">
                <AdSpace type="banner" />
            </div>

            <CategoryGrid />
            <ComparisonTable />
            <MaintainerCTA />
        </>
    );
};
