// src/config/env.ts
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://localhost:5000/api/v1",

  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000",

  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",
};

// Log para debug
console.log("🌍 Environment:", {
  apiUrl: env.apiUrl,
  appUrl: env.appUrl,
  environment: env.environment,
});

export default env;
