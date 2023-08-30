import React, { useLayoutEffect, useRef, useState } from 'react';
import { ReactNebula } from "@flodlc/nebula";
import './SpaceBackground.css'

const SpaceBackground = () => {
    return (
        <>
            <img className="img" src={require('../../assets/images/cockpit.png')} />
            <ReactNebula config={{
                starsCount: 250,
                starsRotationSpeed: 3,
                sunScale: 0,
                planetsScale: 0,
                cometFrequence: 50
            }}/>
        </>
    )
};

export default SpaceBackground;
