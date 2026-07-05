import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "TSA Museum",
  description: "The SLHS TSA chapter archive. Under construction.",
};

/*
 * TODO(museum): embed/link the preexisting Google Drive folder from 2022
 * (chapter archive) once it's cleaned up and share-safe.
 */
export default function MuseumPage() {
  return (
    <>
      <h1 className="sr-only">TSA Museum</h1>
      <UnderConstruction title="TSA MUSEUM" />
    </>
  );
}
