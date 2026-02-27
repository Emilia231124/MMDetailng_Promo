"use client";

import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div data-component="PageTransition">
      {/* TODO: Implement Framer Motion page transition */}
      {children}
    </div>
  );
}
