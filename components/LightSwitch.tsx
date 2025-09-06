/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface LightSwitchProps {
    label: string;
    onClick: () => void;
    disabled: boolean;
}

const LightSwitch: React.FC<LightSwitchProps> = ({ label, onClick, disabled }) => {
    // The switch represents the state of the lights. It starts "on" (I).
    // The user's action is to "Turn Off All Lights", so they click the switch.
    // The switch animates from "on" (checked) to "off" (unchecked) and calls the onClick handler.
    // This is a one-way action to create the base dark scene.
    const [isChecked, setIsChecked] = useState(true);

    const handleClick = () => {
        // Only allow the action if it's not disabled and is currently 'on'.
        if (!disabled && isChecked) {
            setIsChecked(false); // Visually turn the switch off
            onClick(); // Trigger the scene generation
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 text-center">
            <label className="switch">
                <div className="round">
                    <input
                        name="onoff"
                        id="onoff"
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleClick}
                        disabled={disabled}
                        aria-label={label}
                    />
                    <div className="back">
                        <label htmlFor="onoff" className="but">
                            <span className="on">0</span>
                            <span className="off">I</span>
                        </label>
                    </div>
                </div>
            </label>
            <span className={`font-semibold transition-colors duration-300 ${disabled ? 'text-gray-500' : 'text-gray-300'}`}>
                {label}
            </span>
        </div>
    );
};

export default LightSwitch;