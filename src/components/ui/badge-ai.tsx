"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import OrbitIcon from "../../../public/Orbit.svg";
import Image from "next/image";

export function BadgeAII() {
  const [hovered, setHovered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (hovered) {
      setShowMessage(false);
      timeout = setTimeout(() => {
        setShowMessage(true);
      }, 1000); // ⏱ 1s digitando
    } else {
      setShowMessage(false);
    }

    return () => clearTimeout(timeout);
  }, [hovered]);

  return (
    <Link href="/dashboard/chatbot">
      <motion.div
        className="fixed bottom-6 right-6 z-50 cursor-pointer hidden md:flex"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative w-[65px] h-[65px] flex items-center justify-center">
          {/* Glow */}
          <motion.div
            className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] blur-2xl"
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1.1, 1.25, 1.1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Botão */}
          <div className="rounded-full bg-background/60 backdrop-blur-xl flex items-center justify-center shadow-xl w-full h-full border border-border/50">
            {/* Tooltip */}
            <AnimatePresence mode="wait">
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-20 right-0 rounded-xl bg-background/70 backdrop-blur-xl border border-border/50 px-4 py-2 text-sm text-foreground shadow-xl"
                >
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {!showMessage ? (
                        <motion.div
                          key="typing"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TypingDots />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="message"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25 }}
                          className="whitespace-nowrap font-medium"
                        >
                          <span className="px-1 bg-gradient-to-r from-[#4D7CFF] via-[#5B7FFF] to-[#00C9A7] bg-clip-text text-transparent font-bold bg-[length:200%_auto] animate-gradient">
                            Orbit
                          </span>
                          Oi! Vamos conversar?
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ícone */}
            <Image
              src={OrbitIcon}
              alt="Orbit AI"
              width={40}
              height={40}
              className="drop-shadow-lg"
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="text-muted-foreground"></span>
      <motion.span
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        .
      </motion.span>
      <motion.span
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
      >
        .
      </motion.span>
      <motion.span
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
      >
        .
      </motion.span>
    </div>
  );
}
