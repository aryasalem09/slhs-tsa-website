"use client";

import { useRef, useState } from "react";
import { site } from "@/content/site";
import { IconMail } from "@/components/icons";

/**
 * The site is fully static, so this composes a pre-filled email to the club
 * Gmail and opens the visitor's own mail app — no server needed, and the
 * message really lands in the official inbox.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | undefined>(undefined);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mailSubject = `[SLHS TSA] ${subject || "Hello!"}${name ? ` — from ${name}` : ""}`;
    // RFC 6068: line breaks in mailto bodies must be CRLF.
    const body = `${message}${name ? `\n\n— ${name}` : ""}`.replace(/\r?\n/g, "\r\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      mailSubject,
    )}&body=${encodeURIComponent(body)}`;
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the address is visible right next to the button
    }
  }

  const fieldCls =
    "edge-paper-sm w-full border-2 border-ink/30 bg-white px-3.5 py-2.5 font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-muted-ink/70 focus:border-tsa-blue";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-hand text-xl font-semibold text-ink">
            your name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Spartan McSpartanface"
            className={fieldCls}
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-hand text-xl font-semibold text-ink">
            subject
          </span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Question about joining"
            className={fieldCls}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block font-hand text-xl font-semibold text-ink">
          message
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          placeholder="Hi SLHS TSA! …"
          className={`${fieldCls} resize-y`}
        />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="btn-marker edge-sketch inline-flex items-center gap-2 bg-tsa-red px-6 py-2.5 font-display text-lg font-bold text-white"
        >
          <IconMail aria-hidden="true" />
          Send it
        </button>
        <p className="font-hand text-lg leading-tight text-muted-ink">
          this opens your email app, addressed to us — we read everything!
        </p>
      </div>

      <p className="mt-2 border-t-2 border-dashed border-ink/15 pt-4 text-sm font-semibold text-muted-ink">
        Prefer to write it yourself? Email{" "}
        <span className="break-all font-bold text-ink">{site.email}</span>{" "}
        <button
          type="button"
          onClick={copyEmail}
          className="edge-sketch ml-1 inline-block border-2 border-ink/40 bg-cream px-2 py-0.5 text-xs font-bold text-ink transition-colors hover:border-ink"
        >
          {copied ? "copied! ✓" : "copy address"}
        </button>
      </p>
    </form>
  );
}
