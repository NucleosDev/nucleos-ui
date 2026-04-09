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

  //  Remove console.log automaticamente em produção
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error"] } // mantém console.error
        : false,
  },

}

export default nextConfig;
