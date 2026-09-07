import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/strokes': ['./node_modules/hanzi-writer-data/*.json', './node_modules/hanzi-writer-data/ARPHICPL.TXT'],
  },
};

export default nextConfig;
