# React Segment Anything

React component for interfacing with Meta's Segment Anything Model (SAM)

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](hhttps://github.com/mmurray/react-segment-anything/blob/HEAD/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/react-segment-anything/latest.svg)](https://www.npmjs.com/package/react-segment-anything)

![Demonstration of react-segment-anything component](assets/react_sam_demo.gif?raw=true)


## Getting Started

### Installation

1. Ensure that you have React 17 or later installed (MUI V5 requires React 17 or 18)

2. Install Peer Dependencies (Material UI V5)

```bash
npm install @mui/material @mui/icons-material
```

3. Install react-segment-anything

```bash
npm install react-segment-anything
```

### Usage

> See usage example [here](./example)

```jsx
import React, { useState, useEffect } from 'react';
import { Tensor } from "onnxruntime-web";

/* @ts-ignore */
import npyjs from "npyjs";

import Container from '@mui/material/Container';
import { SegmentAnything } from 'react-segment-anything';

const ort = require("onnxruntime-web");

const IMAGE_EMBEDDING = "/groceries_embedding.npy";
const IMAGE_PATH = "/groceries.jpg";
const MODEL_URL = "/sam_onnx_quantized_example.onnx";

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
        modelUrl=MODEL_URL
        />
    </Container>
  );
}

```
