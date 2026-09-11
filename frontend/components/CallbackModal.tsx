"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type CallbackFormData = {
    id?: number;
    title?: string;
    description?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    phoneLabel?: string;
    phonePlaceholder?: string;
    shopifyLinkLabel?: string;
    shopifyLinkPlaceholder?: string;
    buttonLabel?: string;
    disclaimer?: string;
    successTitle?: string;
    successDescription?: string;
    closeButtonLabel?: string;
};

interface CallbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: CallbackFormData | null;
}

export default function CallbackModal({ isOpen, onClose, data }: CallbackModalProps) {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [shopifyLink, setShopifyLink] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const modalContainerRef = useRef<HTMLDivElement>(null);

    // Text configuration with fallback to exact defaults
    const title = data?.title || "Get a callback";
    const description =
        data?.description ||
        "Let’s make something amazing together.\nBook a call - we’ve got coffee (or tea) ready and are always up for a good conversation.";
    const emailLabel = data?.emailLabel || "Email";
    const emailPlaceholder = data?.emailPlaceholder || "Enter Email";
    const phoneLabel = data?.phoneLabel || "Phone Number";
    const phonePlaceholder = data?.phonePlaceholder || "Enter Phone Number";
    const shopifyLinkLabel = data?.shopifyLinkLabel || "Shopify Link (Optional)";
    const shopifyLinkPlaceholder = data?.shopifyLinkPlaceholder || "Enter Shopify link";
    const buttonLabel = data?.buttonLabel || "Book My Free Call";
    const disclaimer =
        data?.disclaimer ||
        "We'll reach out within 24 hours — no spam, just expert guidance.";
    const successTitle = data?.successTitle || "Thank you! We've received your request.";
    const successDescription =
        data?.successDescription ||
        "We'll reach out within 24 hours — no spam, just expert guidance.";

    // Lock body & document scroll, pause Lenis, and handle ESC key
    useEffect(() => {
        if (!isOpen) return;

        const origBodyOverflow = document.body.style.overflow;
        const origDocOverflow = document.documentElement.style.overflow;
        const origBodyOverscroll = document.body.style.overscrollBehavior;
        const origDocOverscroll = document.documentElement.style.overscrollBehavior;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.body.style.overscrollBehavior = "none";
        document.documentElement.style.overscrollBehavior = "none";

        if (typeof window !== "undefined") {
            (window as any).__lenis?.stop();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = origBodyOverflow;
            document.documentElement.style.overflow = origDocOverflow;
            document.body.style.overscrollBehavior = origBodyOverscroll;
            document.documentElement.style.overscrollBehavior = origDocOverscroll;
            if (typeof window !== "undefined") {
                (window as any).__lenis?.start();
            }
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Reset state on modal open
    useEffect(() => {
        if (isOpen && isSubmitted) {
            setIsSubmitted(false);
            setEmail("");
            setPhone("");
            setShopifyLink("");
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    ref={modalContainerRef}
                    data-lenis-prevent="true"
                    className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto overscroll-contain no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {/* Semi-transparent Backdrop (no blur, dark overlay showing background) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 cursor-pointer"
                        aria-hidden="true"
                    />

                    {/* Modal Card - Scrollable on mobile, Exact same width as QuoteModal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 12 }}
                        transition={{ type: "spring", damping: 26, stiffness: 280, mass: 0.8 }}
                        id="callback-modal"
                        data-modal="callback"
                        data-lenis-prevent="true"
                        className="relative w-full max-w-[550px] sm:max-w-[570px] max-h-[92vh] sm:max-h-[88vh] bg-[#FAFAFC] rounded-none p-5 sm:p-7 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] my-auto text-[#111827] z-10 flex flex-col justify-between overflow-y-auto overscroll-contain"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close callback modal"
                            className="absolute top-5 right-5 sm:top-6 sm:right-6 w-7 h-7 flex items-center justify-center text-[#111827] hover:opacity-60 transition-opacity cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Title & Description */}
                        <div className="mb-5 sm:mb-6">
                            <h2 className="font-nohemi text-[28px] sm:text-[32px] md:text-[34px] font-normal text-[#111827] leading-[1.15] tracking-tight pr-8">
                                {title}
                            </h2>
                            <p className="font-satoshi text-[#555555] text-[13px] sm:text-[13.5px] leading-relaxed mt-1.5 sm:mt-2 max-w-[520px] whitespace-pre-line">
                                {description}
                            </p>
                        </div>

                        {isSubmitted ? (
                            <div className="p-6 rounded-none bg-[#EBF7F2] text-[#1E7448] text-center font-satoshi text-[15px] space-y-2.5 my-4">
                                <p className="font-medium text-[16px]">✓ {successTitle}</p>
                                <p className="text-[13.5px] text-[#2A7550]">
                                    {successDescription}
                                </p>
                                {(data?.closeButtonLabel || (data as any)?.closeLabel) && (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="text-xs sm:text-sm font-semibold underline text-[#1E7448] hover:text-[#145232] cursor-pointer pt-2 inline-block"
                                    >
                                        {data?.closeButtonLabel || (data as any)?.closeLabel}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                                {/* Email Field */}
                                <div>
                                    <label className="font-nohemi block text-[14.5px] sm:text-[15.5px] font-normal text-[#111827] mb-1.5">
                                        {emailLabel}
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={emailPlaceholder}
                                        className="font-satoshi w-full px-5 py-2.5 sm:py-3 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[13px] sm:text-[13.5px] text-[#111827] bg-[#F1F1F3] placeholder-[#8E8E93] transition-all duration-200"
                                    />
                                </div>

                                {/* Phone Number Field */}
                                <div>
                                    <label className="font-nohemi block text-[14.5px] sm:text-[15.5px] font-normal text-[#111827] mb-1.5">
                                        {phoneLabel}
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder={phonePlaceholder}
                                        className="font-satoshi w-full px-5 py-2.5 sm:py-3 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[13px] sm:text-[13.5px] text-[#111827] bg-[#F1F1F3] placeholder-[#8E8E93] transition-all duration-200"
                                    />
                                </div>

                                {/* Shopify Link Field */}
                                <div>
                                    <label className="font-nohemi block text-[14.5px] sm:text-[15.5px] font-normal text-[#111827] mb-1.5">
                                        {shopifyLinkLabel}
                                    </label>
                                    <input
                                        type="text"
                                        value={shopifyLink}
                                        onChange={(e) => setShopifyLink(e.target.value)}
                                        placeholder={shopifyLinkPlaceholder}
                                        className="font-satoshi w-full px-5 py-2.5 sm:py-3 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[13px] sm:text-[13.5px] text-[#111827] bg-[#F1F1F3] placeholder-[#8E8E93] transition-all duration-200"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2 sm:pt-2.5">
                                    <button
                                        type="submit"
                                        className="font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-3 sm:py-3.5 px-6 rounded-full transition-all duration-200 flex justify-center items-center text-[14.5px] sm:text-[15px] cursor-pointer shadow-md active:scale-[0.99]"
                                    >
                                        {buttonLabel}
                                    </button>
                                    <p className="text-center font-satoshi text-[12px] sm:text-[12.5px] text-[#777777] mt-2.5 sm:mt-3">
                                        {disclaimer}
                                    </p>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
