import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],

  outputFileTracingIncludes: {
    "/api/embed": ["./models/Xenova/bge-small-en-v1.5/**", "./node_modules/onnxruntime-node/**/*"],
  },
};

export default nextConfig;
