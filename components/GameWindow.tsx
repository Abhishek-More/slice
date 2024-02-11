import React from "react";
import { type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";

const sketch: Sketch = (p5) => {
  p5.setup = () => p5.createCanvas(800, 500);

  p5.draw = () => {
    p5.background(0);
    p5.push();
    p5.rectMode(p5.CENTER);
    p5.fill(255, 0, 0);
    p5.rect(p5.width / 2, p5.height / 2, 50, 50);
    p5.pop();
  };
};

export default function Page() {
  return <NextReactP5Wrapper sketch={sketch} />;
}
