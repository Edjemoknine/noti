import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["onnxruntime-node"],

  outputFileTracingIncludes: {
    "/**/*": ["./models/**/*"],
  },
};
export default nextConfig;
