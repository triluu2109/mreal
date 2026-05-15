"use client";

import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

// Zalo icon as SVG
function ZaloIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
      <rect width="120" height="120" rx="24" fill="white" />
      <path
        d="M60 14C34.56 14 14 34.56 14 60C14 70.12 17.2 79.52 22.72 87.12L14.72 105.12L34.08 97.84C41.12 102.64 49.68 105.52 59 105.52C84.44 105.52 105 84.96 105 59.52C105 34.08 84.44 14 60 14Z"
        fill="#0068FF"
      />
      <path
        d="M81 71.4H63.8L82.2 51H60.8V48H78.8L60.4 68.4H81V71.4Z"
        fill="white"
      />
      <path
        d="M50.8 48V71.4H47.6V48H50.8Z"
        fill="white"
      />
      <path
        d="M39.8 48L31 65L39.8 71.4H43.2L34 65L43 48H39.8Z"
        fill="white"
      />
    </svg>
  );
}

export default function FloatingButtons() {
  return (
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
  );
}
