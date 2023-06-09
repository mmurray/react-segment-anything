import { Tensor } from "onnxruntime-web";

export interface ModelScale {
  samScale: number;
  height: number;
  width: number;
}

export interface Click {
  x: number;
  y: number;
  pointType: number;
}

export interface BoundingBox {
  topLeft: {x: number, y: number};
  bottomRight: {x: number, y: number};
}

export interface ModelData {
  clicks?: Array<Click>;
  bbox?: BoundingBox;
  embedding: Tensor;
  modelScale: ModelScale;
}

export interface SegmentAnythingProps {
  handleMaskSaved: (e: any) => void;
  image: HTMLImageElement;
  embedding: Tensor;
  modelUrl: string;
}

export enum ToolMode {
  Default = "default",
  BoundingBox = "boundingBox",
  PositivePoints = "positivePoints",
  NegativePoints = "negativePoints",
}

export interface ToolProps {
  image: HTMLImageElement;
  maskImage?: HTMLImageElement;
  mode?: ToolMode;
  clicks?: Array<Click>;
  bbox?: BoundingBox;
  handleClicksChange?: (e: any) => void;
  handleBoundingBoxChange?: (e: any) => void;
}
