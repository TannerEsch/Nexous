import React, { useEffect, useRef, useState } from 'react';
import { visualData } from '../data/visualData';

const GaborPatch: React.FC = () => {
  const gaborParams = useRef(visualData.gabor[Math.floor(Math.random() * visualData.gabor.length)]);
  const { frequency, orientation, initialPhase, size, speed } = gaborParams.current;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(initialPhase);

  const drawGaborPatch = (ctx: CanvasRenderingContext2D, phase: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const sigma = size / 2;
    const theta = (orientation * Math.PI) / 180;
    const f = frequency / width;
    const phi = (phase * Math.PI) / 180;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const xPrime = x * Math.cos(theta) + y * Math.sin(theta);
        const yPrime = -x * Math.sin(theta) + y * Math.cos(theta);

        const envelope = Math.exp(-0.5 * (xPrime ** 2 + yPrime ** 2) / sigma ** 2);
        const carrier = Math.cos(2 * Math.PI * f * xPrime + phi);
        const value = envelope * carrier * 127 + 128;

        const index = (y * width + x) * 4;
        data[index] = data[index + 1] = data[index + 2] = value;
        data[index + 3] = 255; // Alpha channel
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawGaborPatch(ctx, phase);
      }
    }
  }, [phase]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setPhase((prev) => prev + speed);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [speed]);

  return <canvas ref={canvasRef} width={size} height={size} className="mx-auto my-4" />;
};

export default GaborPatch;
