import Image from "next/image";
import { Inter } from "next/font/google";
import GameWindow from "@/components/gameWindow";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <p className="text-5xl font-inter text-center">coSign</p>
      <div className="block mx-auto">
        <GameWindow />
      </div>
    </div>
  );
}
