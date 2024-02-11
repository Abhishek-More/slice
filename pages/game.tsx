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

    async function beginGame()
    {
        await clearDatabase(); setTimeLeft(63); setGameStarted(true);
    }

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

    async function turnOn()
    {
        console.log("Its turning me on")
        await setDoc(doc(firestore, "gameState", "state" ), {
            isOn : true,
        })
    }

    useEffect( () => {
        const funky = async () => {

        const docRef = doc(firestore, "gameState", "state");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            await setDoc(doc(firestore, "gameState", "state"), {
                    isOn : false,
                })
            }
        }
    funky() 
    });

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
                if ( success ) {
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

    useEffect(() => {
        setTimeout(() => {
            setInterval(async () => {
                const docRef = doc(firestore, "gameState", "state");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    //let confidences = docSnap.data().confidences;
                    let isOn = docSnap.data().isOn;
                    if (isOn && !gameStarted)
                    {
                        beginGame();
                    }
                }
            }, 500)
        }, 2000)
        
    }, []);

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
        <div>{JSON.stringify(calculateAverage(player1confidence, letters))}</div>
        <div>{JSON.stringify(calculateAverage(player2confidence, letters))}</div>
        <button onClick={async () => {turnOn();}} className="text-3xl font-bold text-center">Start</button>
    </div>
    );
}
