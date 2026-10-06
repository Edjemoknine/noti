import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp", "@huggingface/transformers", "onnxruntime-node"],

  outputFileTracingIncludes: {
    "/**/*": [
      "./models/Xenova/bge-small-en-v1.5/*.json",
      "./models/Xenova/bge-small-en-v1.5/*.txt",
      "./models/Xenova/bge-small-en-v1.5/onnx/model_quantized.onnx",
      "./node_modules/onnxruntime-node/**/*",
    ],
  },

  outputFileTracingExcludes: {
    "/**/*": [
      "./node_modules/onnxruntime-node/bin/napi-v3/darwin/**",
      "./node_modules/onnxruntime-node/bin/napi-v3/win32/**",
      "./node_modules/onnxruntime-node/bin/napi-v3/linux/arm64/**",
      "./node_modules/onnxruntime-node/**/*cuda*",
      "./node_modules/onnxruntime-node/**/*tensorrt*",
    ],
  },
};

export default nextConfig;
