import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained project: never infer a workspace root from parent folders.
  turbopack: { root: path.resolve(".") },
  outputFileTracingRoot: path.resolve("."),
  poweredByHeader: false,
};

export default nextConfig;
