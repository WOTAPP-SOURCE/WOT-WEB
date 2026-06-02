"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

export const useScrollAnimation = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return { ref, isInView };
};
