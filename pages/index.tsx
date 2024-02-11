import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function Home() {
  const controls = useAnimation();
  const bounceControls = useAnimation();

  const bounceVariants = {
    up: { y: [-10, 0], transition: { duration: 0.5, yoyo: Infinity, ease: "easeInOut" } },
  };

  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  const sequence = async () => {
    await controls.start("visible", { delay: 1 });
    await controls.start("visible", { delay: 1 });
    await controls.start("visible", { delay: 1 });

    bounceControls.start("up");
  };

  useEffect(() => {
    sequence();
  }, []);

  return (
    <div className="relative bg-background_green from-green-300 via-yellow-300 to-pink-300 h-screen flex flex-col justify-center items-center gap-12">
      <div className="z-10 border-2 border-pale_yellow rounded-lg h-screen w-screen m-4 flex flex-col justify-center items-center gap-12 relative">
        <img src="logo.gif" alt="logo" className="w-[800px]" loop />
        <a className="text-pale_yellow border-pale_yellow border-2 text-4xl px-4 py-2 rounded-lg font-bold hover:bg-pale_yellow hover:text-background_green hover:cursor-pointer transition-all duration-300 transform hover:translate-y-2">
          START GAME
        </a>
        <div className="flex w-full justify-center items-center gap-12">
            <motion.img
                src="0.png"
                className="w-28"
                initial="hidden"
                animate={controls}
                variants={variants}
          />
          <motion.img
            src="1.png"
            className="w-28"
            initial="hidden"
            animate={controls}
            variants={variants}
          />
          <motion.img
            src="2.png"
            className="w-28"
            initial="hidden"
            animate={controls}
            variants={variants}
          />
          <motion.img
            src="3.png"
            className="w-24 ml-24 animate-slowest animate-bounce "
            initial="hidden"
            animate={controls}
            variants={variants}
          />
        </div>
      </div>
      <img src="spark.png" className="absolute z-0 bottom-24 right-24 animate-pulse" />
      <img src="spark.png" className="absolute z-0 top-24 left-24 animate-pulse" />
      <img src="star.svg" className="absolute z-1 left-32 top-64 animate-pulse" />
      <motion.img
        src="circle.svg"
        className="absolute z-2 top-36 right-64 animate-pulse"
      />
    </div>
  );
}
