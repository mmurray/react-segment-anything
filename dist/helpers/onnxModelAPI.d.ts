import { Tensor } from "onnxruntime-web";
import { ModelData } from "./Interfaces";
declare const modelData: ({ clicks, bbox, embedding, modelScale }: ModelData) => {
    image_embeddings: Tensor;
    point_coords: import("onnxruntime-web").TypedTensor<"float32">;
    point_labels: import("onnxruntime-web").TypedTensor<"float32">;
    orig_im_size: import("onnxruntime-web").TypedTensor<"float32">;
    mask_input: import("onnxruntime-web").TypedTensor<"float32">;
    has_mask_input: import("onnxruntime-web").TypedTensor<"float32">;
} | undefined;
export { modelData };
//# sourceMappingURL=onnxModelAPI.d.ts.map