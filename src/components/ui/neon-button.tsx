import React from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
  textColor?: string;
  borderStartColor?: string;
  borderEndColor?: string;
  backgroundColor?: string;
}

export function NeonButton({
  children,
  className,
  textColor = "#e0b3ff", // roxo claro para o texto
  borderStartColor = "#2a004f", // roxo escuro
  borderEndColor = "#a200ff", // roxo neon
  backgroundColor = "transparent",
  style,
  ...props
}: NeonButtonProps) {
  const buttonStyle = {
    "--border-start": borderStartColor,
    "--border-end": borderEndColor,
    "--text-color": textColor,
    "--bg-color": backgroundColor,
    ...style,
  } as React.CSSProperties;

  return (
    <a
      className={cn(
        "relative overflow-hidden px-8 py-3 text-sm rounded-[4px] uppercase tracking-[5px] no-underline shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
        "bg-[var(--bg-color)] text-[var(--text-color)]",
        className
      )}
      style={buttonStyle}
      {...props}
    >
      <span className="absolute left-0 top-0 h-[2px] w-full animate-[neonSlideRight_2s_linear_infinite_1s] bg-linear-to-r from-[var(--border-start)] to-[var(--border-end)]" />
      <span className="absolute right-0 top-0 h-full w-[2px] animate-[neonSlideDown_2s_linear_infinite_2s] bg-linear-to-b from-[var(--border-start)] to-[var(--border-end)]" />
      <span className="absolute bottom-0 left-0 h-[2px] w-full animate-[neonSlideLeft_2s_linear_infinite_1s] bg-linear-to-l from-[var(--border-start)] to-[var(--border-end)]" />
      <span className="absolute left-0 top-0 h-full w-[2px] animate-[neonSlideUp_2s_linear_infinite_2s] bg-linear-to-t from-[var(--border-start)] to-[var(--border-end)]" />
      {children}
    </a>
  );
}
