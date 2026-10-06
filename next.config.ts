import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep sharp external because Next handles it as a native server dependency.
  serverExternalPackages: ["sharp"],

  // Include the local BGE model and ONNX runtime files
  // in the server output.
  outputFileTracingIncludes: {
    "/**/*": ["./models/Xenova/bge-small-en-v1.5/**", "./node_modules/onnxruntime-node/**/*"],
  },
};

export default nextConfig;
