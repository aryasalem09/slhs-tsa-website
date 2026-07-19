"use client";

import { useEffect } from "react";
import type { StudioDocument, StudioRecord } from "@/lib/studio/types";

const themeVariables = {
  primary: "--color-tsa-blue",
  accent: "--color-tsa-red",
  surface: "--color-paper",
  ink: "--color-ink",
} as const;

function applyDraftShell(document: StudioDocument) {
  const preset = document.theme.presets.find((candidate) => candidate.id === document.theme.activePreset) ?? document.theme.presets[0];
  if (preset) {
    for (const [token, property] of Object.entries(themeVariables)) {
      const color = preset.tokens[token];
      if (typeof color === "string" && CSS.supports("color", color)) documentElement().style.setProperty(property, color);
    }
  }
  window.dispatchEvent(new CustomEvent("studio:draft-document", { detail: document }));
}

function documentElement() {
  return window.document.documentElement;
}

/** Connects editable public regions to the same-origin Studio iframe host. */
export default function StudioBridge() {
  useEffect(() => {
    const previewParams = new URLSearchParams(window.location.search);
    const preview = previewParams.get("studio") === "1" || previewParams.get("draft") === "1";
    if (!preview) return;

    fetch("/api/studio/document")
      .then(async (response) => response.ok ? await response.json() as { document: StudioRecord } : null)
      .then((payload) => { if (payload?.document.document) applyDraftShell(payload.document.document); })
      .catch(() => undefined);

    // A full-page preview still needs the draft theme, navigation, and footer,
    // but only the embedded canvas should turn page clicks into editor picks.
    if (window.parent === window) return;

    let selected: HTMLElement | null = null;
    const select = (target: EventTarget | null) => {
      const region = target instanceof Element ? target.closest<HTMLElement>("[data-studio-id]") : null;
      if (!region) return;
      selected?.removeAttribute("data-studio-selected");
      selected?.removeAttribute("aria-selected");
      if (selected) selected.style.outline = "";
      selected = region;
      selected.setAttribute("data-studio-selected", "true");
      selected.setAttribute("aria-selected", "true");
      selected.style.outline = "3px solid #f39b35";
      selected.style.outlineOffset = "4px";
      window.parent.postMessage({ type: "studio:select", id: selected.dataset.studioId }, window.location.origin);
    };
    const onClick = (event: MouseEvent) => {
      const region = event.target instanceof Element ? event.target.closest("[data-studio-id]") : null;
      if (!region) return;
      event.preventDefault();
      event.stopPropagation();
      select(region);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const region = event.target instanceof Element ? event.target.closest("[data-studio-id]") : null;
      if (!region) return;
      event.preventDefault();
      event.stopPropagation();
      select(region);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return null;
}
