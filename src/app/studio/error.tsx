"use client";

export default function StudioError({ reset }: { reset: () => void }) {
  return (
    <div className="studio-status-page">
      <h1>Canvas Studio needs a quick refresh</h1>
      <p>Nothing on your public site was changed. Try opening the editor again.</p>
      <button className="studio-primary-button" onClick={reset}>Try again</button>
    </div>
  );
}
