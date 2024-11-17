import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    publicRuntimeConfig: {
        SECRET_KEY: process.env.SECRET_KEY,
    },
    /* config options here */
};

export default nextConfig;
