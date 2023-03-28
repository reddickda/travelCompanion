import React, { useState, useEffect } from 'react';
import { BsGlobeAmericas } from 'react-icons/bs';

import './WelcomeOverlay.css';

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
                <h1>My Friend Map</h1>
            </div>
            <div className="growing-react-icon"> <BsGlobeAmericas /></div>
        </div>
    );
};

export default WelcomeOverlay;
