import { permanentRedirect } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/museum",
  title: "TSA Event Museum",
  description: "Browse documented SLHS TSA competition submissions in the Competitive Events Guide museum.",
});

export default function MuseumRedirect() {
  permanentRedirect("/ceg#museum");
}
