import React from "react";
import { P5CanvasInstance, SketchProps, type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";

type MySketchProps = SketchProps & {
    rotation: number;
};
  
function sketch(p5: P5CanvasInstance<MySketchProps>) {

  p5.setup = () => p5.createCanvas(800, 500);

  let rotation = 0;

  p5.updateWithProps = (props: MySketchProps) => {
    if (props.rotation) {
      rotation = (props.rotation * Math.PI) / 180;
    }
  };

  p5.draw = () => {
    p5.background(0);
    p5.push();
    p5.rectMode(p5.CENTER);
    p5.translate(p5.width / 2, p5.height / 2);
    p5.rotate(rotation);
    p5.fill(255, 0, 0);
    p5.rect(0, 0, 50, 50);
    p5.pop();
  };
};

type ComponentProps = {
    rotation: number;
};

export default function Page(props: ComponentProps) {

  return <NextReactP5Wrapper sketch={sketch} rotation={props.rotation} />;
}
