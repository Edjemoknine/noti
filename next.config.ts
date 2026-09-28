import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["onnxruntime-node", "sharp"],
  // make sure the model files ship with the serverless function
  outputFileTracingIncludes: {
    "/**/*": ["./models/**/*"],
  },
  outputFileTracingExcludes: {
    "*": [
      "node_modules/onnxruntime-node/bin/napi-v3/darwin/**",
      "node_modules/onnxruntime-node/bin/napi-v3/win32/**",
      "node_modules/onnxruntime-node/bin/napi-v3/linux/arm64/**",
    ],
  },
};
export default nextConfig;
