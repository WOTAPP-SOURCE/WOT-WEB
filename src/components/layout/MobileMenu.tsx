"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Navigation } from "@/components/layout/Navigation";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { CloseIcon } from "@/components/ui/Icons";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: "100%", transition: { type: "tween", duration: 0.26, ease: [0.4, 0, 1, 1] } },
};

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const t = useTranslations("nav");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={backdropVariants}
            onClick={onClose}
            className="bg-background/80 absolute inset-0 backdrop-blur-sm"
          />

          <motion.div
            variants={panelVariants}
            className="border-border bg-surface/95 shadow-glow-lg absolute top-0 right-0 flex h-full w-[82%] max-w-sm flex-col gap-8 border-l px-6 pt-6 pb-8 backdrop-blur-xl"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                aria-label={t("closeMenu")}
                className="border-border text-text-muted hover:border-primary/50 hover:text-text flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <Navigation variant="mobile" onNavigate={onClose} />

            <div className="mt-auto">
              <StoreButtons />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
