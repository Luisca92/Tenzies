import React, { useRef } from "react";

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    };

    const audioRef = useRef(null);

    const handleHoldDice = () => {
        props.holdDice();
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const renderDots = () => {
        const dotPositions = [
            [], // No dots for value 0 (not used)
            [4], // Value 1
            [0, 8], // Value 2
            [0, 4, 8], // Value 3
            [0, 2, 6, 8], // Value 4
            [0, 2, 4, 6, 8], // Value 5
            [0, 2, 3, 5, 6, 8] // Value 6
        ];

        return dotPositions[props.value].map((position) => (
            <div key={position} className={`dot dot${position}`} style={{ gridArea: `dot${position}` }}></div>
        ));
    };

    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={handleHoldDice}
        >
            {renderDots()}
            <audio ref={audioRef} src="/vc_robot_jump01.wav" />
        </div>
    );
}
