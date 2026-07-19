import { isSupabaseConfigured } from "@/lib/supabase/env";
import StudioLoginForm from "@/components/studio/StudioLoginForm";

export const metadata = { title: "Studio login | SLHS TSA" };

export default function StudioLoginPage() {
  const configured = isSupabaseConfigured();
  return (
    <div className="studio-login-page">
      {configured ? <StudioLoginForm /> : <section className="studio-login-card"><div className="studio-login-mark" aria-hidden="true">!</div><p className="studio-eyebrow">SLHS TSA</p><h1>Studio is not configured yet</h1><p className="studio-muted">Add the Supabase environment variables and provision the first administrator before signing in.</p></section>}
    </div>
  );
}
