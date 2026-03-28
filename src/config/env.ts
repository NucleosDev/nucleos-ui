// src/config/env.ts
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",
};

// Log para debug
console.log("🌍 Environment:", {
  apiUrl: env.apiUrl,
  appUrl: env.appUrl,
  environment: env.environment,
});

export default env;
