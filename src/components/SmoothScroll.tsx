"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/lib/useLenis";

interface SmoothScrollProps {
  children: ReactNode;
}

function LenisWrapper({ children }: { children: ReactNode }) {
  useLenis();
  return <>{children}</>;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const isExcluded = pathname?.startsWith("/admin") || pathname?.startsWith("/livros");

  if (isExcluded) {
    return <>{children}</>;
  }

  return <LenisWrapper>{children}</LenisWrapper>;
}
