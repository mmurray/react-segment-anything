var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useEffect, useState, useRef } from "react";
import { ToolMode } from "./helpers/Interfaces";
import { Stage, Layer, Circle, Rect, Image } from 'react-konva';
var Tool = function (_a) {
    var 
    // handleMouseMove,
    handleClicksChange = _a.handleClicksChange, handleBoundingBoxChange = _a.handleBoundingBoxChange, image = _a.image, maskImage = _a.maskImage, bbox = _a.bbox, _b = _a.clicks, clicks = _b === void 0 ? [] : _b, _c = _a.mode, mode = _c === void 0 ? ToolMode.Default : _c;
    var containerRef = useRef(null);
    var _d = useState(null), bboxStart = _d[0], setBboxStart = _d[1];
    var _e = useState(0), width = _e[0], setWidth = _e[1];
    var _f = useState(0), height = _f[0], setHeight = _f[1];
    var bodyEl = document.body;
    var fitToPage = function () {
        if (!image || !containerRef)
            return;
        // const imageAspectRatio = image.width / image.height;
        // const screenAspectRatio = window.innerWidth / window.innerHeight;
        var containerRatio = containerRef.current.offsetWidth / image.width;
        setWidth(containerRef.current.offsetWidth);
        setHeight(image.height * containerRatio);
    };
    var resizeObserver = new ResizeObserver(function (entries) {
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            if (entry.target === bodyEl) {
                fitToPage();
            }
        }
    });
    useEffect(function () {
        fitToPage();
        resizeObserver.observe(bodyEl);
        return function () {
            resizeObserver.unobserve(bodyEl);
        };
    }, [image]);
    var targetSelectEnabled = mode !== ToolMode.Default;
    var onMouseDown = function (e) {
        if (mode === ToolMode.Default)
            return;
        if (!containerRef)
            return;
        var pos = e.target.getStage().getPointerPosition();
        var containerRatio = containerRef.current.offsetWidth / image.width;
        var x = pos.x / containerRatio;
        var y = pos.y / containerRatio;
        if (mode == ToolMode.PositivePoints) {
            if (!handleClicksChange)
                return;
            handleClicksChange(__spreadArray(__spreadArray([], clicks, true), [{ x: x, y: y, pointType: 1 }], false));
        }
        if (mode == ToolMode.NegativePoints) {
            if (!handleClicksChange)
                return;
            handleClicksChange(__spreadArray(__spreadArray([], clicks, true), [{ x: x, y: y, pointType: 0 }], false));
        }
        if (mode == ToolMode.BoundingBox) {
            setBboxStart({ x: x, y: y });
        }
    };
    var onMouseUp = function () {
        if (mode === ToolMode.Default)
            return;
        if (!containerRef)
            return;
        if (mode == ToolMode.BoundingBox) {
            if (!handleBoundingBoxChange)
                return;
            if (!bboxStart)
                return;
            // handleBoundingBoxChange({x, y});
            setBboxStart(null);
        }
    };
    var onMouseMove = function (e) {
        if (mode !== ToolMode.BoundingBox)
            return;
        if (!containerRef)
            return;
        if (!handleBoundingBoxChange)
            return;
        if (!bboxStart)
            return;
        var pos = e.target.getStage().getPointerPosition();
        var containerRatio = containerRef.current.offsetWidth / image.width;
        var x = pos.x / containerRatio;
        var y = pos.y / containerRatio;
        var top = Math.min(bboxStart.y, y);
        var bottom = Math.max(bboxStart.y, y);
        var left = Math.min(bboxStart.x, x);
        var right = Math.max(bboxStart.x, x);
        handleBoundingBoxChange({ topLeft: { x: left, y: top }, bottomRight: { x: right, y: bottom } });
    };
    var containerRatio = containerRef && containerRef.current ? containerRef.current.offsetWidth / image.width : 1;
    // Render the image and the predicted mask image on top
    return (React.createElement("div", { className: "react-sam-tool", ref: containerRef },
        React.createElement(Stage, { width: width, height: height, style: { cursor: targetSelectEnabled ? 'crossHair' : 'default' } },
            React.createElement(Layer, { onMouseDown: function (e) { return onMouseDown(e); }, onTouchStart: function (e) { return onMouseDown(e); }, onMouseMove: function (e) { return onMouseMove(e); }, onMouseUp: function () { return onMouseUp(); }, onTouchEnd: function () { return onMouseUp(); } },
                React.createElement(Image, { image: image, x: 0, y: 0, width: width, height: height }),
                maskImage ? React.createElement(Image, { image: maskImage, x: 0, y: 0, width: width, height: height, opacity: 0.5 }) : null,
                bbox ? (React.createElement(Rect, { x: bbox.topLeft.x * containerRatio, y: bbox.topLeft.y * containerRatio, width: (bbox.bottomRight.x - bbox.topLeft.x) * containerRatio, height: (bbox.bottomRight.y - bbox.topLeft.y) * containerRatio, stroke: "green" })) : null,
                clicks.map(function (click, index) { return (React.createElement(Circle, { key: index, radius: 5, fill: click.pointType == 1 ? 'green' : 'red', stroke: 'white', strokeWidth: 1, opacity: 0.75, x: click.x * containerRatio, y: click.y * containerRatio })); })))));
};
export default Tool;
//# sourceMappingURL=Tool.js.map