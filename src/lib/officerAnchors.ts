import type { Officer } from "@/content/site";

/** Stable fragment identifier shared by officer links and their card containers. */
export function officerAnchorId(officer: Pick<Officer, "name">): string {
  return `officer-${officer.name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}
