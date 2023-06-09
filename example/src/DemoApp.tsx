import React, { useState, useEffect } from 'react';
import { Tensor } from "onnxruntime-web";

/* @ts-ignore */
import npyjs from "npyjs";

import Container from '@mui/material/Container';
import { SegmentAnything } from 'react-segment-anything';

const ort = require("onnxruntime-web");

const IMAGE_EMBEDDING = "/groceries_embedding.npy";
const IMAGE_PATH = "/groceries.jpg";

const DemoApp = () => {

  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const loadImage = async (imageFile: string) => {
    const img = new Image();
    img.src = imageFile;
    img.onload = () => setImage(img);
  };

  const [tensor, setTensor] = useState<Tensor | null>(null);
  const loadNpyTensor = async (tensorFile: string, dType: string) => {
    let npLoader = new npyjs();
    const npArray = await npLoader.load(tensorFile);
    const tensor = new ort.Tensor(dType, npArray.data, npArray.shape);
    return tensor;
  };

  useEffect(() => {
    Promise.resolve(loadNpyTensor(IMAGE_EMBEDDING, "float32")).then(
      (embedding) => setTensor(embedding)
    );
    Promise.resolve(loadImage(IMAGE_PATH));
  }, []);

  if (!image || !tensor) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{mt: '40px'}}>
      <SegmentAnything 
        handleMaskSaved={() => {}}
        image={image}
        embedding={tensor}
        modelUrl="/sam_onnx_quantized_example.onnx"
        />
    </Container>
  );
}

export default DemoApp;