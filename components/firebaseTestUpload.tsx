import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { string } from 'prop-types';

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



export default function FirebaseTestUpload() {
    const [val, setVal] = useState<string>();
    const [name, setName] = useState<string>();
    const [player, setPlayer] = useState<string>();
    

    const addData = async () => {
        try {
            await setDoc(doc(firestore, "test", "yes"), {
                name: name,
                value: val,
            });
            console.log('Document successfully written!');
        } catch (error) {
            console.error('Error writing document: ', error);
        }
    };

    const updatePlayer = async () => {
        try {
            await setDoc(doc(firestore, "players", player!), {
                confidences : confidences,
                correct : correct,
                incorrect : incorrect,
                letters : letters,
                score : score,
            })
        }
    }
    
    return (
      <div>
        <h1>Upload!</h1>
        <input type="text" onChange={(e) => setName(e.target.value)}></input>
        <input type="text" onChange={(e) => setVal(e.target.value)}></input>
        <input type="text" onChange={(e) => setPlayer(e.target.value)}></input>
        <button onClick={addData}>Upload Data</button>
      </div>
    );
  }