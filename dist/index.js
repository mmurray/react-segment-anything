// import * as React from 'react'
// import styles from './styles.module.css'
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// export * as SegmentAnything from './SegmentAnything';
// import React from 'react'
import { Button, Stack, Card, CardContent, Box, Typography, Grid } from "@mui/material";
import BoundingBoxIcon from '@mui/icons-material/HighlightAlt';
import PointIcon from '@mui/icons-material/AdsClick';
import CheckIcon from '@mui/icons-material/Check';
import { modelData } from './helpers/onnxModelAPI';
import { onnxMaskToImage } from "./helpers/maskUtils";
import { ToolMode } from './helpers/Interfaces';
import Tool from './Tool';
import React, { useEffect } from 'react';
import { InferenceSession } from "onnxruntime-web";
/* @ts-ignore */
import * as _ from "underscore";
export var SegmentAnything = function (_a) {
    var image = _a.image, embedding = _a.embedding, modelUrl = _a.modelUrl;
    // ONNX model
    var _b = React.useState(null), model = _b[0], setModel = _b[1];
    // Tool mode
    var _c = React.useState(ToolMode.Default), mode = _c[0], setMode = _c[1]; // Tool mode
    // Model parameters (clicks and bounding box)
    var _d = React.useState([]), clicks = _d[0], setClicks = _d[1];
    var _e = React.useState(undefined), bbox = _e[0], setBbox = _e[1];
    // Mask image
    var _f = React.useState(undefined), maskImage = _f[0], setMaskImage = _f[1];
    // Handler for the clear all clicks button
    var clearAllClicks = function () {
        setClicks([]);
        setMode(ToolMode.Default);
    };
    // Handler for the clear all bbox button
    var clearBBox = function () {
        setBbox(undefined);
        setMode(ToolMode.Default);
    };
    // Input images to SAM must be resized so the longest side is 1024
    var LONG_SIDE_LENGTH = 1024;
    var w = image.naturalWidth;
    var h = image.naturalHeight;
    var samScale = LONG_SIDE_LENGTH / Math.max(h, w);
    var modelScale = { width: w, height: h, samScale: samScale };
    // Initialize the ONNX model. load the image, and load the SAM
    // pre-computed image embedding
    useEffect(function () {
        // Initialize the ONNX model
        var initModel = function () { return __awaiter(void 0, void 0, void 0, function () {
            var model_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, InferenceSession.create(modelUrl)];
                    case 1:
                        model_1 = _a.sent();
                        setModel(model_1);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        initModel();
    }, []);
    // Run the ONNX model and generate a mask image
    var runONNX = function () { return __awaiter(void 0, void 0, void 0, function () {
        var feeds, results, output, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (model === null || clicks === null)
                        return [2 /*return*/];
                    feeds = modelData({
                        clicks: clicks,
                        bbox: bbox,
                        embedding: embedding,
                        modelScale: modelScale,
                    });
                    if (feeds === undefined)
                        return [2 /*return*/];
                    return [4 /*yield*/, model.run(feeds)];
                case 1:
                    results = _a.sent();
                    output = results[model.outputNames[0]];
                    // The predicted mask returned from the ONNX model is an array which is 
                    // rendered as an HTML image using onnxMaskToImage() from maskUtils.tsx.
                    setMaskImage(onnxMaskToImage(output.data, output.dims[2], output.dims[3]));
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    console.log(e_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var throttledRunONNX = _.throttle(runONNX, 15);
    // Run the ONNX model every time clicks or bbox have changed
    useEffect(function () {
        runONNX();
    }, [clicks]);
    useEffect(function () {
        throttledRunONNX();
    }, [bbox]);
    return (React.createElement("div", { className: "react-sam" },
        React.createElement(Box, { sx: { flexGrow: 1 } },
            React.createElement(Grid, { container: true, spacing: 2 },
                React.createElement(Grid, { item: true, xs: 3 },
                    React.createElement(Stack, { spacing: 2, className: "react-sam-toolbar" },
                        React.createElement(Card, null,
                            React.createElement(CardContent, null,
                                React.createElement(Typography, { className: "react-sam-toolbar-item-title", sx: { mb: 2 } },
                                    React.createElement(BoundingBoxIcon, null),
                                    " Bounding Box"),
                                React.createElement(Stack, null,
                                    React.createElement(Typography, { sx: { mb: 1 } },
                                        React.createElement(Button, { onClick: function () { return setMode(ToolMode.BoundingBox); }, variant: "contained" }, "Select")),
                                    React.createElement(Typography, { sx: { mb: 1 } },
                                        React.createElement(Button, { onClick: clearBBox, variant: "contained", color: "error" }, "Clear All"))))),
                        React.createElement(Card, null,
                            React.createElement(CardContent, null,
                                React.createElement(Typography, { className: "react-sam-toolbar-item-title", sx: { mb: 2 } },
                                    React.createElement(PointIcon, null),
                                    " Points"),
                                React.createElement(Stack, null,
                                    React.createElement(Typography, { sx: { mb: 1 } },
                                        React.createElement(Button, { onClick: function () { return setMode(ToolMode.PositivePoints); }, variant: "contained" }, "Add Positive Points")),
                                    React.createElement(Typography, { sx: { mb: 1 } },
                                        React.createElement(Button, { onClick: function () { return setMode(ToolMode.NegativePoints); }, variant: "contained" }, "Add Negative Points")),
                                    React.createElement(Typography, { sx: { mb: 1 } },
                                        React.createElement(Button, { onClick: clearAllClicks, variant: "contained", color: "error" }, "Clear All"))))),
                        React.createElement(Button, { sx: { mt: 2 }, className: 'react-sam-toolbar-save', startIcon: React.createElement(CheckIcon, null), size: "large", color: "success", variant: "contained" }, "Save Mask"))),
                React.createElement(Grid, { item: true, xs: 9 },
                    React.createElement(Tool, { image: image, maskImage: maskImage, mode: mode, clicks: clicks, bbox: bbox, handleClicksChange: function (newClicks) { return setClicks(newClicks); }, handleBoundingBoxChange: function (newBbox) { return setBbox(newBbox); } }))))));
};
// export const SegmentAnything;
//# sourceMappingURL=index.js.map