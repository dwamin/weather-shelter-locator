"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    if ("serviceWorker" in navigator) {
      const registerWorker = async () => {
        try {
          await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        } catch (error) {
          console.error("Service worker registration failed:", error);
        }
      };

      window.addEventListener("load", registerWorker);
      return () => window.removeEventListener("load", registerWorker);
    }
  }, []);

  return null;
}
