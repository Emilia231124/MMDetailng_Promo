"use client";

import Preloader from "./Preloader";
import SmoothScroll from "./SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

interface ClientRootProps {
  children: React.ReactNode;
}

export default function ClientRoot({ children }: ClientRootProps) {
  return (
    <>
      <CustomCursor />
      <Preloader />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}
