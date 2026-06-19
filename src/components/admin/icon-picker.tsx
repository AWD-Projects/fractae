"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";

const ALL_ICONS = (Object.keys(LucideIcons) as string[]).filter(
  k =>
    k.charCodeAt(0) >= 65 && k.charCodeAt(0) <= 90 &&
    !k.endsWith("Icon") &&
    k !== "LucideProvider" &&
    !k.startsWith("create") &&
    !k.startsWith("use")
);

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat), sans-serif",
  fontSize: 12,
  fontWeight: 600,
  color: "#434652",
};

interface IconPickerProps {
  value: string;
  onChange: (name: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return ALL_ICONS.slice(0, 90);
    return ALL_ICONS.filter(n => n.toLowerCase().includes(q)).slice(0, 90);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const SelectedIcon = value
    ? (LucideIcons[value as keyof typeof LucideIcons] as LucideIcon | undefined)
    : undefined;

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <label style={labelStyle}>Ícono</label>

      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          borderRadius: 8,
          border: open ? "1.5px solid #00399d" : "1px solid #d9d9d9",
          padding: "10px 14px",
          background: "#fff",
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 14,
          color: value ? "#062244" : "#b3b3b3",
          cursor: "pointer",
          textAlign: "left",
          boxSizing: "border-box",
        }}
      >
        {SelectedIcon
          ? <SelectedIcon size={16} strokeWidth={1.5} style={{ color: "#062244", flexShrink: 0 }} />
          : <div style={{ width: 16, height: 16, flexShrink: 0 }} />
        }
        <span style={{ flex: 1 }}>{value || "Seleccionar ícono..."}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.4, transform: open ? "rotate(180deg)" : undefined, transition: "transform 200ms" }}>
          <path d="M2 4l4 4 4-4" stroke="#062244" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 200,
            background: "#fff",
            borderRadius: 10,
            border: "1px solid #e0e0e0",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            padding: 12,
          }}
        >
          <div style={{ position: "relative", marginBottom: 10 }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#b3b3b3",
                pointerEvents: "none",
              }}
            />
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar ícono..."
              style={{
                width: "100%",
                borderRadius: 6,
                border: "1px solid #e0e0e0",
                padding: "8px 10px 8px 32px",
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 13,
                color: "#062244",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px 0",
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 13,
                color: "#b3b3b3",
              }}
            >
              No se encontraron íconos
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 3,
                maxHeight: 216,
                overflowY: "auto",
              }}
            >
              {filtered.map(name => {
                const Icon = LucideIcons[name as keyof typeof LucideIcons] as LucideIcon;
                const selected = name === value;
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => { onChange(name); setOpen(false); setQuery(""); }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 3,
                      padding: "7px 3px 5px",
                      borderRadius: 6,
                      border: "none",
                      cursor: "pointer",
                      background: selected ? "#00399d" : "transparent",
                      color: selected ? "#fff" : "#434652",
                      transition: "background 120ms",
                    }}
                    onMouseEnter={e => {
                      if (!selected) (e.currentTarget as HTMLElement).style.background = "#f0f4ff";
                    }}
                    onMouseLeave={e => {
                      if (!selected) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    <span
                      style={{
                        fontSize: 8,
                        lineHeight: 1.2,
                        textAlign: "center",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        wordBreak: "break-all",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        width: "100%",
                      }}
                    >
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <p
            style={{
              marginTop: 8,
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 10,
              color: "#b3b3b3",
              textAlign: "center",
            }}
          >
            {query ? `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}` : `${ALL_ICONS.length} íconos disponibles — escribe para filtrar`}
          </p>
        </div>
      )}
    </div>
  );
}
