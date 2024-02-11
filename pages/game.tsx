import Image from "next/image";
import { Inter } from "next/font/google";
import GameWindow from "@/components/GameWindow";
import { use, useEffect, useState } from "react";
import random, { RNG } from "random";
import seedrandom from "seedrandom";
import Cam from "@/components/Cam";
import { getFirestore, collection, getDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { string } from "prop-types";

const inter = Inter({ subsets: ["latin"] });

random.use(seedrandom("coSign6") as unknown as RNG);

const goodLetters = "abcdhilopr";

export default function Game() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [letterToSign, setLetterToSign] = useState("get ready!");
    const [success, setSuccess] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [playerNumber, setPlayerNumber] = useState(1);
    const [confidence, setConfidence] = useState(0);
    const [confidenceForThisLetter, setConfidenceForThisLetter] = useState(0);
    const [player1score, setPlayer1score] = useState(0);
    const [player2score, setPlayer2score] = useState(0);

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);

    let ender;

    async function clearDatabase()
    {
        await setDoc(doc(firestore, "players", "player" + String(playerNumber)), {
            //confidences: confidences.push(letterToSign),
            correct: [],
            confidences: [],
            letters:  [],
            score : 0
        })
    }

    useEffect(() => {
        setInterval(() => {
            let currLetter = document.getElementById("signLabel");
            let expected = document.getElementById("expected");
            let conf = document.getElementById("confidence")
            // console.log("currentletter: " + currLetter?.innerHTML.toLowerCase())
            // console.log("expected: " + expected?.innerHTML.toLowerCase())
            if(!success && (currLetter?.innerHTML.toLowerCase() === expected?.innerHTML.toLowerCase())) {
                setSuccess(true);
                setConfidenceForThisLetter(Number(conf?.innerHTML));
            }
        }, 1000);
    }, []);
    
    useEffect(() => {        
        if (!timeLeft || !gameStarted) return;

        if (timeLeft % 7 === 0) {
            let randomLetter = letterToSign;
            setSuccess(false);
            while (randomLetter === letterToSign) {
                randomLetter = goodLetters[random.int(0, goodLetters.length - 1)];
            }
            setLetterToSign(randomLetter);

            

            setTimeout(async () => {
                // store the letter data in firebase
                if ( success) {
                    console.log("success")
                    const docRef = doc(firestore, "players", "player" + String(playerNumber));
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        //let confidences = docSnap.data().confidences;
                        let correct = docSnap.data().correct;
                        let confidences = docSnap.data().confidences;
                        let score = docSnap.data().score;
                        let letters = docSnap.data().letters;
                        correct.push(true)
                        confidences.push(confidenceForThisLetter)
                        letters.push(letterToSign)
                        if (playerNumber === 1) {
                            setPlayer1score(score + 1)
                        }
                        else {
                            setPlayer2score(score + 1)
                        }
                    await setDoc(doc(firestore, "players", "player" + String(playerNumber)), {
                            //confidences: confidences.push(letterToSign),
                            correct: correct,
                            confidences: confidences,
                            letters:  letters,
                            score : score + 1,
                            
                        })
                    }
                    console.log("done adding to firebase")
                }
                else {
                    console.log("failure")
                    const docRef = doc(firestore, "players", "player" + String(playerNumber));
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        //let confidences = docSnap.data().confidences;
                        let correct = docSnap.data().correct;
                        let confidences = docSnap.data().confidences;
                        let score = docSnap.data().score;
                        let letters = docSnap.data().letters;
                        console.log(correct)
                        console.log(confidences)
                        console.log(score)
                        console.log(letters)
                        correct.push(false)
                        confidences.push(confidenceForThisLetter)
                        letters.push(letterToSign)
                        if (playerNumber === 1) {
                            setPlayer1score(score)
                        }
                        else {
                            setPlayer2score(score)
                        }
                    await setDoc(doc(firestore, "players", "player" + String(playerNumber)), {
                            //confidences: confidences.push(letterToSign),
                            correct: correct,
                            confidences: confidences,
                            letters:  letters,
                            score : score
                        })
                    }
                    console.log("done adding to firebase")}  
            }, 6500);
        }

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);


    return (
    <div>
        <Cam letterToSign={letterToSign} setStatus={setSuccess} setConfidence={setConfidence} />
        <p className="text-5xl font-inter text-center">coSign</p>
        <div className="block mx-auto">
            <GameWindow letterToSign={letterToSign} success={success} />
        </div>
        <p className="text-3xl font-bold text-center">{timeLeft}</p>
        <p id="confidence">{confidence}</p>
        <p>{confidenceForThisLetter}</p>
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
        <div>Player 1 Score : {player1score}</div>
        <div>Player 2 Score : {player2score}</div>
        <button onClick={async () => {await clearDatabase(); setTimeLeft(63); setGameStarted(true); }} className="text-3xl font-bold text-center">Start</button>
    </div>
    );
}
