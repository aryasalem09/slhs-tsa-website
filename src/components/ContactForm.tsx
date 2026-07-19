"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { IconMail } from "@/components/icons";

const MIN_INTERACTION_MS = 1_200;
const LAUNCH_COOLDOWN_MS = 30_000;
const COOLDOWN_KEY = "slhs-tsa-contact-mailto-last-launch";

/**
 * The site is fully static, so this composes a pre-filled email to the club
 * Gmail and opens the visitor's own mail app — no server needed, and the
 * message really lands in the official inbox.
 */
export default function ContactForm({ email = site.email }: { email?: string }) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const copiedTimer = useRef<number | undefined>(undefined);
  const openedAt = useRef(Number.POSITIVE_INFINITY);

  useEffect(() => {
    openedAt.current = performance.now();
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const cleanName = name.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("Please complete the required message before opening your email app.");
      return;
    }
    if (!cleanMessage) {
      setStatus("Please write a message before opening your email app.");
      return;
    }
    if (new FormData(form).get("website")) {
      setStatus("We couldn’t open your email app. Please try again.");
      return;
    }
    if (performance.now() - openedAt.current < MIN_INTERACTION_MS) {
      setStatus("Please take a moment to review your message, then try again.");
      return;
    }

    let lastLaunch = 0;
    try {
      lastLaunch = Number(sessionStorage.getItem(COOLDOWN_KEY) || 0);
    } catch {
      // Some privacy modes disable storage. The mailto flow remains safe because
      // this site never sends mail itself.
    }
    const remaining = LAUNCH_COOLDOWN_MS - (Date.now() - lastLaunch);
    if (remaining > 0) {
      setStatus(`Please wait ${Math.ceil(remaining / 1000)} seconds before opening another email draft.`);
      return;
    }

    const mailSubject = `[SLHS TSA] ${cleanSubject || "Hello!"}${
      cleanName ? ` from ${cleanName}` : ""
    }`;
    // RFC 6068: line breaks in mailto bodies must be CRLF.
    const body = `${cleanMessage}${cleanName ? `\n\n- ${cleanName}` : ""}`.replace(
      /\r?\n/g,
      "\r\n",
    );
    try {
      sessionStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    } catch {
      // Storage-backed cooldown is best-effort; the visitor's mail app still
      // requires an explicit send action.
    }
    setStatus("Opening a new email draft in your mail app.");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      mailSubject,
    )}&body=${encodeURIComponent(body)}`;
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
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
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
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
            maxLength={120}
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
            maxLength={160}
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
          maxLength={5_000}
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
          this opens your email app with our address filled in. we read everything!
        </p>
      </div>

      <p aria-live="polite" role="status" className="min-h-5 text-sm font-semibold text-muted-ink">
        {status}
      </p>

      <p className="mt-2 border-t-2 border-dashed border-ink/15 pt-4 text-sm font-semibold text-muted-ink">
        Prefer to write it yourself? Email{" "}
        <span className="break-all font-bold text-ink">{email}</span>{" "}
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
