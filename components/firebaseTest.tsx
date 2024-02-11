import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

interface YourDocument {
  id: string;
  name: string;
}

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default function FirebaseTest() {
  const [data, setData] = useState([] as YourDocument[]);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const snapshot = await getDocs(collection(firestore, 'test'));
    //     const newData = snapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     })) as YourDocument[];
    //     setData(newData);
    //     console.log(newData)
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };

    // fetchData();
    const unsub = onSnapshot(doc(firestore, "test", "yes"), (doc) => {
      console.log("Current data: ", doc.data());
  });
  }, []); 

  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <ul>
        {JSON.stringify(data)}
      </ul>
    </div>
  );
}