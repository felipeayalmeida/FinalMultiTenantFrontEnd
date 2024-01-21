// EasterEgg.js
import React, { useEffect, useState } from 'react';

const EasterEgg = ({ setEasterEggOpen }) => {
    const [typedKeys, setTypedKeys] = useState('');

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key) {
                const key = event.key.toLowerCase();
                setTypedKeys((prev) => prev + key);
            }

            // Check for your Easter egg sequence
            if (typedKeys === 'xyz') {
                console.log("typedKeys", typedKeys)
                setEasterEggOpen(true)
                setTypedKeys(''); // Reset the typed keys
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [typedKeys]);

    return null; // EasterEgg component doesn't render anything
};


export default EasterEgg;
