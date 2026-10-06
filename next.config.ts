import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/**/*": ["./models/**/*"],
  },

  serverExternalPackages: ["sharp"],
};

export default nextConfig;
