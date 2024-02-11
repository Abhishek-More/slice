import React from "react";
import { P5CanvasInstance, SketchProps, type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";

type ComponentProps = {
    letterToSign: string;
    success: boolean;
};

type MySketchProps = SketchProps & ComponentProps;
  
function sketch(p5: P5CanvasInstance<MySketchProps>) {

  p5.setup = () => p5.createCanvas(1000, 600);
  p5.frameRate(60);

  let letterToSign = "a";
  let letterX = 0;
  let letterY = 0;
  let letterXVelocity = 5;
  let letterYVelocity = 5;
  let letterRotation = 0;
  let letterRotationVelocity = 0;
  let shattered = false;

  let fragmentX = 0;
    let fragmentY = 0;
    let fragmentXVelocity = 0;
    let fragmentYVelocity = 0;
    let fragmentRotation = 0;
    let fragmentRotationVelocity = 0;

  p5.updateWithProps = (props: MySketchProps) => {
    if (props.letterToSign && letterToSign !== props.letterToSign) {
        letterToSign = props.letterToSign;
        let newXVelocity = p5.random(-5, 5);
        letterX = (p5.width / 2) - (newXVelocity * p5.width / 9);
        // letterX = p5.width / 2;
        letterY = p5.height;
        letterXVelocity = newXVelocity;
        letterYVelocity = -8.8;
        letterRotation = 0;
        letterRotationVelocity = p5.random(-0.001, 0.001);
    }
    if (props.success !== undefined) {
        shattered = props.success;

        if (shattered) {
            fragmentX = letterX;
            fragmentY = letterY;
            fragmentXVelocity = letterXVelocity + p5.random(-3, 3);
            fragmentYVelocity = letterYVelocity + p5.random(-2, 2);
            fragmentRotation = letterRotation;
            fragmentRotationVelocity = letterRotationVelocity + p5.random(-0.01, 0.01);

            letterXVelocity += p5.random(-3, 3);
            letterYVelocity += p5.random(-2, 2);
            letterRotationVelocity += p5.random(-0.01, 0.01);
        }
    }
  };

  p5.draw = () => {
    letterX += letterXVelocity;
    letterY += letterYVelocity;
    letterYVelocity += 0.07;
    letterRotation += letterRotationVelocity;
    if (shattered)
    {
        fragmentX += fragmentXVelocity;
        fragmentY += fragmentYVelocity;
        fragmentYVelocity += 0.07;
        fragmentRotation += fragmentRotationVelocity;
    }

    p5.background(100);
    if (shattered) {
        p5.background(255, 0, 0);
    }
    // p5.push();
    // p5.rectMode(p5.CENTER);
    // p5.translate(p5.width / 2, p5.height / 2);
    // p5.fill(255, 0, 0);
    // p5.rect(0, 0, 50, 50);
    // p5.fill(255);
    // p5.pop();
    
    p5.push();
    p5.textSize(92);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.translate(letterX, letterY);
    p5.rotate(letterRotation);
    p5.text(letterToSign, 0, 0);
    p5.pop();

    if (shattered)
    {
        p5.push();
        p5.textSize(92);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.translate(fragmentX, fragmentY);
        p5.rotate(fragmentRotation);
        p5.text(letterToSign, 0, 0);
        p5.pop();
    }
  };
};



export default function Page(props: ComponentProps) {

  return <NextReactP5Wrapper sketch={sketch} letterToSign={props.letterToSign} success={props.success} />;
}
