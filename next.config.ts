import type { NextConfig } from "next";

// Only this project's Blob store: a wildcard would let anyone use our image optimizer as a proxy.
// BLOB_STORE_ID is "store_<ID>"; its public host is "<id lowercased>.public.blob.vercel-storage.com".
const storeId = process.env.BLOB_STORE_ID?.match(/^store_([A-Za-z0-9]+)$/)?.[1]?.toLowerCase();

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Missing/malformed id: no remote images at all (fail closed).
    remotePatterns: storeId ? [{ protocol: "https", hostname: `${storeId}.public.blob.vercel-storage.com` }] : [],
  },
};

export default nextConfig;
