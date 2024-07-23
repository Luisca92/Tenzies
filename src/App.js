import React, { useRef, useEffect, useState } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { createPortal } from "react-dom";

export default function App() {
    const [dice, setDice] = useState(allNewDice());
    const [tenzies, setTenzies] = useState(false);
    const [rollCount, setRollCount] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [record, setRecord] = useState(() => JSON.parse(localStorage.getItem("record")) || Infinity);
    const [timeRecord, setTimeRecord] = useState(() => JSON.parse(localStorage.getItem("timeRecord")) || Infinity);
    const audioRef = useRef(null);

    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld);
        const firstValue = dice[0].value;
        const allSameValue = dice.every(die => die.value === firstValue);
        if (allHeld && allSameValue) {
            setTenzies(true);
            setIsTimerRunning(false);
            if (audioRef.current) {
                audioRef.current.play();
            }
            if (rollCount < record) {
                setRecord(rollCount);
                localStorage.setItem("record", JSON.stringify(rollCount));
            }
            if (timer < timeRecord) {
                setTimeRecord(timer);
                localStorage.setItem("timeRecord", JSON.stringify(timer));
            }
        }
    }, [dice]);

    useEffect(() => {
        let timerInterval;
        if (isTimerRunning) {
            timerInterval = setInterval(() => {
                setTimer(prevTime => prevTime + 10);
            }, 10);
        } else if (!isTimerRunning) {
            clearInterval(timerInterval);
        }
        return () => clearInterval(timerInterval);
    }, [isTimerRunning]);

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        };
    }
    
    function allNewDice() {
        const newDice = [];
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie());
        }
        return newDice;
    }
    
    function rollDice() {
        if (!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie();
            }));
            setRollCount(prevCount => prevCount + 1);
            if (rollCount === 0) {
                setIsTimerRunning(true);
            }
        } else {
            setTenzies(false);
            setDice(allNewDice());
            setRollCount(0);
            setTimer(0);
            setIsTimerRunning(false);
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die;
        }));
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ));

    // Format the timer to display in milliseconds
    const formattedTime = (timer / 1000).toFixed(2);
    const formattedTimeRecord = (timeRecord / 1000).toFixed(2);

    return (
        <main className="main-container">
            {tenzies && createPortal(<Confetti width={window.innerWidth} height={window.innerHeight} />, document.body)}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className="status-container">
                <p className="roll-count">Roll Count: {rollCount}</p>
                <p className="timer">Time: {formattedTime}</p>
            </div>
            <p className="record">Record: {record === Infinity ? "N/A" : record} Rolls</p>
            <p className="time-record">Best Time: {timeRecord === Infinity ? "N/A" : formattedTimeRecord} s</p>
            <audio ref={audioRef} src="fanfare.mp3" />
        </main>
    );
}
