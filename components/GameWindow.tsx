import React from "react";
import { P5CanvasInstance, SketchProps, type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";

type ComponentProps = {
    letterToSign: string;
    success: boolean;
    gameStarted: boolean;
    gameDone: boolean;
    isWinner: boolean;
};

type MySketchProps = SketchProps & ComponentProps;
  
function sketch(p5: P5CanvasInstance<MySketchProps>) {
    
    let backgroundImage = p5.loadImage("/playfield.png");
    let letterImages = {
        "a": p5.loadImage("/letter/a.png"),
        "b": p5.loadImage("/letter/b.png"),
        "c": p5.loadImage("/letter/c.png"),
        "d": p5.loadImage("/letter/d.png"),
        "h": p5.loadImage("/letter/h.png"),
        "i": p5.loadImage("/letter/i.png"),
        "l": p5.loadImage("/letter/l.png"),
        "o": p5.loadImage("/letter/o.png"),
        "p": p5.loadImage("/letter/p.png"),
        "r": p5.loadImage("/letter/r.png"),
    }
    // let topHalfMask = p5.loadImage("/tophalf.png");
    // let bottomHalfMask = p5.loadImage("/bottomhalf.png");
    
    let letterTopHalfImages = {
        "a": p5.loadImage("/letter-tophalf/a.png"),
        "b": p5.loadImage("/letter-tophalf/b.png"),
        "c": p5.loadImage("/letter-tophalf/c.png"),
        "d": p5.loadImage("/letter-tophalf/d.png"),
        "h": p5.loadImage("/letter-tophalf/h.png"),
        "i": p5.loadImage("/letter-tophalf/i.png"),
        "l": p5.loadImage("/letter-tophalf/l.png"),
        "o": p5.loadImage("/letter-tophalf/o.png"),
        "p": p5.loadImage("/letter-tophalf/p.png"),
        "r": p5.loadImage("/letter-tophalf/r.png"),
    }
    let letterBottomHalfImages = {
        "a": p5.loadImage("/letter-bottomhalf/a.png"),
        "b": p5.loadImage("/letter-bottomhalf/b.png"),
        "c": p5.loadImage("/letter-bottomhalf/c.png"),
        "d": p5.loadImage("/letter-bottomhalf/d.png"),
        "h": p5.loadImage("/letter-bottomhalf/h.png"),
        "i": p5.loadImage("/letter-bottomhalf/i.png"),
        "l": p5.loadImage("/letter-bottomhalf/l.png"),
        "o": p5.loadImage("/letter-bottomhalf/o.png"),
        "p": p5.loadImage("/letter-bottomhalf/p.png"),
        "r": p5.loadImage("/letter-bottomhalf/r.png"),
    }
    let splatterImage = p5.loadImage("/splatter.png");
    let splatterHues = {
        "a": 260,
        "b": 48,
        "c": 0,
        "d": 147,
        "h": 336,
        "i": 214,
        "l": 126,
        "o": 36,
        "p": 173,
        "r": 280,
    }

    let getReadyImage = p5.loadImage("/get_ready.png");
    let goImage = p5.loadImage("/go.png");
    let winImage = p5.loadImage("/you_win.png");
    
    p5.setup = () => {
        p5.createCanvas(1000, 600)
        p5.textSize(92);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textFont("monospace");
        // p5.colorMode(p5.HSB);

    };
      p5.frameRate(60);
    

  let letterToSign = "";
  let letterX = 0;
  let letterY = 0;
  let letterXVelocity = 5;
  let letterYVelocity = 0;
  let letterRotation = 0;
  let letterRotationVelocity = 0;
  let shattered = false;

  let fragmentX = 0;
    let fragmentY = 0;
    let fragmentXVelocity = 0;
    let fragmentYVelocity = 0;
    let fragmentRotation = 0;
    let fragmentRotationVelocity = 0;

    let shatterAnimation = 0;
    let shatterX = 0;
    let shatterY = 0;

    let gameStartedAnimation = 0;

    let gameStarted = false;
    let gameDone = false;
    let isWinner = false;
  p5.updateWithProps = (props: MySketchProps) => {
    if (props.letterToSign && letterToSign !== props.letterToSign) {
        letterToSign = props.letterToSign;
        let newXVelocity = p5.random(-4, 4);
        letterX = (p5.width / 2) - (newXVelocity * p5.width / 8);
        // letterX = p5.width / 2;
        letterY = p5.height;
        letterXVelocity = newXVelocity;
        letterYVelocity = -7;
        letterRotation = 0;
        letterRotationVelocity = p5.random(-0.001, 0.001);
    }
    if (props.gameStarted !== undefined) {
        if (props.gameStarted && !gameStarted) {
            gameStartedAnimation = 200;
        }
        gameStarted = props.gameStarted;
    }
    if (props.gameDone !== undefined) {
        gameDone = props.gameDone;
    }
    if (props.isWinner !== undefined) {
        isWinner = props.isWinner;
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

            shatterAnimation = 200;
            shatterX = letterX;
            shatterY = letterY;
        }
    }
  };

  function drawLetter(letter: string, x: number, y: number, rotation: number, justTopHalf: boolean = false, justBottomHalf: boolean = false) {
    p5.push();
    p5.translate(x, y);
    p5.rotate(rotation);
    let image = letterImages[letter];
    // console.log(image, letter);
    // if (image === undefined) {
        // letter = "a";
        // image = letterImages[letter];
        // TODO temp fix
    // }
    // console.log(image, letter);
    // console.log(letterImages)
    if (image === undefined) {
        p5.text(letterToSign, 0, 0);
        // p5.image(letterImages["a"], 0, 0, 100, 100);
        // p5.image(image, 0, 0, 50, 50);
    }
    else if (justTopHalf) {
        image = letterTopHalfImages[letter];
        p5.image(image, 0, 25, 100, 50);
    }
    else if (justBottomHalf) {
        image = letterBottomHalfImages[letter];
        p5.image(image, 0, 75, 100, 50);

    }
    else {
        p5.image(image, 0, 0, 100, 100);
    }

    p5.pop();
  }



  p5.draw = () => {
    letterX += letterXVelocity;
    letterY += letterYVelocity;
    letterYVelocity += 0.05;
    letterRotation += letterRotationVelocity;
    if (shattered)
    {
        fragmentX += fragmentXVelocity;
        fragmentY += fragmentYVelocity;
        fragmentYVelocity += 0.05;
        fragmentRotation += fragmentRotationVelocity;
    }

    p5.imageMode(p5.CORNER);
    p5.image(backgroundImage, 0, 0, p5.width, p5.height);
    // p5.image(tempImage, 0, 0, 50, 50);
    // p5.image(topHalfMask, 0, 0, 50, 50);
    p5.imageMode(p5.CENTER);
    
    p5.background(0, 255, 0, p5.max(shatterAnimation - 120, 0) );
    if (shattered) {
        // p5.background(255, 0, 0);
    }
    if (shatterAnimation > 0)
    {
        shatterAnimation -= 1;
    }
    // p5.push();
    // p5.rectMode(p5.CENTER);
    // p5.translate(p5.width / 2, p5.height / 2);
    // p5.fill(255, 0, 0);
    // p5.rect(0, 0, 50, 50);
    // p5.fill(255);
    // p5.pop();

    p5.pop();
    p5.tint(splatterHues[letterToSign], 255, 255, shatterAnimation);
    p5.image(splatterImage, shatterX, shatterY, 200, 200);
    p5.tint(255, 255, 255, 255);
    p5.push();


    p5.push();
    p5.translate(p5.width / 2, p5.height / 2);
    
    if (gameStartedAnimation > 0) {
        gameStartedAnimation -= 1;
        p5.tint(255, 255, 255, gameStartedAnimation);
        p5.image(goImage, 0,0, 400, 500);
        p5.tint(255, 255, 255, 255);
    }
    
    if (gameDone) {
        if (isWinner) {
            p5.rotate(p5.sin(p5.frameCount / 15) * 0.05);
            p5.image(winImage, 0,0, 800, 400);
        }
    }

    if (!gameStarted) {
        p5.rotate(p5.sin(p5.frameCount / 15) * 0.05);
        p5.image(getReadyImage, 0,0, 900, 170);
    }

    p5.pop();


    

    if (shattered)
    {
        drawLetter(letterToSign, fragmentX, fragmentY, fragmentRotation, true, false);
        drawLetter(letterToSign, letterX, letterY, letterRotation, false, true);
    }
    else
    {
        drawLetter(letterToSign, letterX, letterY, letterRotation);

    }
  };
};



export default function Page(props: ComponentProps) {

  return <NextReactP5Wrapper sketch={sketch} letterToSign={props.letterToSign} success={props.success} gameStarted={props.gameStarted} gameDone={props.gameDone} isWinner={true} />;
}
