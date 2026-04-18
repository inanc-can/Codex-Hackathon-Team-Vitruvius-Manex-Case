import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/types";

type BadgeTone = "default" | "alert" | "success" | "muted" | "warning";
type ButtonVariant = "primary" | "secondary" | "tertiary";

export function buttonClassName({
  variant = "primary",
  size = "md",
}: {
  variant?: ButtonVariant;
  size?: "sm" | "md";
} = {}) {
  const sizeClass = size === "sm" ? "h-9 px-3.5 text-sm" : "h-10 px-4 text-sm";
  const variantClass =
    variant === "secondary"
      ? "border border-[#d7deea] bg-white text-[#0f172a] hover:bg-[#eef2f7]"
      : variant === "tertiary"
        ? "border border-transparent bg-transparent text-[#0B5FFF] hover:bg-[#e8efff]"
        : "border border-[#0B5FFF] bg-[#0B5FFF] text-white hover:bg-[#0949c7]";

  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[8px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b3ccff]",
    sizeClass,
    variantClass,
  );
}

export function chipClassName(active: boolean) {
  return cn(
    "inline-flex items-center rounded-[8px] border px-3 py-2 text-sm font-medium transition",
    active
      ? "border-[#0B5FFF] bg-[#0B5FFF] text-white"
      : "border-[#d7deea] bg-white text-[#5b6474] hover:bg-[#eef2f7] hover:text-[#0f172a]",
  );
}

export function severityTone(severity: Severity): BadgeTone {
  if (severity === "critical") {
    return "alert";
  }

  if (severity === "high") {
    return "warning";
  }

  if (severity === "medium") {
    return "default";
  }

  return "muted";
}

export function PageShell({
  children,
  header,
}: {
  children: ReactNode;
  header?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(11,95,255,0.08),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(0,91,74,0.06),_transparent_40%),linear-gradient(180deg,#f2f5f9_0%,#edf2f7_48%,#f2f5f9_100%)] text-[#0f172a]">
      {header}
      <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-8 px-5 pb-12 pt-6 sm:px-8">
        {children}
      </main>
    </div>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[12px] border border-[#d7deea] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {eyebrow ? (
        <p className="text-[12px] font-medium text-[#0B5FFF]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight text-[#0f172a]">
        {title}
      </h2>
      {body ? <p className="max-w-3xl text-sm text-[#5b6474]">{body}</p> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  const toneClass =
    tone === "alert"
      ? "border-[#f9d3cf] bg-[#fff1f0] text-[#b42318]"
      : tone === "warning"
        ? "border-[#f3d7aa] bg-[#fff7eb] text-[#8a4b00]"
      : tone === "success"
        ? "border-[#b9e4da] bg-[#edf8f5] text-[#005B4A]"
        : tone === "muted"
          ? "border-[#d7deea] bg-[#eef2f7] text-[#5b6474]"
          : "border-[#c9d8ff] bg-[#e8efff] text-[#0B5FFF]";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[8px] border px-2.5 py-1 text-[12px] font-medium",
        toneClass,
      )}
    >
      {children}
    </span>
  );
}

export function LabelValue({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[12px] font-medium text-[#5b6474]">{label}</p>
      <div className="text-sm font-medium text-[#0f172a]">{value}</div>
    </div>
  );
}

export function KpiTile({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "alert" | "success";
}) {
  return (
    <div
      className={cn(
        "rounded-[12px] border p-4",
        tone === "alert"
          ? "border-[#f9d3cf] bg-[#fff2f0]"
          : tone === "success"
            ? "border-[#b9e4da] bg-[#edf8f5]"
            : "border-[#d7deea] bg-[#f7f9fc]",
      )}
    >
      <p className="text-[12px] font-medium text-[#5b6474]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[#0f172a] tabular-nums">
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-[#5b6474]">{hint}</p> : null}
    </div>
  );
}
