// src/components/initial-loader.tsx
"use client";

import { useEffect, useState } from "react";

export function InitialLoader() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHide(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`initial-loader ${hide ? "hide" : ""}`}>
      <div className="initial-loader-content">
        {/* Anel giratório */}
        <div className="initial-loader-ring" />

        {/* Logo com pulso */}
        <div className="initial-loader-logo-wrapper">
          <img src="/icon.svg" alt="Nucleos" className="initial-loader-logo" />
        </div>
      </div>
    </div>
  );
}
