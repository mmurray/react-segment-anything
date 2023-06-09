// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.
// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.
// Convert the onnx model mask prediction to ImageData
function arrayToImageData(input, width, height) {
    var _a = [0, 114, 189, 255], r = _a[0], g = _a[1], b = _a[2], a = _a[3]; // the masks's blue color
    var arr = new Uint8ClampedArray(4 * width * height).fill(0);
    for (var i = 0; i < input.length; i++) {
        // Threshold the onnx model mask prediction at 0.0
        // This is equivalent to thresholding the mask using predictor.model.mask_threshold
        // in python
        if (input[i] > 0.0) {
            arr[4 * i + 0] = r;
            arr[4 * i + 1] = g;
            arr[4 * i + 2] = b;
            arr[4 * i + 3] = a;
        }
    }
    return new ImageData(arr, height, width);
}
// Use a Canvas element to produce an image from ImageData
function imageDataToImage(imageData) {
    var canvas = imageDataToCanvas(imageData);
    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
}
// Canvas elements can be created from ImageData
function imageDataToCanvas(imageData) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx === null || ctx === void 0 ? void 0 : ctx.putImageData(imageData, 0, 0);
    return canvas;
}
// Convert the onnx model mask output to an HTMLImageElement
export function onnxMaskToImage(input, width, height) {
    return imageDataToImage(arrayToImageData(input, width, height));
}
//# sourceMappingURL=maskUtils.js.map