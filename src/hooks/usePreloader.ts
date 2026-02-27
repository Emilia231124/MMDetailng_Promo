"use client";
import { useState, useEffect } from "react";

export function usePreloader(duration: number = 2000) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const visited = sessionStorage.getItem("mm-detailing-visited");
    if (visited) {
      setIsFirstVisit(false);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("mm-detailing-visited", "true");
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return { isLoading, isFirstVisit };
}
