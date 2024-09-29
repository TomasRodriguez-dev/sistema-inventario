import React from 'react';
import { useSelector } from 'react-redux';
import { ProgressBar } from 'primereact/progressbar';

const GlobalProgressBar = () => {
    const isLoading = useSelector(state => state.loading.isLoading);

    if (!isLoading) return null;

    return (
        <div className="global-progress-bar">
            <ProgressBar mode="indeterminate" style={{ height: '4px' }} />
        </div>
    );
};

export default GlobalProgressBar;
