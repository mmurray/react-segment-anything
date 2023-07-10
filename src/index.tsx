// import * as React from 'react'
// import styles from './styles.module.css'

// export * as SegmentAnything from './SegmentAnything';

// import React from 'react'

import {
    Button,
    Stack,
    Card,
    CardContent,
    Box,
    Typography,
    Grid
} from "@mui/material";

import BoundingBoxIcon from '@mui/icons-material/HighlightAlt';
import PointIcon from '@mui/icons-material/AdsClick';
import CheckIcon from '@mui/icons-material/Check';

import { modelData } from './helpers/onnxModelAPI';
import { onnxMaskToImage } from "./helpers/maskUtils";
import { SegmentAnythingProps, ToolMode, Click, BoundingBox } from './helpers/Interfaces';
import Tool from './Tool';

import React, { useState, useEffect } from 'react';
import { InferenceSession } from "onnxruntime-web";
/* @ts-ignore */
import * as _ from "underscore";

export const SegmentAnything = ({image, embedding, modelUrl, handleMaskSaved, initialClicks, initialBBox}: SegmentAnythingProps) => {
    // ONNX model
    const [model, setModel] = React.useState<InferenceSession | null>(null); 

    // Tool mode
    const [mode, setMode] = React.useState<ToolMode>(ToolMode.Default); // Tool mode

    // Model parameters (clicks and bounding box)
    const [clicks, setClicks] = React.useState<Click[]>(initialClicks ? initialClicks : []);
    const [bbox, setBbox] = React.useState<BoundingBox | undefined>(initialBBox);

    // Mask image
    const [maskImage, setMaskImage] = React.useState<HTMLImageElement | undefined>(undefined);

    // Handler for the clear all clicks button
    const clearAllClicks = () => {
        setClicks([]);
        setMode(ToolMode.Default);
    }

    // Handler for the clear all bbox button
    const clearBBox = () => {
        setBbox(undefined);
        setMode(ToolMode.Default);
    }

    // Input images to SAM must be resized so the longest side is 1024
    const LONG_SIDE_LENGTH = 1024;
    let w = image.naturalWidth;
    let h = image.naturalHeight;
    const samScale = LONG_SIDE_LENGTH / Math.max(h, w);
    const modelScale = {width: w, height: h, samScale: samScale}

    // Initialize the ONNX model. load the image, and load the SAM
    // pre-computed image embedding
    useEffect(() => {
        // Initialize the ONNX model
        const initModel = async () => {
        try {
            const model = await InferenceSession.create(modelUrl);
            setModel(model);
        } catch (e) {
            console.log(e);
        }
        };
        initModel();
    }, []);

    // Run the ONNX model and generate a mask image
    const runONNX = async () => {
        try {
            if (model === null || clicks === null) return;
            
            // Preapre the model input in the correct format for SAM. 
            // The modelData function is from onnxModelAPI.tsx.
            const feeds = modelData({
                clicks,
                bbox,
                embedding,
                modelScale,
            });
            if (feeds === undefined) return;
            // Run the SAM ONNX model with the feeds returned from modelData()
            const results = await model.run(feeds);
            const output = results[model.outputNames[0]];
            // The predicted mask returned from the ONNX model is an array which is 
            // rendered as an HTML image using onnxMaskToImage() from maskUtils.tsx.
            setMaskImage(onnxMaskToImage(output.data, output.dims[2], output.dims[3]));
        } catch (e) {
            console.log(e);
        }
    };

    const throttledRunONNX = _.throttle(runONNX, 15);

    // Run the ONNX model every time clicks or bbox have changed
    useEffect(() => {
        runONNX();
    }, [clicks]);

    useEffect(() => {
        throttledRunONNX();
    }, [bbox])

    return (
        <div className="react-sam">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Stack spacing={2} className="react-sam-toolbar">
                            <Card>
                                <CardContent>
                                    <Typography className="react-sam-toolbar-item-title" sx={{ mb: 2 }}>
                                        <BoundingBoxIcon /> Bounding Box
                                    </Typography>
                                    <Stack>
                                        <Typography sx={{ mb: 1 }}>
                                            <Button onClick={() => setMode(ToolMode.BoundingBox)} variant="contained">Select</Button>
                                        </Typography>
                                        <Typography sx={{ mb: 1 }}>
                                            <Button onClick={clearBBox} variant="contained" color="error">Clear All</Button>
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Typography className="react-sam-toolbar-item-title" sx={{ mb: 2 }}>
                                        <PointIcon /> Points
                                    </Typography>
                                    <Stack>
                                        <Typography sx={{ mb: 1 }}>
                                            <Button onClick={() => setMode(ToolMode.PositivePoints)} variant="contained">Add Positive Points</Button>
                                        </Typography>
                                        <Typography sx={{ mb: 1 }}>
                                            <Button onClick={() => setMode(ToolMode.NegativePoints)} variant="contained">Add Negative Points</Button>
                                        </Typography>
                                        <Typography sx={{ mb: 1 }}>
                                            <Button onClick={clearAllClicks} variant="contained" color="error">Clear All</Button>
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Button disabled={!maskImage} onClick={() => handleMaskSaved(maskImage!, image)} sx={{mt: 2}} className='react-sam-toolbar-save' startIcon={<CheckIcon />} size="large" color="success" variant="contained">Save Mask</Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={9}>
                        <Tool
                            image={image}
                            maskImage={maskImage}
                            mode={mode}
                            clicks={clicks}
                            bbox={bbox}
                            handleClicksChange={(newClicks: Click[]) => setClicks(newClicks)}
                            handleBoundingBoxChange={(newBbox: BoundingBox | undefined) => setBbox(newBbox)}
                            />
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

// export const SegmentAnything;
