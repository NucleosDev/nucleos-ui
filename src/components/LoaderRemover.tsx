"use client";
import { useEffect } from "react";

export function LoaderRemover() {
  useEffect(() => {
    // Remove skeletons e loaders individuais
    const removeIndividualLoaders = () => {
      const selectors = [
        '[class*="skeleton"]',
        '[class*="Skeleton"]',
        '[class*="loader"]:not(.global-loader)',
        '[class*="spinner"]',
        ".animate-pulse",
        ".loading-skeleton",
      ];

      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          if (
            el instanceof HTMLElement &&
            !el.classList.contains("global-loader")
          ) {
            el.style.display = "none";
          }
        });
      });
    };

    removeIndividualLoaders();

    // Observa mudanças no DOM
    const observer = new MutationObserver(removeIndividualLoaders);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
