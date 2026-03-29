/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: "/Users/andrewpimenta/Documents/Repository/nucleos-ui",
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://localhost:5000/api/:path*',
  //     },
  //   ];
  // },
}

export default nextConfig
