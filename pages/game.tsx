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
    const [letters, setLetters] = useState([]);
    const [player1confidence, setPlayer1confidence] = useState([]);
    const [player2confidence, setPlayer2confidence] = useState([]);

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

    function calculateAverage(numbers: number[], letters: string[]): Map<string, number> {
        const letterNumberMap: Map<string, { sum: number, count: number }> = new Map();
      
        for (let i = 0; i < letters.length; i++) {
          const letter = letters[i];
          const number = numbers[i];
      
          if (!letterNumberMap.has(letter)) {
            letterNumberMap.set(letter, { sum: number, count: 1 });
          } else {
            const currentValues = letterNumberMap.get(letter) || { sum: 0, count: 0 };
            letterNumberMap.set(letter, {
              sum: currentValues.sum + number,
              count: currentValues.count + 1
            });
          }
        }
      
        const averageMap = {};
        letterNumberMap.forEach((value, key) => {
          const average = value.sum / value.count;
          averageMap[key] = average;
        });
      
        return averageMap;
      }
      
      
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
                        setLetters(letters)
                        if (playerNumber === 1) {
                            setPlayer1score(score + 1)
                            setPlayer1confidence(confidences)
                        }
                        else {
                            setPlayer2score(score + 1)
                            setPlayer2confidence(confidences)
                        }
                    await setDoc(doc(firestore, "players", "player" + String(playerNumber)), {
                            //confidences: confidences.push(letterToSign),
                            correct: correct,
                            confidences: confidences,
                            letters:  letters,
                            score : score + 1,
                            
                        })
                    }
                }
                else {
                    const docRef = doc(firestore, "players", "player" + String(playerNumber));
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        //let confidences = docSnap.data().confidences;
                        let correct = docSnap.data().correct;
                        let confidences = docSnap.data().confidences;
                        let score = docSnap.data().score;
                        let letters = docSnap.data().letters;
                        setLetters(letters)
                        correct.push(false)
                        confidences.push(confidenceForThisLetter)
                        letters.push(letterToSign)
                        if (playerNumber === 1) {
                            setPlayer1score(score)
                            setPlayer1confidence(confidences)
                        }
                        else {
                            setPlayer2score(score)
                            setPlayer2confidence(confidences)
                        }
                    await setDoc(doc(firestore, "players", "player" + String(playerNumber)), {
                            //confidences: confidences.push(letterToSign),
                            correct: correct,
                            confidences: confidences,
                            letters:  letters,
                            score : score
                        })
                    }
                    }  
            }, 6500);
        }

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);


    return (
        <div className="min-h-screen flex flex-col items-center gap-6 justify-center bg-background_green">
          <Cam letterToSign={letterToSign} setStatus={setSuccess} setConfidence={setConfidence}  />
      
          {/* <p className="text-5xl font-inter text-center text-blue-600">coSign</p> */}
          <div className="flex justify-between w-screen px-8 items-center align-center">
            <img src="back.svg" className="w-12 fill-current text-pale_yellow"></img>
            <img src="logo.png" className="w-32 "></img>
            <div></div>
          </div>
        <div className="flex gap-4">
            <div className="mx-auto px-12 bg-pale_yellow border-4 border-light_brown rounded-lg shadow-md justify-center align-center text-center">
                <p className="text-3xl font-bold text-center mt-4">{timeLeft}</p>
                <p id="confidence" className="text-xl text-green-500">{confidence}</p>
                <p className="text-xl">{confidenceForThisLetter}</p>
            
                <button
                    onClick={() => setSuccess(true)}
                    className={`text-3xl font-bold text-center mt-4 ${success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                >
                    {success ? "yay!" : "SHATTER"}
                </button>
            
                <p id="expected" className="text-xl mt-4">{letterToSign}</p>
                <p className="text-xl">You are player {playerNumber}</p>
            
                <div className="flex space-x-4 mt-4">
                    <label className="text-2xl">
                    <input
                        type="radio"
                        name="player"
                        value="1"
                        id="player1select"
                        onClick={() => setPlayerNumber(1)}
                    />
                    PLAYER 1
                    </label>
            
                    <label className="text-2xl">
                    <input
                        type="radio"
                        name="player"
                        value="2"
                        id="player2select"
                        onClick={() => setPlayerNumber(2)}
                    />
                    PLAYER 2
                    </label>
                </div>
            
                <div className="text-xl mt-4">PLAYER 1 SCORE: {player1score}</div>
                <div className="text-xl">PLAYER 2 SCORE: {player2score}</div>
            
                <div className="text-xl mt-4">{JSON.stringify(calculateAverage(player1confidence, letters))}</div>
                <div className="text-xl">{JSON.stringify(calculateAverage(player2confidence, letters))}</div>
            
                <button
                    onClick={async () => {
                    await clearDatabase();
                    setTimeLeft(63);
                    setGameStarted(true);
                    }}
                    className="text-3xl font-bold text-center bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
                >
                    Start
                </button>
            </div>
            <div className="mx-auto p-4 bg-pale_yellow border-4 border-light_brown rounded-lg shadow-md">
                <GameWindow letterToSign={letterToSign} success={success} />
            </div>
        </div>
        </div>
      );
      
      
}
