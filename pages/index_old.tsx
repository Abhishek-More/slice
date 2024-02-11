import { Box, Button, Container, Heading, Img, Stack, VStack } from "@chakra-ui/react"
import React, { useRef, useState, useEffect } from "react"
import { Image } from "next/image"
import Webcam from "react-webcam"

export default function Home() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const [camState, setCamState] = useState("on")

  const [sign, setSign] = useState(null)

  let signList = []
  let currentSign = 0

  let gamestate = "started"

  // let net;

  async function runHandpose() {
    const net = await handpose.load()
    _signList()

    // window.requestAnimationFrame(loop);

    setInterval(() => {
      detect(net)
    }, 150)
  }

  function _signList() {
    signList = generateSigns()
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  function generateSigns() {
    const password = shuffle(Signpass)
    return password
  }

  async function detect(net) {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      // Set video width
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // Set canvas height and width
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      // Make Detections
      const hand = await net.estimateHands(video)

      if (hand.length > 0) {
        //loading the fingerpose model
        const GE = new fp.GestureEstimator([
          fp.Gestures.ThumbsUpGesture,
          Handsigns.aSign,
          Handsigns.bSign,
          Handsigns.cSign,
          Handsigns.dSign,
          Handsigns.eSign,
          Handsigns.fSign,
          Handsigns.gSign,
          Handsigns.hSign,
          Handsigns.iSign,
          Handsigns.jSign,
          Handsigns.kSign,
          Handsigns.lSign,
          Handsigns.mSign,
          Handsigns.nSign,
          Handsigns.oSign,
          Handsigns.pSign,
          Handsigns.qSign,
          Handsigns.rSign,
          Handsigns.sSign,
          Handsigns.tSign,
          Handsigns.uSign,
          Handsigns.vSign,
          Handsigns.wSign,
          Handsigns.xSign,
          Handsigns.ySign,
          Handsigns.zSign,
        ])

        const estimatedGestures = await GE.estimate(hand[0].landmarks, 0)
        // document.querySelector('.pose-data').innerHTML =JSON.stringify(estimatedGestures.poseData, null, 2);

        if (
          estimatedGestures.gestures !== undefined &&
          estimatedGestures.gestures.length > 0
        ) {
          const confidence = estimatedGestures.gestures.map(p => p.confidence)
          console.log(confidence)
          const maxConfidence = confidence.indexOf(
            Math.max.apply(undefined, confidence)
          )

          const model_overall_confidence = estimatedGestures.gestures[maxConfidence].confidence / 9

          //setting up game state, looking for thumb emoji
          gamestate = "played"
          if (gamestate === "played") {
            document.querySelector("#app-title").innerText = ""

            if (
              typeof signList[currentSign].src.src === "string" ||
              signList[currentSign].src.src instanceof String
            ) {
              if (
                signList[currentSign].alt ===
                estimatedGestures.gestures[maxConfidence].name
              ) {
                currentSign++
              }
              setSign(estimatedGestures.gestures[maxConfidence].name)
            }
          } else if (gamestate === "finished") {
            return
          }
        }
      }
      // Draw hand lines
      const ctx = canvasRef.current.getContext("2d")
      drawHand(hand, ctx)
    }
  }

  //   if (sign) {
  //     console.log(sign, Signimage[sign])
  //   }

  useEffect(() => {
    runHandpose()
  }, [])

  function turnOffCamera() {
    if (camState === "on") {
      setCamState("off")
    } else {
      setCamState("on")
    }
  }

  return (
      <Box>
        <Container centerContent maxW="xl" height="20vh" pt="0" pb="0">
          <VStack spacing={4} align="center">
          </VStack>

          <Heading
            as="h1"
            size="lg"
            id="app-title"
            color="black"
            textAlign="center"
          >
            Loading
          </Heading>

          <Box id="webcam-container">
            {camState === "on" ? (
              <Webcam id="webcam" ref={webcamRef} />
            ) : (
              <div id="webcam"></div>
            )}

            {sign ? (
              <div
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  right: "calc(50% - 50px)",
                  bottom: 100,
                  textAlign: "-webkit-center",
                }}
              >
                <Text color="black" fontSize="sm" mb={1}>
                  detected gestures
                </Text>
                <p>{sign}</p>
              </div>
            ) : (
              " "
            )}
          </Box>

          <canvas id="gesture-canvas" ref={canvasRef} style={{}} />

          <Box
            id="singmoji"
            style={{
              zIndex: 9,
              position: "fixed",
              top: "50px",
              right: "30px",
            }}
          ></Box>

          <Image h="150px" objectFit="cover" id="emojimage" />
          {/* <pre className="pose-data" color="white" style={{position: 'fixed', top: '150px', left: '10px'}} >Pose data</pre> */}
        </Container>

        <Stack id="start-button" spacing={4} direction="row" align="center">
          <Button
            leftIcon={
              camState === "on" ? (
                <RiCameraFill size={20} />
              ) : (
                <RiCameraOffFill size={20} />
              )
            }
            onClick={turnOffCamera}
            colorScheme="orange"
          >
            Camera
          </Button>
        </Stack>
      </Box>
  )
}
