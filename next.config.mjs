/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "https://images.unsplash.com",
      "https://firebasestorage.googleapis.com",
    ],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
      {
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
