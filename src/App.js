// import logo from './logo.svg';

import React, {useRef, useState} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";

import './App.css';
import { any } from '@tensorflow/tfjs';

import {drawHand} from './utilities';



function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async() => {
    const net = await handpose.load()
    console.log('Handpose model loaded.')

    // Loop and detect hands
    setInterval(()=>{
      detect(net)
    }, 100)
  }

  const detect = async (net) =>{
    if(
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ){
      // get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // set video height and width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detection 
      const hand = await net.estimateHands(video);
      console.log(hand);

      //Draw Mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand,ctx);

    }
  };

  runHandpose();

  return (
    <div className="App">
      <header className="App-header">
      <Webcam ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAligfn: "center",
            zindex: 9,
            width: 1024,
            height: 768,
          }} />
      <canvas ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAligfn: "center",
          zindex: 9,
          width: 1024,
          height: 768,
        }} />
      </header>
    </div>
  );
}

export default App;
