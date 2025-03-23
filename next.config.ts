// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
   
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https", // domains: ["localhost"],
        hostname: "example.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "3000",
//         pathname: "/api/uploads/**",
//       },
//     ],
//   },
// };

// module.exports = nextConfig;


