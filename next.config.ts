import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // debt: EdgeOne serves page RSC for /_tree prefetches; restore once it serves fresh route hints.
    prefetchInlining: false,
  },
  outputFileTracingIncludes: {
    '/api/strokes': ['./node_modules/hanzi-writer-data/*.json', './node_modules/hanzi-writer-data/ARPHICPL.TXT'],
  },
};

export default nextConfig;
