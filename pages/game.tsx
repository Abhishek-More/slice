import Image from "next/image";
import { Inter } from "next/font/google";
import GameWindow from "@/components/GameWindow";
import { use, useEffect, useState } from "react";
import random, { RNG } from "random";
import seedrandom from "seedrandom";
import { getFirestore, collection, getDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const inter = Inter({ subsets: ["latin"] });

random.use(seedrandom("coSign") as unknown as RNG);

export default function Game() {
    const [timeLeft, setTimeLeft] = useState(60);
    const [letterToSign, setLetterToSign] = useState("a");
    const [success, setSuccess] = useState(false);

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

    useEffect(() => {        
        if (!timeLeft) return;

        if (timeLeft % 5 === 0) {
            let randomLetter = letterToSign;
            setSuccess(false);
            while (randomLetter === letterToSign) {
                randomLetter = String.fromCharCode(65 + random.int(0, 25))
            }
            setLetterToSign(randomLetter);

            setTimeout( async () => {
                // store the letter data in firebase
                if (success) {
                    const docRef = doc(firestore, "players", "SF");
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        //let confidences = docSnap.data().confidences;
                        let correct = docSnap.data().correct;
                        let incorrect = docSnap.data().letters;
                        let score = docSnap.data().score;
                        let letters = docSnap.data().letters;
                    await setDoc(doc(firestore, "players", "yes"), {
                            //confidences: confidences.push(letterToSign),
                            correct: correct.push(letterToSign),
                            incorrect: incorrect,
                            letters:  letters.push(letterToSign),
                            score : score + 1
                        })
                    }
                }
                else {
                    const docRef = doc(firestore, "players", "SF");
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        //let confidences = docSnap.data().confidences;
                        let correct = docSnap.data().correct;
                        let incorrect = docSnap.data().letters;
                        let score = docSnap.data().score;
                        let letters = docSnap.data().letters;
                    await setDoc(doc(firestore, "players", "yes"), {
                            //confidences: confidences.push(letterToSign),
                            correct: correct.push(letterToSign),
                            incorrect: incorrect,
                            letters:  letters.push(letterToSign),
                            score : score + 1
                        });
                    }
                }
            , 6500});
        
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
