import React, { useEffect, useState, useRef } from "react";
import { ToolProps, ToolMode } from "./helpers/Interfaces";
/* @ts-ignore */
import * as _ from "underscore";

import { Stage, Layer, Circle, Rect, Image } from 'react-konva';

const Tool = ({
    // handleMouseMove,
    handleClicksChange,
    handleBoundingBoxChange,
    image,
    maskImage,
    bbox,
    clicks = [],
    mode = ToolMode.Default
}: ToolProps) => {

  const containerRef = useRef<HTMLDivElement>(null);
  const [bboxStart, setBboxStart] = useState<{x: number, y: number} | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const bodyEl = document.body;
  const fitToPage = () => {
    if (!image || !containerRef) return;
    // const imageAspectRatio = image.width / image.height;
    // const screenAspectRatio = window.innerWidth / window.innerHeight;
    const containerRatio = containerRef!.current!.offsetWidth / image.width;
    setWidth(containerRef!.current!.offsetWidth);
    setHeight(image.height * containerRatio);
  };
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === bodyEl) {
        fitToPage();
      }
    }
  });
  useEffect(() => {
    fitToPage();
    resizeObserver.observe(bodyEl);
    return () => {
      resizeObserver.unobserve(bodyEl);
    };
  }, [image]);

  const targetSelectEnabled = mode !== ToolMode.Default;

  const onMouseDown = (e: any) => {
    if (mode === ToolMode.Default) return;
    if (!containerRef) return;

    const pos = e.target.getStage().getPointerPosition();
    const containerRatio = containerRef!.current!.offsetWidth / image.width;

    const x = pos.x / containerRatio;
    const y = pos.y / containerRatio;

    if (mode == ToolMode.PositivePoints) {
      if (!handleClicksChange) return;
      handleClicksChange([...clicks, {x, y, pointType: 1}]);
    }

    if (mode == ToolMode.NegativePoints) {
      if (!handleClicksChange) return;
      handleClicksChange([...clicks, {x, y, pointType: 0}]);
    }

    if (mode == ToolMode.BoundingBox) {
      setBboxStart({x, y});
    }
  };

  const onMouseUp = () => {
    if (mode === ToolMode.Default) return;
    if (!containerRef) return;


    if (mode == ToolMode.BoundingBox) {
      if (!handleBoundingBoxChange) return;
      if (!bboxStart) return;
      // handleBoundingBoxChange({x, y});
      setBboxStart(null);
    }
  }

  const onMouseMove = (e: any) => {
    if (mode !== ToolMode.BoundingBox) return;
    if (!containerRef) return;
    if (!handleBoundingBoxChange) return;
    if (!bboxStart) return;

    const pos = e.target.getStage().getPointerPosition();
    const containerRatio = containerRef!.current!.offsetWidth / image.width;

    const x = pos.x / containerRatio;
    const y = pos.y / containerRatio;

    const top = Math.min(bboxStart.y, y);
    const bottom = Math.max(bboxStart.y, y);
    const left = Math.min(bboxStart.x, x);
    const right = Math.max(bboxStart.x, x);
    
    handleBoundingBoxChange({topLeft: {x: left, y: top}, bottomRight: {x: right, y: bottom}});
  };


  const containerRatio = containerRef && containerRef.current ? containerRef!.current!.offsetWidth / image.width : 1;

  // Render the image and the predicted mask image on top
  return (
    <div className="react-sam-tool" ref={containerRef}>
      <Stage width={width} height={height} style={{cursor: targetSelectEnabled ? 'crossHair' : 'default'}}>
        {width > 0 && height > 0 ? (
          <Layer
            onMouseDown={(e) => onMouseDown(e)}
            onTouchStart={(e) => onMouseDown(e)}
            onMouseMove={(e) => onMouseMove(e)}
            onMouseUp={() => onMouseUp()}
            onTouchEnd={() => onMouseUp()}
            >
              <Image image={image} x={0} y={0} width={width} height={height} />
              {maskImage ? <Image image={maskImage} x={0} y={0} width={width} height={height} opacity={0.5} /> : null}
              {bbox ? (
                <Rect
                  x={bbox.topLeft.x * containerRatio}
                  y={bbox.topLeft.y * containerRatio}
                  width={(bbox.bottomRight.x - bbox.topLeft.x) * containerRatio}
                  height={(bbox.bottomRight.y - bbox.topLeft.y) * containerRatio}
                  stroke="green"
                />
              ) : null}
              {clicks.map((click, index) => (
                <Circle key={index} radius={5}
                  fill={click.pointType == 1 ? 'green' : 'red'}
                  stroke='white'
                  strokeWidth={1}
                  opacity={0.75} 
                  x={click.x * containerRatio} 
                  y={click.y * containerRatio} />
              ))}
          </Layer>
        ) : null}
      </Stage>

      {/* {clicks.map((click, index) => <li>{click.x},{click.y},{click.pointType}</li>)} */}

    </div>
  );
};

export default Tool;