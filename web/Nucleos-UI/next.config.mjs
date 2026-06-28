/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  turbopack: {
    root: process.env.TURBOPACK_ROOT || process.cwd(),
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
