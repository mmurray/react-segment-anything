import { Tensor } from 'onnxruntime-web';
import React from 'react';

interface SegmentAnythingProps {
    handleMaskSaved: (mask: HTMLImageElement, image: HTMLImageElement) => void;
    image: HTMLImageElement;
    embedding: Tensor;
    modelUrl: string;
}

declare const SegmentAnything: ({ image, embedding, modelUrl }: SegmentAnythingProps) => React.JSX.Element;

export { SegmentAnything };
