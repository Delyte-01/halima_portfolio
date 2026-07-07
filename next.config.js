/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // allowedDevOrigins: ["192.168.43.21"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Allow all images from Cloudinary
      },
    ],
  },
};

module.exports = nextConfig;
