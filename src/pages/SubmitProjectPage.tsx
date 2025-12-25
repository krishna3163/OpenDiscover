import React from 'react';
import { SubmitProjectModal } from '../components/SubmitProjectModal';

export const SubmitProjectPage: React.FC = () => {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <SubmitProjectModal />
        </div>
    );
};
