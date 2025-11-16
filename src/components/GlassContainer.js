import React from 'react';
import '../styles/GlassContainer.css';

const GlassContainer = ({ children, className = '', variant = 'default', ...props }) => {
    const variantClass = variant === 'strong' ? 'glass-strong' : 'glass';

    return (
        <div
            className={`glass-container ${variantClass} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassContainer;
