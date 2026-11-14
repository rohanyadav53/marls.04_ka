import { useState, type FormEvent } from "react";
import { useAuth } from "../auth";
import { ApiError } from "../api";
import { Button, ErrorNote, Field, inputClass } from "../components/ui";

/**
 * Sign-in screen.
 *
 * The server returns the same message for an unknown address and a wrong
 * password, and this screen shows exactly what it was given — guessing at a
 * friendlier message here would leak which admin addresses exist.
 */
export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not reach the server. Please check your connection.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <div className="font-display text-xl font-bold tracking-wide text-white">MARLSBORO</div>
          <div className="eyebrow mt-1 text-white/50">Admin Portal</div>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow-2xl sm:p-7" noValidate>
          <h1 className="font-display text-lg font-bold text-ink">Sign in</h1>

          <Field label="Email address">
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@marlsboro.com"
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••••••"
            />
          </Field>

          {error && <ErrorNote>{error}</ErrorNote>}

          <Button type="submit" busy={busy} className="w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-white/40">
          Authorised access only. Every sign-in is logged.
        </p>
      </div>
    </div>
  );
}
