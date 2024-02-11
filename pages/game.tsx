import Image from "next/image";
import { Inter } from "next/font/google";
import GameWindow from "@/components/GameWindow";
import { use, useEffect, useState } from "react";
import random, { RNG } from "random";
import seedrandom from "seedrandom";
import Cam from "@/components/Cam";

const inter = Inter({ subsets: ["latin"] });

random.use(seedrandom("coSign6") as unknown as RNG);

const goodLetters = "abcdhilopr";

export default function Game() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [letterToSign, setLetterToSign] = useState("get ready!");
    const [success, setSuccess] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [playerNumber, setPlayerNumber] = useState(1);

    let ender;
    
    useEffect(() => {        
        if (!timeLeft || !gameStarted) return;

        if (timeLeft % 7 === 0) {
            let randomLetter = letterToSign;
            setSuccess(false);
            while (randomLetter === letterToSign) {
                randomLetter = goodLetters[random.int(0, goodLetters.length - 1)];
            }
            setLetterToSign(randomLetter);

            setTimeout(() => {
                let currLetter = document.getElementById("signLabel");
                let expected = document.getElementById("expected");
                if(currLetter?.innerHTML.toLowerCase() === expected?.innerHTML.toLowerCase()) {
                    setSuccess(true);
                }
            }, 6500);

            setTimeout(() => {
                // store the letter data in firebase

            }, 6000);
        }

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);


    return (
    <div>
        <Cam letterToSign={letterToSign} setStatus={setSuccess} />
        <p className="text-5xl font-inter text-center">coSign</p>
        <div className="block mx-auto">
            <GameWindow letterToSign={letterToSign} success={success} />
        </div>
        <p className="text-3xl font-bold text-center">{timeLeft}</p>
        <button onClick={() => setSuccess(true)} className="text-3xl font-bold text-center">{success ? "yay!" : "SHATTER"}</button>
        <p id="expected">{letterToSign}</p>
        <p>You are player {playerNumber}</p>
        <ul>
            <li>
                <input type="radio" name="player" value="1" id="player1select" onClick={() => setPlayerNumber(1)} />
                <label className="text-2xl" htmlFor="player1select">Player 1</label>
            </li>
            <li>
                <input type="radio" name="player" value="2" id="player2select" onClick={() => setPlayerNumber(2)} />
                <label className="text-2xl" htmlFor="player2select">Player 2</label>
            </li>

        </ul>
        <button onClick={() => {setTimeLeft(63); setGameStarted(true)}} className="text-3xl font-bold text-center">Start</button>
    </div>
    );
}
