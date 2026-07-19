"use client";

import { LockKey, SignIn } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";

export default function StudioLoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/studio/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "The username or password was not recognized.");
        setBusy(false);
        return;
      }
      window.location.assign("/studio");
    } catch {
      setError("Sign in could not finish. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <form className="studio-login-card" onSubmit={submit}>
      <div className="studio-login-mark"><LockKey weight="duotone" /></div>
      <p className="studio-eyebrow">SLHS TSA</p>
      <h1>Welcome to Canvas Studio</h1>
      <p className="studio-muted">Sign in to make a private draft. Nothing changes on the public website until a publisher approves it.</p>
      <label>Username<input name="username" autoComplete="username" required minLength={3} placeholder="Your Studio username" autoFocus /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required minLength={8} placeholder="Your password" /></label>
      {error ? <p className="studio-form-error" role="alert">{error}</p> : null}
      <button className="studio-primary-button" type="submit" disabled={busy}><SignIn weight="bold" /> {busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
