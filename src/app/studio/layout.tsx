import type { Metadata } from "next";
import "./studio.css";

export const metadata: Metadata = {
  title: "Canvas Studio | SLHS TSA",
  description: "The SLHS TSA website editor.",
};

export default function StudioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="studio-root">{children}</div>;
}
