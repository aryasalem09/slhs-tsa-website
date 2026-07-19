import { z } from "zod";
import { STUDIO_DOCUMENT_VERSION, STUDIO_ROLES } from "./types";

const MAX_JSON_DEPTH = 12;
const MAX_JSON_NODES = 20_000;
const MAX_COLLECTION_ITEMS = 500;
const MAX_OBJECT_KEYS = 500;
const MAX_CONTENT_TEXT = 50_000;

const jsonValue: z.ZodType<unknown> = z.unknown().superRefine((value, context) => {
  const stack: Array<{ value: unknown; depth: number; ancestors: object[] }> = [{ value, depth: 0, ancestors: [] }];
  let nodes = 0;

  while (stack.length) {
    const current = stack.pop()!;
    nodes += 1;
    if (nodes > MAX_JSON_NODES) {
      context.addIssue({ code: "custom", message: "Content contains too many nested values" });
      return;
    }
    if (current.depth > MAX_JSON_DEPTH) {
      context.addIssue({ code: "custom", message: "Content is nested too deeply" });
      return;
    }
    if (current.value === null || typeof current.value === "boolean") continue;
    if (typeof current.value === "number") {
      if (!Number.isFinite(current.value)) context.addIssue({ code: "custom", message: "Content numbers must be finite" });
      continue;
    }
    if (typeof current.value === "string") {
      if (current.value.length > MAX_CONTENT_TEXT) context.addIssue({ code: "custom", message: "A content field is too long" });
      continue;
    }
    if (!current.value || typeof current.value !== "object") {
      context.addIssue({ code: "custom", message: "Content must be valid JSON" });
      return;
    }
    if (current.ancestors.includes(current.value)) {
      context.addIssue({ code: "custom", message: "Content cannot contain circular references" });
      return;
    }
    const ancestors = [...current.ancestors, current.value];

    if (Array.isArray(current.value)) {
      if (current.value.length > MAX_COLLECTION_ITEMS) {
        context.addIssue({ code: "custom", message: `Collections can contain at most ${MAX_COLLECTION_ITEMS} items` });
        return;
      }
      for (const item of current.value) stack.push({ value: item, depth: current.depth + 1, ancestors });
      continue;
    }

    const entries = Object.entries(current.value);
    if (entries.length > MAX_OBJECT_KEYS) {
      context.addIssue({ code: "custom", message: `Content groups can contain at most ${MAX_OBJECT_KEYS} fields` });
      return;
    }
    for (const [, item] of entries) stack.push({ value: item, depth: current.depth + 1, ancestors });
  }
});

const boundedRecord = z.record(z.string().max(160), jsonValue).superRefine((value, context) => {
  if (Object.keys(value).length > MAX_OBJECT_KEYS) context.addIssue({ code: "custom", message: `Content groups can contain at most ${MAX_OBJECT_KEYS} fields` });
});

export const studioDocumentSchema = z.object({
  version: z.literal(STUDIO_DOCUMENT_VERSION),
  site: boundedRecord,
  navigation: z.object({ primary: z.array(jsonValue).max(50), more: z.array(jsonValue).max(50) }),
  pages: z.record(z.string().max(80), z.object({ route: z.string().startsWith("/").max(200), title: z.string().min(1).max(160), description: z.string().max(500), sections: boundedRecord })).superRefine((value, context) => {
    if (Object.keys(value).length > 40) context.addIssue({ code: "custom", message: "A Studio document can contain at most 40 pages" });
  }),
  theme: z.object({
    activePreset: z.string().min(1).max(80),
    presets: z.array(z.object({
      id: z.string().min(1).max(80),
      label: z.string().min(1).max(120),
      tokens: z.record(z.string().max(80), z.string().max(256)).superRefine((value, context) => {
        if (Object.keys(value).length > 24) context.addIssue({ code: "custom", message: "A theme can contain at most 24 tokens" });
      }),
    })).min(1).max(12),
  }),
  updatedAt: z.string().datetime(),
});

export const saveDocumentSchema = z.object({ document: studioDocumentSchema, lockVersion: z.number().int().nonnegative() });
export const loginSchema = z.object({ username: z.string().trim().toLowerCase().min(3).max(64).regex(/^[a-z0-9._-]+$/), password: z.string().min(8).max(256) });
export const provisionUserSchema = z.object({ username: loginSchema.shape.username, password: z.string().min(12).max(256), role: z.enum(STUDIO_ROLES), displayName: z.string().trim().min(1).max(120) });

export const editorFields = [
  { path: "site.name", label: "Short name", control: "text", section: "Site settings" },
  { path: "site.fullName", label: "Full organization name", control: "text", section: "Site settings" },
  { path: "site.email", label: "Contact email", control: "email", section: "Site settings" },
  { path: "navigation.primary", label: "Primary navigation", control: "collection", section: "Navigation" },
  { path: "pages.home.sections", label: "Home page", control: "sections", section: "Pages" },
  { path: "pages.officers.sections.officers", label: "Officers", control: "collection", section: "Pages" },
  { path: "pages.gallery.sections", label: "Gallery", control: "sections", section: "Pages" },
  { path: "theme", label: "Theme", control: "theme", section: "Design" },
] as const;
