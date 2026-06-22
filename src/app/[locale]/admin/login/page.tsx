"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const locale = useLocale();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }
    router.push(`/${locale}/admin`);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── LEFT PANEL — desktop only ── */}
      <div
        className="hidden md:relative md:flex md:flex-1 items-center justify-center overflow-hidden"
        style={{ background: "#062244", padding: "0 48px" }}
      >
        {/* Atmospheric blur spheres */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 400, height: 400, left: -80, top: -80, background: "#2ab8ff1a", filter: "blur(70px)" }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 300, height: 300, right: -40, bottom: 80, background: "#00399d33", filter: "blur(52.5px)" }}
        />

        {/* Radial gradient overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 141% 141% at 50% 50%, #00399d80 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 283% 283% at 0% 0%, #27b8ff4d 0%, transparent 50%)" }}
        />

        {/* Logo + tagline */}
        <div className="relative z-10 flex flex-col items-center" style={{ gap: 16 }}>
          <div style={{ filter: "brightness(0) invert(1)" }}>
            <Logo width={270} />
          </div>
          <p
            className="text-center"
            style={{
              color: "#ffffff80",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 12,
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: "0.08em",
            }}
          >
            PANEL DE ADMINISTRACIÓN
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="flex-1 flex items-center justify-center"
        style={{ background: "#ffffff", padding: "32px 24px" }}
      >
        <div style={{ width: "100%", maxWidth: 380, gap: 32 }} className="flex flex-col">

          {/* Logo — mobile only */}
          <div className="flex md:hidden justify-center" style={{ marginBottom: 4 }}>
            <Logo width={160} />
          </div>

          {/* Header */}
          <div className="flex flex-col" style={{ gap: 7 }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 11,
                fontWeight: 400,
                color: "#062244",
                lineHeight: 1.5,
                letterSpacing: "0.06em",
              }}
            >
              BIENVENIDO
            </p>
            <h1
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#062244",
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              Inicia sesión
            </h1>
            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 13,
                fontWeight: 400,
                color: "#b3b3b3",
                lineHeight: 1.5,
              }}
            >
              Accede al panel de FRACTAE
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 24 }}>

            <Input
              id="email"
              type="email"
              label="Correo electrónico"
              placeholder="admin@fractae.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            {/* Password with show/hide toggle */}
            <div className="w-full flex flex-col gap-1.5">
              <label htmlFor="password" className="text-body-sm font-medium text-navy">
                Contraseña
              </label>
              <div className="relative w-full">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className={cn(
                    "w-full rounded-sm bg-white",
                    "px-4 py-3 pr-11",
                    "text-body-md text-navy font-normal",
                    "placeholder:text-gray",
                    "border border-[#d9d9d9]",
                    "outline-none transition-colors duration-200",
                    "focus:border-primary focus:border-[1.5px]",
                    "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
                    error && "border-error focus:border-error"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray hover:text-navy transition-colors"
                >
                  {showPassword
                    ? <EyeOff size={18} strokeWidth={1.75} />
                    : <Eye size={18} strokeWidth={1.75} />}
                </button>
              </div>
              {error && <p className="text-body-xs text-error">{error}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Iniciar sesión"}
            </Button>

          </form>
        </div>
      </div>

    </div>
  );
}
