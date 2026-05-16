"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Phone, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/config/site";

function ZaloIcon() {
  return (
    <Image
      src="/Icon_of_Zalo.svg"
      alt="Zalo"
      width={24}
      height={24}
      unoptimized
    />
  );
}

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* Social contact buttons — bottom left */}
      <div className="fixed bottom-6 left-5 z-50 flex flex-col gap-3 items-start">
        {/* Messenger */}
        <motion.a
          href={siteConfig.social.messenger}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Messenger"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-[#0099FF] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageCircle size={22} className="text-white" />
        </motion.a>

        {/* Phone */}
        <motion.a
          href={`tel:${siteConfig.phone}`}
          aria-label="Gọi điện"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-orange rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow relative"
        >
          <Phone size={20} className="text-white" />
          {/* Pulsing ring */}
          <span className="absolute inset-0 rounded-full border-2 border-orange animate-ping opacity-50" />
        </motion.a>

        {/* Zalo */}
        <motion.a
          href={siteConfig.social.zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
        >
          <ZaloIcon />
        </motion.a>
      </div>

      {/* Back to top — bottom right */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label="Lên đầu trang"
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 12 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-24 right-5 z-50 w-12 h-12 bg-navy rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          >
            <ArrowUp size={20} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
