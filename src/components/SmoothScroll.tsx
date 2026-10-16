"use client";

import { ReactNode } from "react";
import { useLenis } from "@/lib/useLenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useLenis();
  return <>{children}</>;
}
