"use client";

import { useEffect } from "react";

function sessionId() {
  let id = sessionStorage.getItem("victor_session");
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem("victor_session", id); }
  return id;
}

export function track(eventName: "page_view" | "cta_click" | "contact_click" | "project_view", label?: string) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ eventName, label, page: location.pathname, referrer: document.referrer, sessionId: sessionId() });
  if (navigator.sendBeacon) navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
  else void fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
}

export function AnalyticsTracker() {
  useEffect(() => {
    track("page_view");
    const click = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-track]");
      if (target) track((target.dataset.event as "cta_click" | "contact_click" | "project_view") || "cta_click", target.dataset.track);
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return null;
}
