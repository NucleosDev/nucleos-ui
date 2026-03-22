"use client";

import { useState } from "react";
import { authService } from "@/services/auth.service";
import { LoginRequest } from "@/types/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = async (data: LoginRequest) => {
    setLoading(true);

    try {
      const res = await authService.login(data);

      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  return {
    login,
    logout,
    isAuthenticated,
    loading,
  };
}