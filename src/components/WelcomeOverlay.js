import React, { useState, useEffect } from 'react';
import './WelcomeOverlay.css';
import { BsGlobe } from 'react-icons/bs';

const WelcomeOverlay = () => {
    const [showOverlay, setShowOverlay] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowOverlay(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{display: showOverlay ? 'flex' : 'none'}} className={`welcome-overlay ${showOverlay ? 'show' : ''}`}>
            <div className="welcome-message">
                <h1>Welcome to App Name</h1>
            </div>
            <div className="circle-animation"></div>
        </div>
    );
};

export default WelcomeOverlay;
