import { Img } from "@chakra-ui/react"
import React, { useRef, useState, useEffect } from "react"

export default function Home() {
    return (
    <div className="bg-background_green h-screen">
      <div className="flex flex-col items-center h-full">
        <div className="h-1/3 bg-background_green">
          <img src="landing.jpg" alt="Landing Page Image" className="w-full h-auto mx-auto rounded-lg shadow-lg bg-background_green"></img>
        </div>
        <div className="h-1/3"></div>
        <div className="h-1/3"></div>
      </div>
    </div>
  )
}
