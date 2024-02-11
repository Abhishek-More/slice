import Image from "next/image";
import { Inter } from "next/font/google";
import GameWindow from "@/components/GameWindow";
import { use, useEffect, useState } from "react";
import random, { RNG } from "random";
import seedrandom from "seedrandom";

const inter = Inter({ subsets: ["latin"] });

random.use(seedrandom("coSign") as unknown as RNG);

export default function Game() {
    const [timeLeft, setTimeLeft] = useState(60);
    const [letterToSign, setLetterToSign] = useState("a");
    const [success, setSuccess] = useState(false);

    
    useEffect(() => {        
        if (!timeLeft) return;

        if (timeLeft % 5 === 0) {
            let randomLetter = letterToSign;
            setSuccess(false);
            while (randomLetter === letterToSign) {
                randomLetter = String.fromCharCode(65 + random.int(0, 25))
            }
            setLetterToSign(randomLetter);

            setTimeout(() => {
                // store the letter data in firebase

            }, 4900);
        }

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);


    return (
    <div>
        <p className="text-5xl font-inter text-center">coSign</p>
        <div className="block mx-auto">
            <GameWindow letterToSign={letterToSign} success={success} />
        </div>
        <p className="text-3xl font-bold text-center">{timeLeft}</p>
        <button onClick={() => setSuccess(true)} className="text-3xl font-bold text-center">{success ? "yay!" : "SHATTER"}</button>
        <p>{letterToSign}</p>
    </div>
    );
}
