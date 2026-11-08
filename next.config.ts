import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The embedding model runs server-side through ONNX; keep the native runtime out of the bundle
  // and ship only the linux-x64 binary to Vercel.
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node"],
  outputFileTracingExcludes: {
    "*": [
      "node_modules/onnxruntime-node/bin/napi-v*/darwin/**",
      "node_modules/onnxruntime-node/bin/napi-v*/win32/**",
      "node_modules/onnxruntime-node/bin/napi-v*/linux/arm64/**",
      "node_modules/onnxruntime-web/**",
      "node_modules/sharp/**",
      "node_modules/@img/**",
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
