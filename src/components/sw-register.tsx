"use client";

import { useEffect } from "react";

/** Registra o service worker só em produção — em dev ele atrapalha o hot reload. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // instalação como PWA sem cache offline ainda funciona normalmente pela rede.
      });
    }
  }, []);

  return null;
}
