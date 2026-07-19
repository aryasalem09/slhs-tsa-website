"use client";

import {
  ArrowsInSimple,
  ArrowsOutSimple,
  ArrowClockwise,
  ArrowCounterClockwise,
  CaretDown,
  CaretUp,
  CheckCircle,
  ClockCounterClockwise,
  Copy,
  Desktop,
  DeviceMobile,
  DeviceTablet,
  DotsSixVertical,
  Eye,
  FileText,
  Gear,
  House,
  ImageSquare,
  LinkSimple,
  PaperPlaneTilt,
  Plus,
  SignOut,
  Trash,
  UploadSimple,
  WarningCircle,
  X,
  XCircle,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  StudioDocument,
  StudioRecord,
  StudioRevision,
  StudioSession,
  StudioThemePreset,
} from "@/lib/studio/types";
import {
  editorPathKey,
  isStudioLinkField,
  isStudioReviewPathRelevant,
  isValidStudioLink,
  studioCollectionHint,
  studioFieldLabel,
  studioPageEntries,
  studioPageLabel,
  studioSectionEntries,
  studioSectionHelp,
  studioSectionLabel,
  visibleEditorObjectEntries,
} from "@/lib/studio/editor-config";
import { studioDocumentSchema } from "@/lib/studio/validation";
import { isSafeImageSrc } from "@/lib/urls";

type Device = "desktop" | "tablet" | "mobile";
type SaveState = "loading" | "saved" | "changed" | "saving" | "conflict" | "error";
type EditorPath = Array<string | number>;
type ReviewLevel = "pass" | "warning" | "error";
type ReviewCheck = { label: string; detail: string; level: ReviewLevel; count: number; items?: string[] };
type DocumentResponse = { document?: StudioRecord; error?: string };

const MAX_UNDO = 50;
export default function StudioPage() {
  const [document, setDocumentState] = useState<StudioDocument | null>(null);
  const [session, setSession] = useState<StudioSession | null>(null);
  const [currentPage, setCurrentPage] = useState("");
  const [selectedPath, setSelectedPath] = useState<EditorPath>([]);
  const [selectedLabel, setSelectedLabel] = useState("Content");
  const [device, setDevice] = useState<Device>("desktop");
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [saveError, setSaveError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [inspectorExpanded, setInspectorExpanded] = useState(false);
  const [editorEpoch, setEditorEpoch] = useState(0);
  const [previewKey, setPreviewKey] = useState(0);
  const [changeTick, setChangeTick] = useState(0);
  const [undoStack, setUndoStack] = useState<StudioDocument[]>([]);
  const [redoStack, setRedoStack] = useState<StudioDocument[]>([]);
  const [notice, setNotice] = useState("");

  const documentRef = useRef<StudioDocument | null>(null);
  const lockVersionRef = useRef(0);
  const editVersionRef = useRef(0);
  const savedVersionRef = useRef(0);
  const savePromiseRef = useRef<Promise<boolean> | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const setDocument = useCallback((next: StudioDocument) => {
    documentRef.current = next;
    setDocumentState(next);
  }, []);

  const loadStudio = useCallback(async () => {
    setSaveState("loading");
    setLoadError("");
    setSaveError("");
    setNotice("");
    try {
      const [sessionResponse, documentResponse] = await Promise.all([
        fetch("/api/studio/session", { cache: "no-store" }),
        fetch("/api/studio/document", { cache: "no-store" }),
      ]);
      if (sessionResponse.status === 401 || documentResponse.status === 401) {
        window.location.assign("/studio/login");
        return;
      }
      const sessionPayload = await sessionResponse.json() as { session?: StudioSession; error?: string };
      const documentPayload = await documentResponse.json() as DocumentResponse;
      if (!sessionResponse.ok || !sessionPayload.session) throw new Error(sessionPayload.error ?? "Your Studio session could not be loaded.");
      if (!documentResponse.ok || !documentPayload.document) throw new Error(documentPayload.error ?? "Your draft could not be loaded.");

      const record = documentPayload.document;
      setSession(sessionPayload.session);
      setDocument(record.document);
      lockVersionRef.current = record.lockVersion;
      editVersionRef.current = 0;
      savedVersionRef.current = 0;
      setUndoStack([]);
      setRedoStack([]);
      setEditorEpoch((epoch) => epoch + 1);
      const firstPage = record.document.pages.home ? "home" : studioPageEntries(record.document.pages)[0]?.[0] ?? "";
      selectPage(firstPage, record.document);
      setSaveState("saved");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Canvas Studio could not be opened.");
      setSaveState("error");
    }
  }, [setDocument]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadStudio(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadStudio]);

  const saveNow = useCallback(async () => {
    if (savePromiseRef.current) return savePromiseRef.current;
    const run = async () => {
      while (documentRef.current && savedVersionRef.current < editVersionRef.current) {
        const snapshot = structuredClone(documentRef.current) as StudioDocument;
        const capturedVersion = editVersionRef.current;
        setSaveState("saving");
        setSaveError("");
        try {
          const response = await fetch("/api/studio/document", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              document: { ...snapshot, updatedAt: new Date().toISOString() },
              lockVersion: lockVersionRef.current,
            }),
          });
          if (response.status === 401) {
            window.location.assign("/studio/login");
            return false;
          }
          const payload = await response.json() as DocumentResponse;
          if (response.status === 409) {
            setSaveState("conflict");
            setSaveError(payload.error ?? "This draft changed in another window. Reload the latest copy before continuing.");
            return false;
          }
          if (!response.ok || !payload.document) throw new Error(payload.error ?? "Your draft could not be saved.");
          lockVersionRef.current = payload.document.lockVersion;
          savedVersionRef.current = capturedVersion;
          if (editVersionRef.current === capturedVersion) {
            setDocument(payload.document.document);
            setSaveState("saved");
            setPreviewKey((key) => key + 1);
          } else {
            setSaveState("changed");
          }
        } catch (error) {
          setSaveState("error");
          setSaveError(error instanceof Error ? error.message : "Your draft could not be saved.");
          return false;
        }
      }
      return savedVersionRef.current >= editVersionRef.current;
    };
    const pending = run();
    savePromiseRef.current = pending;
    try { return await pending; } finally { if (savePromiseRef.current === pending) savePromiseRef.current = null; }
  }, [setDocument]);

  useEffect(() => {
    if (!changeTick || saveState !== "changed") return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => { void saveNow(); }, 900);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [changeTick, saveNow, saveState]);

  const commitDocument = useCallback((next: StudioDocument, addHistory = true) => {
    const previous = documentRef.current;
    if (!previous) return;
    if (addHistory) {
      setUndoStack((stack) => [...stack.slice(-(MAX_UNDO - 1)), structuredClone(previous) as StudioDocument]);
      setRedoStack([]);
    }
    setDocument(next);
    editVersionRef.current += 1;
    setChangeTick((value) => value + 1);
    setSaveState((state) => state === "conflict" ? "conflict" : "changed");
    setNotice("");
  }, [setDocument]);

  const updateAtPath = useCallback((path: EditorPath, value: unknown) => {
    const current = documentRef.current;
    if (!current) return;
    const next = structuredClone(current) as StudioDocument;
    setAtPath(next, path, value);
    commitDocument(next);
  }, [commitDocument]);

  const undo = () => {
    const previous = undoStack.at(-1);
    const current = documentRef.current;
    if (!previous || !current) return;
    setUndoStack((stack) => stack.slice(0, -1));
    setRedoStack((stack) => [...stack, structuredClone(current) as StudioDocument]);
    setDocument(structuredClone(previous) as StudioDocument);
    setEditorEpoch((epoch) => epoch + 1);
    editVersionRef.current += 1;
    setChangeTick((value) => value + 1);
    setSaveState((state) => state === "conflict" ? "conflict" : "changed");
  };

  const redo = () => {
    const nextDocument = redoStack.at(-1);
    const current = documentRef.current;
    if (!nextDocument || !current) return;
    setRedoStack((stack) => stack.slice(0, -1));
    setUndoStack((stack) => [...stack, structuredClone(current) as StudioDocument]);
    setDocument(structuredClone(nextDocument) as StudioDocument);
    setEditorEpoch((epoch) => epoch + 1);
    editVersionRef.current += 1;
    setChangeTick((value) => value + 1);
    setSaveState((state) => state === "conflict" ? "conflict" : "changed");
  };

  const selectPageFromDocument = (pageKey: string) => {
    if (!documentRef.current) return;
    selectPage(pageKey, documentRef.current);
  };

  function selectPage(pageKey: string, source: StudioDocument) {
    const page = source.pages[pageKey];
    if (!page) return;
    setCurrentPage(pageKey);
    const firstSection = studioSectionEntries(pageKey, page.sections)[0]?.[0];
    if (firstSection) {
      setSelectedPath(["pages", pageKey, "sections", firstSection]);
      setSelectedLabel(studioSectionLabel(pageKey, firstSection));
    } else {
      setSelectedPath(["pages", pageKey]);
      setSelectedLabel(`${page.title} page`);
    }
  }

  useEffect(() => {
    function receiveMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow || event.data?.type !== "studio:select" || !documentRef.current) return;
      const rawId = typeof event.data.id === "string" ? event.data.id : "";
      const parts = rawId.split(".").filter(Boolean);
      if (!parts.length) return;
      if (parts[0] === "site") {
        setSelectedPath(["site"]);
        setSelectedLabel("Site settings");
        return;
      }
      const pageKey = parts[0];
      const page = documentRef.current.pages[pageKey];
      if (!page) return;
      setCurrentPage(pageKey);
      const sectionKey = nearestSectionKey(studioSectionEntries(pageKey, page.sections).map(([key]) => key), parts.slice(1));
      if (sectionKey) {
        setSelectedPath(["pages", pageKey, "sections", sectionKey]);
        setSelectedLabel(studioSectionLabel(pageKey, sectionKey));
      } else {
        setSelectedPath(["pages", pageKey]);
        setSelectedLabel(`${page.title} page`);
      }
    }
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, []);

  const pageEntries = studioPageEntries(document?.pages ?? {});
  const activePage = document?.pages[currentPage];
  const activePageLabel = activePage ? studioPageLabel(currentPage, activePage.title) : "Page";
  const sectionEntries = studioSectionEntries(currentPage, activePage?.sections ?? {});
  const selectedValue = document ? getAtPath(document, selectedPath) : undefined;
  const selectedSectionKey = selectedPath[0] === "pages" && selectedPath[2] === "sections" ? String(selectedPath[3] ?? "") : undefined;
  const previewRoute = activePage?.route ?? "/";
  const previewSrc = draftPreviewUrl(previewRoute);
  const reviewChecks = useMemo(() => document ? inspectDocument(document) : [], [document]);
  const reviewTotals = totalsFor(reviewChecks);
  const canPublishRole = session?.role === "admin" || session?.role === "publisher";
  const reviewUnavailable = !document || saveState === "loading";
  const publishBlocked = !document || reviewTotals.error > 0 || saveState === "conflict" || saveState === "error" || saveState === "loading";
  const saveLabel: Record<SaveState, string> = {
    loading: "Loading draft…", saved: "All changes saved", changed: "Unsaved draft changes",
    saving: "Saving draft…", conflict: "Draft needs reloading", error: "Draft not saved",
  };

  const restoreRecord = (record: StudioRecord) => {
    setDocument(record.document);
    lockVersionRef.current = record.lockVersion;
    editVersionRef.current = 0;
    savedVersionRef.current = 0;
    setUndoStack([]);
    setRedoStack([]);
    setEditorEpoch((epoch) => epoch + 1);
    selectPage(record.document.pages.home ? "home" : studioPageEntries(record.document.pages)[0]?.[0] ?? "", record.document);
    setSaveState("saved");
    setSaveError("");
    setPreviewKey((key) => key + 1);
    setNotice("Earlier version restored as your new draft.");
  };

  const prepareRestore = async (): Promise<{ ok: true; lockVersion: number } | { ok: false; error: string }> => {
    const saved = await saveNow();
    if (!saved) return { ok: false, error: saveError || "Save or reload the current draft before restoring a version." };
    return { ok: true, lockVersion: lockVersionRef.current };
  };

  const useUploadedMedia = (url: string) => {
    const current = documentRef.current;
    if (!current) return false;
    const selected = getAtPath(current, selectedPath);
    const relativePath = findMediaFieldPath(selected);
    if (!relativePath) return false;
    updateAtPath([...selectedPath, ...relativePath], url);
    setMediaOpen(false);
    setNotice("Uploaded image added to this content.");
    return true;
  };

  const publish = async () => {
    const saved = await saveNow();
    if (!saved || !documentRef.current) return { ok: false, error: saveError || "Save this draft before publishing." };
    const latestChecks = inspectDocument(documentRef.current);
    if (latestChecks.some((check) => check.level === "error")) return { ok: false, error: "Fix the errors in the review before publishing." };
    try {
      const response = await fetch("/api/studio/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lockVersion: lockVersionRef.current }),
      });
      if (response.status === 401) { window.location.assign("/studio/login"); return { ok: false, error: "Your session ended." }; }
      const payload = await response.json() as DocumentResponse;
      if (response.status === 409) {
        await loadStudio();
        return { ok: false, error: payload.error ?? "This draft changed in another window. The latest draft has been reloaded; review it before publishing." };
      }
      if (!response.ok) return { ok: false, error: payload.error ?? "Publishing could not finish." };
      await loadStudio();
      setNotice("Published successfully. The public website now has your latest saved changes.");
      return { ok: true, error: "" };
    } catch { return { ok: false, error: "Publishing could not finish. Check your connection and try again." }; }
  };

  const logout = async () => {
    await fetch("/api/studio/session", { method: "DELETE" }).catch(() => undefined);
    window.location.assign("/studio/login");
  };

  if (loadError) {
    return <div className="studio-status-page"><XCircle weight="fill" /><h1>Canvas Studio could not open</h1><p>{loadError}</p><button className="studio-primary-button" onClick={() => void loadStudio()}>Try again</button></div>;
  }

  if (!document || !session) {
    return <div className="studio-status-page" role="status"><div className="studio-loader" /><p>Opening your website draft…</p></div>;
  }

  return (
    <div className="studio-shell">
      <header className="studio-toolbar">
        <Link className="studio-brand" href="/" aria-label="Return to SLHS TSA site"><Image src="/logos/spartan-mark-512.png" alt="" width={42} height={42} priority /><span>SLHS <b>TSA</b></span></Link>
        <div className="studio-title"><em>Canvas Studio</em><small>Visual Website Editor</small></div>
        <label className="studio-page-picker"><span>Page</span><select value={currentPage} onChange={(event) => selectPageFromDocument(event.target.value)}>{pageEntries.map(([key, page]) => <option key={key} value={key}>{studioPageLabel(key, page.title)}</option>)}</select><CaretDown weight="bold" /></label>
        <span className={`studio-save-state studio-${saveState}`}>{saveState === "error" || saveState === "conflict" ? <WarningCircle weight="fill" /> : <CheckCircle weight="fill" />} {saveLabel[saveState]}<small>Draft only</small></span>
        <div className="studio-tool-group" aria-label="Edit history"><button onClick={undo} disabled={!undoStack.length || saveState === "conflict"} aria-label="Undo"><ArrowCounterClockwise /></button><button onClick={redo} disabled={!redoStack.length || saveState === "conflict"} aria-label="Redo"><ArrowClockwise /></button></div>
        <div className="studio-device-group" aria-label="Preview device"><button className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")} aria-label="Desktop preview"><Desktop /></button><button className={device === "tablet" ? "active" : ""} onClick={() => setDevice("tablet")} aria-label="Tablet preview"><DeviceTablet /></button><button className={device === "mobile" ? "active" : ""} onClick={() => setDevice("mobile")} aria-label="Mobile preview"><DeviceMobile /></button></div>
        <button className="studio-quiet-button" onClick={() => window.open(previewSrc, "_blank", "noopener,noreferrer")}><Eye /> Preview</button>
        <button className="studio-publish-button" onClick={() => setPublishOpen(true)} disabled={reviewUnavailable}><PaperPlaneTilt weight="fill" /> {reviewTotals.error ? "Review" : "Publish"}</button>
        <div className="studio-account"><span className="studio-avatar" aria-hidden="true">{initials(session.displayName ?? session.username)}</span><span>{session.displayName ?? session.username}<small>{humanize(session.role)}</small></span><button onClick={logout} aria-label="Log out"><SignOut /></button></div>
      </header>

      {(saveError || notice) ? <div className={`studio-banner ${saveError ? "error" : "success"}`} role="status"><span>{saveError || notice}</span>{saveState === "conflict" ? <button onClick={() => { if (window.confirm("Reload the latest saved draft? Unsaved changes in this window will be discarded.")) void loadStudio(); }}>Reload latest draft</button> : saveState === "error" ? <button onClick={() => void saveNow()}>Try saving again</button> : <button aria-label="Dismiss message" onClick={() => setNotice("")}><X /></button>}</div> : null}

      <div className={`studio-workspace ${inspectorExpanded ? "studio-inspector-expanded" : ""}`}>
        <aside className="studio-rail" aria-label="Studio navigation">
          <div className="studio-rail-heading"><span><FileText weight="duotone" /> Pages</span></div>
          {pageEntries.map(([key, page]) => <button key={key} className={`studio-page-link ${currentPage === key ? "selected" : ""}`} onClick={() => selectPageFromDocument(key)}>{page.route === "/" ? <House weight="fill" /> : <FileText />}<span>{studioPageLabel(key, page.title)}</span></button>)}
          <p className="studio-rail-label">{activePageLabel} sections</p>
          <div className="studio-section-list"><button className={pathsEqual(selectedPath, ["pages", currentPage]) ? "selected" : ""} onClick={() => { setSelectedPath(["pages", currentPage]); setSelectedLabel("Page details"); }}><Gear /><span>Page details</span><small>Settings</small></button>{sectionEntries.length ? sectionEntries.map(([key, value]) => { const label = studioSectionLabel(currentPage, key); return <button key={key} className={pathsEqual(selectedPath, ["pages", currentPage, "sections", key]) ? "selected" : ""} onClick={() => { setSelectedPath(["pages", currentPage, "sections", key]); setSelectedLabel(label); }}><DotsSixVertical /><span>{label}</span><small>{valueKind(value)}</small></button>; }) : <p className="studio-empty-note">This page has no editable sections.</p>}</div>
          <button className="studio-add-row" onClick={() => setMediaOpen(true)}><ImageSquare /> Media library</button>
          <div className="studio-rail-bottom"><button className={selectedPath[0] === "theme" ? "selected" : ""} onClick={() => { setSelectedPath(["theme"]); setSelectedLabel("Theme"); }}><LinkSimple /> Theme</button><button className={selectedPath[0] === "navigation" ? "selected" : ""} onClick={() => { setSelectedPath(["navigation"]); setSelectedLabel("Navigation"); }}><FileText /> Navigation</button><button className={selectedPath[0] === "site" ? "selected" : ""} onClick={() => { setSelectedPath(["site"]); setSelectedLabel("Site settings"); }}><Gear /> Site settings</button><button onClick={logout}><SignOut /> Log out</button></div>
        </aside>

        <section className="studio-canvas" aria-label="Website preview">
          <div className="studio-canvas-top"><span><span className="studio-draft-dot" /> Editing <strong>{activePageLabel}</strong></span><button onClick={() => setPreviewKey((key) => key + 1)}><ArrowClockwise /> Refresh preview</button></div>
          <div className={`studio-preview-frame studio-preview-${device}`}><iframe ref={iframeRef} key={`${previewKey}-${previewSrc}`} title={`${activePageLabel} live website preview`} src={previewSrc} /></div>
        </section>

        <aside className="studio-inspector" aria-label="Content inspector">
          <div className="studio-breadcrumb">{selectedPath[0] === "pages" ? activePageLabel : "Studio"}<span>›</span>{selectedLabel}</div>
          <div className="studio-inspector-heading"><div><p>Now editing</p><h1>{selectedLabel}</h1></div><button type="button" className="studio-inspector-resize" aria-expanded={inspectorExpanded} aria-controls="studio-inspector-fields" onClick={() => setInspectorExpanded((expanded) => !expanded)}>{inspectorExpanded ? <ArrowsInSimple /> : <ArrowsOutSimple />}<span>{inspectorExpanded ? "Narrow panel" : "Expand panel"}</span></button></div>
          <div className="studio-inspector-note"><strong>{studioSectionHelp(currentPage, selectedSectionKey)}</strong><small>Changes save automatically and stay private until you publish.</small></div>
          <div className="studio-field-list" id="studio-inspector-fields">
            {selectedPath[0] === "theme" ? <ThemeEditor theme={document.theme} onChange={(theme) => updateAtPath(["theme"], theme)} /> : selectedPath[0] === "pages" && selectedPath.length === 2 && activePage ? <PageDetailsEditor pageKey={currentPage} page={activePage} onChange={updateAtPath} /> : selectedValue !== undefined ? <ValueEditor key={`${editorPathKey(selectedPath)}-${editorEpoch}`} label={selectedLabel} value={selectedValue} path={selectedPath} onChange={updateAtPath} depth={0} /> : <p className="studio-empty-note">Choose a page section to start editing.</p>}
          </div>
        </aside>
      </div>

      <footer className={`studio-review-tray ${reviewTotals.error ? "has-errors" : reviewTotals.warning ? "has-warnings" : ""}`}>
        <div className="studio-ready">{reviewTotals.error ? <XCircle weight="fill" /> : reviewTotals.warning ? <WarningCircle weight="fill" /> : <CheckCircle weight="fill" />}<span><strong>{reviewTotals.error ? `${reviewTotals.error} issue${reviewTotals.error === 1 ? "" : "s"} to fix` : reviewTotals.warning ? `Ready with ${reviewTotals.warning} warning${reviewTotals.warning === 1 ? "" : "s"}` : "Ready to publish"}</strong><small>{reviewTotals.pass} checks passed from the current draft.</small></span></div>
        {reviewChecks.slice(0, 3).map((check) => <ReviewSummary key={check.label} check={check} />)}
        <button className="studio-tray-publish" onClick={() => setPublishOpen(true)} disabled={reviewUnavailable}>Review & publish <PaperPlaneTilt /></button>
        <button className="studio-history-button" onClick={() => setHistoryOpen(true)}><ClockCounterClockwise /> Version history</button>
      </footer>

      {historyOpen ? <HistoryDrawer close={() => setHistoryOpen(false)} onRestore={restoreRecord} canRestore={canPublishRole} beforeRestore={prepareRestore} onConflict={loadStudio} /> : null}
      {mediaOpen ? <MediaDialog close={() => setMediaOpen(false)} onUse={useUploadedMedia} /> : null}
      {publishOpen ? <PublishDialog close={() => setPublishOpen(false)} allowed={canPublishRole} checks={reviewChecks} blocked={publishBlocked} onPublish={publish} /> : null}
    </div>
  );
}

function ValueEditor({ label, value, path, onChange, depth }: { label: string; value: unknown; path: EditorPath; onChange: (path: EditorPath, value: unknown) => void; depth: number }) {
  const key = String(path.at(-1) ?? label);
  const displayLabel = studioFieldLabel(path, label);
  if (/^(html|css|javascript|script|sourceCode)$/i.test(key)) return <p className="studio-empty-note"><strong>{displayLabel}</strong> is an advanced field and cannot be edited in Canvas Studio.</p>;
  if (Array.isArray(value)) return <CollectionEditor key={editorPathKey(path)} label={displayLabel} values={value} path={path} onChange={onChange} depth={depth} />;
  if (value !== null && typeof value === "object") {
    const entries = visibleEditorObjectEntries(path, value as Record<string, unknown>);
    if (!entries.length) return <p className="studio-empty-note">There are no beginner-editable fields in this group.</p>;
    return <div className={`studio-object-fields ${depth ? "nested" : ""}`}>{entries.map(([childKey, childValue]) => { const childPath = [...path, childKey]; return <ValueEditor key={childKey} label={studioFieldLabel(childPath, humanize(childKey))} value={childValue} path={childPath} onChange={onChange} depth={depth + 1} />; })}</div>;
  }
  if (typeof value === "boolean") return <div className="studio-switch-row"><span><strong>{displayLabel}</strong><small>{value ? "Shown or enabled" : "Hidden or disabled"}</small></span><button className={`studio-switch ${value ? "on" : ""}`} onClick={() => onChange(path, !value)} aria-pressed={value} aria-label={`${displayLabel}: ${value ? "on" : "off"}`}><i /></button></div>;
  if (typeof value === "number") return <label><span>{displayLabel}</span><input type="number" value={value} onChange={(event) => onChange(path, Number(event.target.value))} /></label>;
  const stringValue = value === null || value === undefined ? "" : String(value);
  const updateStringValue = (next: string) => onChange(path, /^canvaUrl$/i.test(key) && !next.trim() ? null : next);
  const options = selectOptions(key, stringValue);
  const help = fieldHelp(key);
  if (options) return <label><span>{displayLabel}</span>{help ? <small className="studio-field-help">{help}</small> : null}<select value={stringValue} onChange={(event) => onChange(path, event.target.value)}>{options.map((option) => <option key={option} value={option}>{option || "Not set"}</option>)}</select></label>;
  if (looksLikeColor(key, stringValue)) return <label><span>{displayLabel}</span><span className="studio-color-input"><input type="color" value={validHex(stringValue) ? stringValue : "#163c7a"} onChange={(event) => onChange(path, event.target.value)} /><input value={stringValue} onChange={(event) => onChange(path, event.target.value)} pattern="#[0-9a-fA-F]{6}" /></span></label>;
  const type = /email/i.test(key) ? "email" : isStudioLinkField(key) ? "url" : "text";
  const multiline = stringValue.length > 90 || /(description|text|bio|blurb|summary|content|answer|intro|details|notes?)/i.test(key);
  return <label><span>{displayLabel}</span>{help ? <small className="studio-field-help">{help}</small> : null}{multiline ? <textarea value={stringValue} onChange={(event) => updateStringValue(event.target.value)} rows={Math.min(8, Math.max(3, Math.ceil(stringValue.length / 48)))} /> : <input type={type} value={stringValue} placeholder={type === "url" ? "https://…" : undefined} onChange={(event) => updateStringValue(event.target.value)} />}</label>;
}

function PageDetailsEditor({ pageKey, page, onChange }: { pageKey: string; page: StudioDocument["pages"][string]; onChange: (path: EditorPath, value: unknown) => void }) {
  return <div className="studio-object-fields"><ValueEditor label="Page title" value={page.title} path={["pages", pageKey, "title"]} onChange={onChange} depth={0} /><ValueEditor label="Page description" value={page.description} path={["pages", pageKey, "description"]} onChange={onChange} depth={0} /><label>Page address<input value={page.route} readOnly aria-readonly="true" /></label><p className="studio-empty-note">Page addresses are managed by the website so existing links keep working.</p></div>;
}

function CollectionEditor({ label, values, path, onChange, depth }: { label: string; values: unknown[]; path: EditorPath; onChange: (path: EditorPath, value: unknown) => void; depth: number }) {
  const template = newCollectionItem(path, values);
  const hint = studioCollectionHint(path);
  const [cardKeys, setCardKeys] = useState(() => values.map(() => nextEditorCardKey()));
  const addItem = () => {
    if (template === undefined) return;
    setCardKeys((keys) => [...keys, nextEditorCardKey()]);
    onChange(path, [...values, structuredClone(template)]);
  };
  return <fieldset className={`studio-collection studio-collection-depth-${Math.min(depth, 2)}`}><legend><span>{label}</span><small>{values.length} item{values.length === 1 ? "" : "s"}</small></legend>{hint ? <p className="studio-collection-hint">{hint}</p> : null}{values.length ? values.map((item, index) => <CollectionCard key={cardKeys[index] ?? `pending-${index}`} item={item} index={index} count={values.length} path={path} onChange={onChange} depth={depth} onDuplicate={() => { const duplicate = cloneForDuplicate(item, values); setCardKeys((keys) => [...keys.slice(0, index + 1), nextEditorCardKey(), ...keys.slice(index + 1)]); onChange(path, [...values.slice(0, index + 1), duplicate, ...values.slice(index + 1)]); }} onRemove={() => { if (window.confirm(`Remove ${itemTitle(item, index)}? You can still undo this change.`)) { setCardKeys((keys) => keys.filter((_, itemIndex) => itemIndex !== index)); onChange(path, values.filter((_, itemIndex) => itemIndex !== index)); } }} onMove={(direction) => { const nextIndex = index + direction; if (nextIndex < 0 || nextIndex >= values.length) return; const next = [...values]; [next[index], next[nextIndex]] = [next[nextIndex], next[index]]; setCardKeys((keys) => { const reordered = [...keys]; [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]]; return reordered; }); onChange(path, next); }} />) : <p className="studio-empty-note">Nothing has been added here yet.</p>}{template !== undefined ? <button type="button" className="studio-collection-add" onClick={addItem}><Plus /> Add {collectionItemNoun(path, label)}</button> : <p className="studio-empty-note">New items cannot be added to this collection in Studio yet.</p>}</fieldset>;
}

function CollectionCard({ item, index, count, path, onChange, depth, onDuplicate, onRemove, onMove }: { item: unknown; index: number; count: number; path: EditorPath; onChange: (path: EditorPath, value: unknown) => void; depth: number; onDuplicate: () => void; onRemove: () => void; onMove: (direction: -1 | 1) => void }) {
  const [open, setOpen] = useState(false);
  const summary = collectionItemSummary(item, index, path);
  const imageSrc = collectionItemImage(item);
  return <div className="studio-collection-card"><div className="studio-card-heading"><button type="button" className="studio-card-toggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{imageSrc ? <Image className="studio-card-thumb" src={imageSrc} alt="" width={42} height={42} unoptimized /> : null}<span className="studio-card-copy"><strong>{summary.title}</strong><small>{summary.meta}</small></span><span className="studio-card-edit-hint">{open ? "Close" : "Edit"}</span><CaretDown className={open ? "open" : ""} /></button></div>{open ? <div className="studio-card-content"><ValueEditor label={summary.title} value={item} path={[...path, index]} onChange={onChange} depth={depth + 1} /><div className="studio-card-actions"><button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label={`Move ${summary.title} up`}><CaretUp /><span>Move up</span></button><button type="button" onClick={() => onMove(1)} disabled={index === count - 1} aria-label={`Move ${summary.title} down`}><CaretDown /><span>Move down</span></button><button type="button" onClick={onDuplicate} aria-label={`Duplicate ${summary.title}`}><Copy /><span>Duplicate</span></button><button type="button" className="danger" onClick={onRemove} aria-label={`Remove ${summary.title}`}><Trash /><span>Remove</span></button></div></div> : null}</div>;
}

function ThemeEditor({ theme, onChange }: { theme: StudioDocument["theme"]; onChange: (theme: StudioDocument["theme"]) => void }) {
  const active = theme.presets.find((preset) => preset.id === theme.activePreset) ?? theme.presets[0];
  const updatePreset = (nextPreset: StudioThemePreset) => onChange({ ...theme, presets: theme.presets.map((preset) => preset.id === nextPreset.id ? nextPreset : preset) });
  return <div className="studio-theme-editor"><fieldset className="studio-theme-presets"><legend>Color preset</legend>{theme.presets.map((preset) => <button type="button" key={preset.id} className={theme.activePreset === preset.id ? "selected" : ""} onClick={() => onChange({ ...theme, activePreset: preset.id })}><span className="studio-theme-swatches">{Object.values(preset.tokens).slice(0, 4).map((color, index) => <i key={`${color}-${index}`} style={{ background: validCssColor(color) ? color : "#ffffff" }} />)}</span><strong>{preset.label}</strong>{theme.activePreset === preset.id ? <CheckCircle weight="fill" /> : null}</button>)}</fieldset>{active ? <div className="studio-object-fields nested"><ValueEditor label="Preset name" value={active.label} path={["label"]} onChange={(_, value) => updatePreset({ ...active, label: String(value) })} depth={1} />{Object.entries(active.tokens).map(([token, color]) => <ValueEditor key={token} label={humanize(token)} value={color} path={[token]} onChange={(_, value) => updatePreset({ ...active, tokens: { ...active.tokens, [token]: String(value) } })} depth={1} />)}</div> : null}</div>;
}

function ReviewSummary({ check, detailed = false }: { check: ReviewCheck; detailed?: boolean }) {
  const Icon = check.level === "error" ? XCircle : check.level === "warning" ? WarningCircle : CheckCircle;
  return <div className={`studio-check ${check.level}`}><Icon weight="fill" /><span><strong>{check.label}</strong><small>{check.detail}</small>{detailed && check.items?.length ? <ul className="studio-check-items">{check.items.slice(0, 5).map((item) => <li key={item}>{item}</li>)}{check.items.length > 5 ? <li>And {check.items.length - 5} more</li> : null}</ul> : null}</span></div>;
}

function HistoryDrawer({ close, onRestore, canRestore, beforeRestore, onConflict }: { close: () => void; onRestore: (record: StudioRecord) => void; canRestore: boolean; beforeRestore: () => Promise<{ ok: true; lockVersion: number } | { ok: false; error: string }>; onConflict: () => Promise<void> }) {
  const [revisions, setRevisions] = useState<StudioRevision[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const loadRevisions = useCallback(async (offset = 0) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/studio/revisions?limit=50&offset=${offset}`, { cache: "no-store" });
      if (response.status === 401) { window.location.assign("/studio/login"); return; }
      const payload = await response.json() as { revisions?: StudioRevision[]; nextOffset?: number | null; error?: string };
      if (!response.ok) { setError(payload.error ?? "Version history could not be loaded."); return; }
      setRevisions((current) => offset === 0 ? payload.revisions ?? [] : [...current, ...(payload.revisions ?? [])]);
      setNextOffset(payload.nextOffset ?? null);
    } catch { setError("Version history could not be loaded."); } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => void loadRevisions(), 0);
    return () => window.clearTimeout(timer);
  }, [loadRevisions]);
  const restore = async (revision: StudioRevision) => {
    if (!window.confirm("Restore this version as the current draft? Your public website will stay unchanged until you publish.")) return;
    const prepared = await beforeRestore();
    if (!prepared.ok) { setError(prepared.error); return; }
    try {
      const response = await fetch(`/api/studio/revisions/${revision.id}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lockVersion: prepared.lockVersion }),
      });
      const payload = await response.json() as DocumentResponse;
      if (response.status === 409) {
        await onConflict();
        setError(payload.error ?? "This draft changed in another window. The latest draft has been reloaded; select a version again if you still want to restore it.");
        return;
      }
      if (!response.ok || !payload.document) { setError(payload.error ?? "This version could not be restored."); return; }
      onRestore(payload.document); close();
    } catch { setError("This version could not be restored. Check your connection and try again."); }
  };
  return <DialogFrame close={close} label="Version history" drawer><p className="studio-eyebrow">Version history</p><h2>Bring back an earlier draft</h2><p className="studio-muted">Restoring creates a new draft. The public site stays unchanged until you publish.</p>{loading && !revisions.length ? <p className="studio-muted">Loading saved versions…</p> : error ? <p className="studio-form-error" role="alert">{error}</p> : revisions.length ? revisions.map((revision) => <div className="studio-version" key={revision.id}><ClockCounterClockwise /><span>{revision.label ?? "Saved version"}<small>{new Date(revision.createdAt).toLocaleString()}</small></span><button onClick={() => void restore(revision)} disabled={!canRestore}>Restore</button></div>) : <p className="studio-empty-note">No earlier versions have been saved yet.</p>}{nextOffset !== null ? <button className="studio-primary-button" disabled={loading} onClick={() => void loadRevisions(nextOffset)}>{loading ? "Loading…" : "Load more versions"}</button> : null}{!canRestore ? <p className="studio-muted">A publisher or administrator can restore earlier versions.</p> : null}</DialogFrame>;
}

function MediaDialog({ close, onUse }: { close: () => void; onUse: (url: string) => boolean }) {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true); setMessage("");
    const form = new FormData(); form.set("file", file);
    try {
      const response = await fetch("/api/studio/media", { method: "POST", body: form });
      if (response.status === 401) { window.location.assign("/studio/login"); return; }
      const payload = await response.json() as { url?: string; error?: string };
      if (!response.ok || !payload.url) setMessage(payload.error ?? "That image could not be uploaded.");
      else { setUrl(payload.url); setMessage("Upload complete."); }
    } catch { setMessage("That image could not be uploaded. Check your connection and try again."); }
    finally { setUploading(false); }
  };
  const copy = async () => { try { await navigator.clipboard.writeText(url); setMessage("Image URL copied."); } catch { setMessage("Select and copy the URL below."); } };
  const use = () => { if (!onUse(url)) setMessage("Choose an image field in the inspector first, or copy this URL into one."); };
  return <DialogFrame close={close} label="Media library"><p className="studio-eyebrow">Media library</p><h2>Upload a website image</h2><p className="studio-muted">JPEG, PNG, or WebP, up to 8 MB. Studio optimizes it for the website.</p><label className="studio-upload"><UploadSimple /> {uploading ? "Uploading…" : "Choose an image"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} hidden onChange={(event) => void upload(event.target.files?.[0])} /></label>{url ? <div className="studio-upload-result"><label>Uploaded image URL<input value={url} readOnly onFocus={(event) => event.currentTarget.select()} /></label><div><button onClick={() => void copy()}><Copy /> Copy URL</button><button className="studio-primary-button" onClick={use}>Use in selected content</button></div></div> : null}{message ? <p className="studio-muted" role="status">{message}</p> : null}</DialogFrame>;
}

function PublishDialog({ close, allowed, checks, blocked, onPublish }: { close: () => void; allowed: boolean; checks: ReviewCheck[]; blocked: boolean; onPublish: () => Promise<{ ok: boolean; error: string }> }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const publish = async () => { setBusy(true); setError(""); const result = await onPublish(); if (result.ok) close(); else { setError(result.error); setBusy(false); } };
  const totals = totalsFor(checks);
  return <DialogFrame close={close} label="Publish review"><p className="studio-eyebrow">Publish review</p><h2>{totals.error ? "A few things need attention" : "One last look before this goes live"}</h2><p className="studio-muted">The public website stays unchanged until publishing finishes successfully.</p><div className="studio-publish-counts"><span className="pass"><CheckCircle weight="fill" />{totals.pass} passed</span><span className="warning"><WarningCircle weight="fill" />{totals.warning} warnings</span><span className="error"><XCircle weight="fill" />{totals.error} errors</span></div><div className="studio-publish-checks">{checks.map((check) => <ReviewSummary key={check.label} check={check} detailed />)}</div>{!allowed ? <p className="studio-form-error">Your editor role can save drafts. A publisher or administrator must publish them.</p> : null}{error ? <p className="studio-form-error" role="alert">{error}</p> : null}<button className="studio-publish-button" onClick={() => void publish()} disabled={!allowed || blocked || busy}><PaperPlaneTilt weight="fill" />{busy ? "Saving and publishing…" : "Publish website"}</button></DialogFrame>;
}

function DialogFrame({ close, label, drawer = false, children }: { close: () => void; label: string; drawer?: boolean; children: React.ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeHandlerRef = useRef(close);
  useEffect(() => { closeHandlerRef.current = close; }, [close]);
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeHandlerRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable.at(-1) ?? first;
      const activeIsFocusable = document.activeElement instanceof HTMLElement && focusable.includes(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || !activeIsFocusable)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !activeIsFocusable)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previousFocus?.focus();
    };
  }, []);
  return <div className="studio-overlay" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) close(); }}><section ref={dialogRef} className={drawer ? "studio-drawer" : "studio-modal"} role="dialog" aria-modal="true" aria-label={label}><button ref={closeRef} className="studio-close" onClick={close}><X /> Close</button>{children}</section></div>;
}

function getAtPath(root: unknown, path: EditorPath): unknown { return path.reduce((value, key) => value !== null && typeof value === "object" ? (value as Record<string | number, unknown>)[key] : undefined, root); }
function setAtPath(root: unknown, path: EditorPath, value: unknown) { if (!path.length) return; const parent = getAtPath(root, path.slice(0, -1)); if (parent !== null && typeof parent === "object") (parent as Record<string | number, unknown>)[path.at(-1) as string | number] = value; }
function pathsEqual(left: EditorPath, right: EditorPath) { return left.length === right.length && left.every((part, index) => part === right[index]); }
function draftPreviewUrl(route: string) { const [pathname, query = ""] = route.split("?", 2); const params = new URLSearchParams(query); params.set("studio", "1"); params.set("draft", "1"); return `${pathname}?${params.toString()}`; }
function humanize(value: string) { return value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function singular(value: string) { return value.replace(/ies$/i, "y").replace(/s$/i, "").toLowerCase(); }
function valueKind(value: unknown) { return Array.isArray(value) ? `${value.length} items` : value !== null && typeof value === "object" ? "Group" : typeof value === "string" ? (/^(https?:|\/)/i.test(value) ? "Link" : "Text") : humanize(typeof value); }
function initials(name: string) { return name.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "ST"; }
function looksLikeColor(key: string, value: string) { return /(color|primary|accent|surface|ink|background)/i.test(key) && validHex(value); }
function validHex(value: string) { return /^#[0-9a-f]{6}$/i.test(value); }
function validCssColor(value: string) { return validHex(value) || /^#[0-9a-f]{3}$/i.test(value); }
function itemTitle(item: unknown, index: number) { if (item && typeof item === "object") { const record = item as Record<string, unknown>; const title = record.title ?? record.label ?? record.name ?? record.caption ?? record.role ?? record.alt ?? record.id; if (typeof title === "string" && title.trim()) return shorten(title, 52); if (typeof record.src === "string" && record.src.trim()) return fileName(record.src); } if (typeof item === "string" && item.trim()) return shorten(item, 42); return `Item ${index + 1}`; }
function blankLike(value: unknown): unknown { if (Array.isArray(value)) return []; if (value !== null && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, /^(id|slug)$/i.test(key) ? `new-${Date.now()}` : blankLike(item)])); if (typeof value === "boolean") return false; if (typeof value === "number") return 0; return ""; }
function newCollectionItem(path: EditorPath, values: unknown[]): unknown | undefined {
  const key = String(path.at(-1) ?? "").toLowerCase();
  if (["hobbies", "favoriteartists", "stickers"].includes(key)) return "";
  if (["primary", "more"].includes(key)) return { label: "", href: "/" };
  if (key === "meetingslides") return { date: "", title: "", url: "", platform: "google" };
  if (key === "events") return { name: "", canvaUrl: null };
  if (["photos", "scrapbook"].includes(key)) return { src: "", alt: "", caption: "" };
  if (key === "seasons") return { id: `season-${Date.now()}`, title: "", note: "", albums: [] };
  if (key === "albums") return { title: "", photos: [] };
  if (key === "placements") return { place: "", event: "" };
  if (key === "points") return { title: "", text: "" };
  if (key === "achievements") return { stat: "", text: "" };
  if (key === "stackcards") return { label: "", photo: "", alt: "" };
  if (key === "officers") return { name: "", role: "", shortRole: "", group: "directors", photo: "", alt: "", grade: "", hobbies: [], favoriteArtists: [] };
  return values.length ? blankLike(values.at(-1)) : undefined;
}
let editorCardSequence = 0;
function nextEditorCardKey() { editorCardSequence += 1; return `studio-card-${editorCardSequence}`; }
function collectionItemNoun(path: EditorPath, fallback: string) { const key = String(path.at(-1) ?? "").toLowerCase(); if (["photos", "scrapbook"].includes(key)) return "photo"; if (key === "seasons") return "school year"; if (key === "albums") return "album"; if (key === "events") return "event slideshow"; if (key === "officers") return "officer"; return singular(fallback); }
function collectionItemSummary(item: unknown, index: number, path: EditorPath) {
  const noun = collectionItemNoun(path, "item");
  if (!item || typeof item !== "object" || Array.isArray(item)) return { title: itemTitle(item, index), meta: `${humanize(noun)} ${index + 1}` };
  const record = item as Record<string, unknown>;
  const text = (key: string) => typeof record[key] === "string" ? String(record[key]).trim() : "";
  if (Array.isArray(record.albums)) return { title: itemTitle(item, index).replace(/^Item \d+$/, `School year ${index + 1}`), meta: `${record.albums.length} album${record.albums.length === 1 ? "" : "s"}` };
  if (Array.isArray(record.photos)) return { title: itemTitle(item, index).replace(/^Item \d+$/, `Album ${index + 1}`), meta: `${record.photos.length} photo${record.photos.length === 1 ? "" : "s"}` };
  if (typeof record.src === "string") return { title: itemTitle(item, index).replace(/^Item \d+$/, `Photo ${index + 1}`), meta: `Photo ${index + 1}` };
  if (typeof record.photo === "string") return { title: itemTitle(item, index).replace(/^Item \d+$/, `Officer ${index + 1}`), meta: typeof record.role === "string" && record.role.trim() ? record.role : "Officer profile" };
  if ("canvaUrl" in record) return { title: itemTitle(item, index).replace(/^Item \d+$/, `Slideshow ${index + 1}`), meta: typeof record.canvaUrl === "string" && record.canvaUrl.trim() ? "Slideshow linked" : "Needs slideshow link" };
  if (text("stat") || text("text")) return { title: shorten([text("stat"), text("text")].filter(Boolean).join(" — "), 52), meta: "Achievement" };
  if (text("place") || text("event")) return { title: shorten([text("place"), text("event")].filter(Boolean).join(" — "), 52), meta: "Placement" };
  if (text("title") && text("date")) return { title: shorten(text("title"), 52), meta: text("date") };
  if (text("title") && text("text")) return { title: shorten(text("title"), 52), meta: shorten(text("text"), 52) };
  if (text("label")) return { title: shorten(text("label"), 52), meta: `Open to edit ${noun}` };
  return { title: itemTitle(item, index), meta: `Open to edit ${noun}` };
}
function collectionItemImage(item: unknown) { if (!item || typeof item !== "object" || Array.isArray(item)) return null; const record = item as Record<string, unknown>; const value = typeof record.src === "string" ? record.src : typeof record.photo === "string" ? record.photo : ""; return isSafeImageSrc(value) ? value : null; }
function siblingValues(siblings: unknown[], field: string) { return new Set(siblings.flatMap((item) => item && typeof item === "object" && !Array.isArray(item) && typeof (item as Record<string, unknown>)[field] === "string" ? [String((item as Record<string, unknown>)[field])] : [])); }
function uniqueCopyValue(value: string, existing: Set<string>, separator = " copy") { const base = `${value}${separator}`; let suffix = 1; let candidate = base; while (existing.has(candidate)) candidate = `${base} ${++suffix}`; return candidate; }
function cloneForDuplicate(value: unknown, siblings: unknown[]): unknown { const clone = structuredClone(value); if (clone && typeof clone === "object" && !Array.isArray(clone)) { const record = clone as Record<string, unknown>; if (typeof record.id === "string") record.id = uniqueCopyValue(record.id, siblingValues(siblings, "id"), "-copy"); if (typeof record.name === "string") record.name = uniqueCopyValue(record.name, siblingValues(siblings, "name")); if (typeof record.title === "string") record.title = uniqueCopyValue(record.title, siblingValues(siblings, "title")); } return clone; }
function nearestSectionKey(keys: string[], idParts: string[]) { if (idParts.includes("highlights")) return undefined; const aliases: Record<string, string[]> = { photoStack: ["stackCards"], collection: ["officers"], items: ["officers"], decks: ["meetingSlides", "ceg"], schedule: ["calendarEmbedSrc"], registration: ["links"], dues: ["links"], details: ["email", "address", "socials"] }; for (const part of idParts) { const direct = keys.find((key) => key.toLowerCase() === part.toLowerCase()); if (direct) return direct; for (const candidate of aliases[part] ?? []) if (keys.includes(candidate)) return candidate; } return keys.find((key) => idParts.some((part) => normalize(key).includes(normalize(part)) || normalize(part).includes(normalize(key)))); }
function normalize(value: string) { return value.replace(/[^a-z0-9]/gi, "").toLowerCase(); }
function fieldHelp(key: string) { if (/^alt$/i.test(key)) return "Briefly describe what is visible for members who use screen readers."; if (/^(src|photo|image)$/i.test(key)) return "Use a website image path or upload an image from the Media library."; if (/registrationForm/i.test(key)) return "Leave this blank while registration is closed."; if (/canvaUrl/i.test(key)) return "Paste the share link for this Canva presentation."; return ""; }
function shorten(value: string, length: number) { const clean = value.trim().replace(/\s+/g, " "); return clean.length > length ? `${clean.slice(0, length - 1)}…` : clean; }
function fileName(value: string) { const clean = value.split(/[?#]/, 1)[0]; const name = clean.split("/").filter(Boolean).at(-1) ?? "Photo"; let decoded = name; try { decoded = decodeURIComponent(name); } catch { /* Keep a malformed legacy filename readable instead of breaking Studio. */ } return shorten(decoded.replace(/[-_]+/g, " ").replace(/\.[a-z0-9]+$/i, ""), 52); }
function selectOptions(key: string, value: string) { if (/^grade$/i.test(key)) return ["", "Sophomore", "Junior", "Senior"]; if (/^group$/i.test(key)) return ["exec", "directors"]; if (/^platform$/i.test(key)) return ["canva", "google"]; if (/^(target|openIn)$/i.test(key)) return ["same tab", "new tab"]; return value === "exec" || value === "directors" ? ["exec", "directors"] : null; }
function isMediaFieldKey(key: string) { return /(image|photo|portrait|cover|thumbnail|avatar|src)/i.test(key); }
function findMediaFieldPath(value: unknown, path: EditorPath = []): EditorPath | null { if (typeof value === "string" && isMediaFieldKey(String(path.at(-1)))) return path; if (Array.isArray(value)) { for (let index = 0; index < value.length; index += 1) { const found = findMediaFieldPath(value[index], [...path, index]); if (found) return found; } } else if (value && typeof value === "object") { for (const [key, item] of Object.entries(value as Record<string, unknown>).sort(([key]) => isMediaFieldKey(key) ? -1 : 1)) { if (!isMediaFieldKey(key)) continue; const found = findMediaFieldPath(item, [...path, key]); if (found) return found; } } return null; }

function inspectDocument(document: StudioDocument): ReviewCheck[] {
  const pageErrors: string[] = [];
  const linkErrors: string[] = [];
  const altWarnings: string[] = [];
  const contentWarnings: string[] = [];
  const schemaResult = studioDocumentSchema.safeParse(document);
  if (!schemaResult.success) pageErrors.push(...schemaResult.error.issues.map((issue) => `${friendlyReviewPath(issue.path)}: ${issue.message}`));
  const pages = Object.entries(document.pages);
  if (!pages.length) pageErrors.push("no pages");
  for (const [key, page] of pages) {
    if (!page.title.trim()) pageErrors.push(`${humanize(key)} needs a title`);
    if (!page.route.startsWith("/")) pageErrors.push(`${humanize(key)} needs a valid route`);
    if (!page.description.trim()) contentWarnings.push(`${humanize(key)} needs a description`);
  }
  if (!document.theme.presets.some((preset) => preset.id === document.theme.activePreset)) pageErrors.push("active theme preset is missing");
  walkDocument(document, [], (value, path, parent) => {
    if (!isStudioReviewPathRelevant(path)) return;
    const key = String(path.at(-1) ?? "");
    if (typeof value === "string") {
      const record = parent && typeof parent === "object" && !Array.isArray(parent) ? parent as Record<string, unknown> : undefined;
      const isOfficerField = Boolean(record && "group" in record && "photo" in record && /^(name|role|shortRole|alt)$/i.test(key));
      const isGalleryIdentity = Boolean(record && (("albums" in record && /^(id|title)$/i.test(key)) || ("photos" in record && /^title$/i.test(key)) || (("src" in record || "photo" in record) && /^alt$/i.test(key))));
      if (!value.trim() && (isOfficerField || isGalleryIdentity)) pageErrors.push(friendlyReviewPath(path));
      if (/^(src|photo|portrait|cover|thumbnail|avatar)$/i.test(key) && !isSafeImageSrc(value)) pageErrors.push(friendlyReviewPath(path));
      if (isStudioLinkField(key) && value.trim() && !isValidStudioLink(key, value)) linkErrors.push(friendlyReviewPath(path));
      if (!value.trim() && /(title|label|name|heading|description|alt)$/i.test(key)) contentWarnings.push(friendlyReviewPath(path));
      if ((/\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(value) || /^\/api\/studio\/media\/[0-9a-f-]{36}(?:\?.*)?$/i.test(value)) && parent && typeof parent === "object" && !Array.isArray(parent)) {
        const alternative = record?.alt ?? record?.label ?? record?.caption ?? record?.name ?? record?.title ?? record?.description;
        if (typeof alternative !== "string" || !alternative.trim()) altWarnings.push(friendlyReviewPath(path));
      }
    }
  });
  return [
    { label: "Document structure", level: pageErrors.length ? "error" : "pass", count: pageErrors.length || 1, detail: pageErrors.length ? `${pageErrors.length} required fix${pageErrors.length === 1 ? "" : "es"}` : `${pages.length} pages are complete`, items: pageErrors },
    { label: "Links", level: linkErrors.length ? "error" : "pass", count: linkErrors.length || 1, detail: linkErrors.length ? `${linkErrors.length} invalid link${linkErrors.length === 1 ? "" : "s"}` : "All saved links use valid addresses", items: linkErrors },
    { label: "Image descriptions", level: altWarnings.length ? "warning" : "pass", count: altWarnings.length || 1, detail: altWarnings.length ? `${altWarnings.length} image${altWarnings.length === 1 ? "" : "s"} may need a label` : "Images have a label, caption, or description", items: altWarnings },
    { label: "Content completeness", level: contentWarnings.length ? "warning" : "pass", count: contentWarnings.length || 1, detail: contentWarnings.length ? `${contentWarnings.length} empty recommended field${contentWarnings.length === 1 ? "" : "s"}` : "Required text is filled in", items: contentWarnings },
  ];
}

function friendlyReviewPath(path: ReadonlyArray<PropertyKey>) {
  const pageKey = path[0] === "pages" ? String(path[1] ?? "") : "";
  const parts = path.flatMap((part, index) => {
    if ((index === 0 && part === "pages") || part === "sections") return [];
    if (index === 1 && pageKey) return [studioPageLabel(pageKey, humanize(pageKey))];
    if (typeof part === "number") return [`Item ${part + 1}`];
    if (index === 3 && path[2] === "sections" && pageKey) return [studioSectionLabel(pageKey, String(part))];
    const editorPath = path.slice(0, index + 1).map((item) => typeof item === "number" ? item : String(item));
    return [studioFieldLabel(editorPath, humanize(String(part)))];
  });
  return parts.join(" › ") || "Document";
}

function walkDocument(value: unknown, path: EditorPath, visit: (value: unknown, path: EditorPath, parent: unknown) => void, parent?: unknown) { visit(value, path, parent); if (Array.isArray(value)) value.forEach((item, index) => walkDocument(item, [...path, index], visit, value)); else if (value && typeof value === "object") Object.entries(value as Record<string, unknown>).forEach(([key, item]) => walkDocument(item, [...path, key], visit, value)); }
function totalsFor(checks: ReviewCheck[]) { return checks.reduce((totals, check) => ({ ...totals, [check.level]: totals[check.level] + (check.level === "pass" ? 1 : check.count) }), { pass: 0, warning: 0, error: 0 } as Record<ReviewLevel, number>); }
