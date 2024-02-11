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
    const [letterToSign, setLetterToSign] = useState("");
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
    const [gameDone, setGameDone] = useState(false);
    const [isWinner, setIsWinner] = useState(false);

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
        await setDoc(doc(firestore, "players", "player1"), {
            //confidences: confidences.push(letterToSign),
            correct: [],
            confidences: [],
            letters:  [],
            score : 0
        })

        await setDoc(doc(firestore, "players", "player2"), {
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
        if (!gameStarted) return;

        

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
                    await setDoc(doc(firestore, "players", "player" + String(playerNumber)), {
                            //confidences: confidences.push(letterToSign),
                            correct: correct,
                            confidences: confidences,
                            letters:  letters,
                            score : score
                        })
                    }
                    
                    }  

                    // OTHER PLAYER
                    const docRef = doc(firestore, "players", "player" + (playerNumber == 1 ? "2" : "1"));
                    const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    let confidences = docSnap.data().confidences;
                    let score = docSnap.data().score;

                    if (playerNumber === 1) {
                        setPlayer2score(score)
                        if (confidences.length > 0)
                            setPlayer2confidence(confidences[confidences.length - 1])
                    }
                    else {
                        setPlayer1score(score)
                        if (confidences.length > 0)
                            setPlayer1confidence(confidences[confidences.length - 1])
                    }
                }
            }, 6500);
        }

        if (timeLeft < 60)
        {
            setGameDone(true);
            if (player1score > player2score) {
                setIsWinner(playerNumber === 1);
            }
            else {
                setIsWinner(playerNumber === 2);
            }
        }

        if (timeLeft === 0) {
            return;
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
        <div className="min-h-screen flex flex-col items-center gap-6 justify-center bg-background_green">
          
          <Cam letterToSign={letterToSign} setStatus={setSuccess} setConfidence={setConfidence}  />
          
          {/* <p className="text-5xl font-inter text-center text-blue-600">coSign</p> */}
          <div className="flex justify-between w-screen px-8 items-center align-center pt-4">
            <img src="back.svg" className="w-12 fill-current text-pale_yellow"></img>
            <div className="flex gap-2">
                <img src="logo.png" className="w-32"></img>
                <img src="1a.png"  className="w-12"/>
            </div>
            <div></div>
          </div>
        <div className="flex gap-4">
            <div className="mx-auto px-12 bg-pale_yellow border-4 border-light_brown rounded-lg shadow-md justify-center align-center text-center">
                <p className="text-3xl font-bold text-center mt-4 invisible">{timeLeft}</p>
                <p id="confidence" className="text-xl text-green-500 invisible">{confidence}</p>
                <p className="text-xl invisible">{confidenceForThisLetter}</p>

            
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

                <p>{JSON.stringify(isWinner)}</p>
          <p>{JSON.stringify(gameDone)}</p>
            
                {/* <div className="text-xl mt-4">{JSON.stringify(calculateAverage(player1confidence, letters))}</div>
                <div className="text-xl">{JSON.stringify(calculateAverage(player2confidence, letters))}</div> */}
            
                <button
                    onClick={async () => {
                    turnOn();
                    }}
                    className="text-lg font-semibold z-50 border-[1px] border-black text-center bg-blue-500 text-white py-2 px-4 rounded-md mt-4 font-sans hover:bg-black hover:text-white"
                >
                    Start
                </button>
            </div>
            <div className="mx-auto p-4 bg-pale_yellow border-4 border-light_brown rounded-lg shadow-md">
                <GameWindow letterToSign={letterToSign} success={success} gameStarted={gameStarted} gameDone={gameDone} isWinner={isWinner} />
            </div>
        </div>
        <a href="https://www.signlanguageforum.com/asl/fingerspelling/alphabet/" className=" font-bold text-pale_yellow flex justify-center items-center gap-2 pb-8"><img src="resources.svg" className="w-6"/><div className="hover:underline ">RESOURCES</div></a>

        </div>
      );
      
      
}
