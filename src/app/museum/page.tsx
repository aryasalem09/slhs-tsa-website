import { permanentRedirect } from "next/navigation";

/** The museum now lives on the combined CEG page. */
export default function MuseumRedirect() {
  permanentRedirect("/ceg#museum");
}
