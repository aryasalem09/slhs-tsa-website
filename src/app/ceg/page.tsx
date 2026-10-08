import { permanentRedirect } from "next/navigation";

export default function LegacyCegRedirect() {
  permanentRedirect("/museum");
}
