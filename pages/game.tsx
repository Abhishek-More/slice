import Image from "next/image";
import { Inter } from "next/font/google";
import GameWindow from "@/components/gameWindow";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Game() {
  const [rotation, setRotation] = useState(0);

  return (
    <div>
      <p className="text-5xl font-inter text-center">coSign</p>
      <div className="block mx-auto">
        <GameWindow rotation={rotation} />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setRotation(rotation + 10)}
        ></button>
      </div>
    </div>
  );
}
