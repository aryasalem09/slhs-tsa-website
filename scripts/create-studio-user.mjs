import { createClient } from "@supabase/supabase-js";

async function readHiddenPassword() {
  if (process.env.STUDIO_USER_PASSWORD) return process.env.STUDIO_USER_PASSWORD;
  if (!process.stdin.isTTY || !process.stdout.isTTY || typeof process.stdin.setRawMode !== "function") return "";
  process.stdout.write("Studio password: ");
  process.stdin.setRawMode(true);
  process.stdin.setEncoding("utf8");
  process.stdin.resume();
  return new Promise((resolve) => {
    let password = "";
    const finish = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
      process.stdin.off("data", onData);
      resolve(password);
    };
    const onData = (input) => {
      if (input === "\u0003") process.exit(130);
      if (input === "\r" || input === "\n") return finish();
      if (input === "\u007f" || input === "\b") password = password.slice(0, -1);
      else if (!input.startsWith("\u001b")) password += input;
    };
    process.stdin.on("data", onData);
  });
}

const [username, role = "editor", ...name] = process.argv.slice(2);
const password = await readHiddenPassword();
const displayName = name.join(" ").trim();
const validRoles = new Set(["admin", "publisher", "editor"]);
const normalizedUsername = username?.toLowerCase();
if (!username || password.length < 12 || password.length > 256 || !displayName || !validRoles.has(role) || !/^[a-z0-9._-]{3,64}$/.test(normalizedUsername)) {
  console.error("Usage: node scripts/create-studio-user.mjs <username> <admin|publisher|editor> <display name>");
  console.error("Enter a 12+ character password at the hidden prompt, or provide STUDIO_USER_PASSWORD for noninteractive setup.");
  process.exit(1);
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRole) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required.");
  process.exit(1);
}
const email = `${normalizedUsername}@studio.slhstsa.invalid`;
const supabase = createClient(url, serviceRole, { auth: { autoRefreshToken: false, persistSession: false } });
const { data: existing } = await supabase.from("studio_profiles").select("id").eq("username", normalizedUsername).maybeSingle();
if (existing) {
  console.error("That Studio username is already provisioned.");
  process.exit(1);
}
const { data: created, error: createError } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
if (createError || !created.user) {
  console.error("Unable to create Studio user.");
  process.exit(1);
}
const { error: profileError } = await supabase.from("studio_profiles").insert({ id: created.user.id, username: normalizedUsername, email, display_name: displayName, role });
if (profileError) {
  await supabase.auth.admin.deleteUser(created.user.id);
  console.error("Unable to create Studio profile; the auth user was rolled back.");
  process.exit(1);
}
console.log(`Provisioned Studio ${role}: ${normalizedUsername}`);
