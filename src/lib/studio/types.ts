export const STUDIO_DOCUMENT_VERSION = 1 as const;

export type StudioRole = "admin" | "publisher" | "editor";
export type StudioDocumentKind = "draft" | "published";

export type StudioPage = {
  route: string;
  title: string;
  description: string;
  sections: Record<string, unknown>;
};

/** The persisted, versioned contract shared by Studio and the public renderer. */
export type StudioDocument = {
  version: typeof STUDIO_DOCUMENT_VERSION;
  site: Record<string, unknown>;
  navigation: { primary: unknown[]; more: unknown[] };
  pages: Record<string, StudioPage>;
  theme: { activePreset: string; presets: StudioThemePreset[] };
  updatedAt: string;
};

export type StudioThemePreset = {
  id: string;
  label: string;
  tokens: Record<string, string>;
};

export type StudioRecord = {
  id: string;
  kind: StudioDocumentKind;
  document: StudioDocument;
  lockVersion: number;
  updatedAt: string;
  updatedBy: string | null;
};

export type StudioRevision = {
  id: string;
  createdAt: string;
  createdBy: string | null;
  label: string | null;
};

export type StudioSession = {
  userId: string;
  username: string;
  displayName: string | null;
  role: StudioRole;
};

export const STUDIO_ROLES: readonly StudioRole[] = ["admin", "publisher", "editor"];

export const permissions: Record<string, readonly StudioRole[]> = {
  read: ["admin", "publisher", "editor"],
  edit: ["admin", "publisher", "editor"],
  publish: ["admin", "publisher"],
  manageUsers: ["admin"],
};

export function can(role: StudioRole, permission: keyof typeof permissions) {
  return permissions[permission].includes(role);
}
