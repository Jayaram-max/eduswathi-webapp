import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EduSwathiLogo } from "./EduSwathiLogo";

interface EduSwathiPreloaderProps {
  onFinish?: () => void;
}

export const EduSwathiPreloader: React.FC<EduSwathiPreloaderProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Lock body scroll while preloader is active
  useEffect(() => {
    if (isVisible) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isVisible]);

  // Display duration of ~1.8 seconds, then smoothly exit
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) {
        onFinish();
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onFinish) {
      onFinish();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="eduswathi-preloader-black"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
          }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black select-none cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.8, y: -40, transition: { duration: 0.5, ease: "easeInOut" } }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center pointer-events-none"
          >
            <EduSwathiLogo
              variant="primary"
              size="xl"
              theme="dark"
              animated={true}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EduSwathiPreloader;
