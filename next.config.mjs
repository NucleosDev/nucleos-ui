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
}

export default nextConfig
