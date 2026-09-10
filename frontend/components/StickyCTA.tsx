"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuoteModal, { QuoteFormData } from "./QuoteModal";
import CallbackModal, { CallbackFormData } from "./CallbackModal";

type CTA = {
    label: string;
    href: string;
};

export type StickyCTAData = {
    text: string;
    primaryCta?: CTA;
    secondaryCta?: CTA;
    callbackForm?: CallbackFormData;
};

export default function StickyCTA({
    data,
    quoteForm,
    callbackForm,
}: {
    data?: StickyCTAData | null;
    quoteForm?: QuoteFormData | QuoteFormData[] | null;
    callbackForm?: CallbackFormData | null;
}) {
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [isCallbackOpen, setIsCallbackOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleOpenQuote = () => setIsQuoteOpen(true);
        const handleOpenCallback = () => setIsCallbackOpen(true);
        window.addEventListener("open-quote-modal", handleOpenQuote);
        window.addEventListener("open-callback-modal", handleOpenCallback);

        const checkVisibility = () => {
            const secondSection =
                document.getElementById("storefront-problems") ||
                document.querySelectorAll("section")[1];

            if (secondSection) {
                const rect = secondSection.getBoundingClientRect();
                // Visible when 2nd section starts entering the screen
                setIsVisible(rect.top <= window.innerHeight * 0.85);
            } else {
                setIsVisible(window.scrollY > 400);
            }
        };

        window.addEventListener("scroll", checkVisibility, { passive: true });
        window.addEventListener("resize", checkVisibility);
        checkVisibility();

        const secondSection =
            document.getElementById("storefront-problems") ||
            document.querySelectorAll("section")[1];

        let observer: IntersectionObserver | null = null;
        if (secondSection && "IntersectionObserver" in window) {
            observer = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    if (entry) {
                        if (
                            entry.isIntersecting ||
                            entry.boundingClientRect.top <= window.innerHeight * 0.85
                        ) {
                            setIsVisible(true);
                        } else {
                            setIsVisible(false);
                        }
                    }
                },
                {
                    root: null,
                    rootMargin: "0px 0px -15% 0px",
                    threshold: 0,
                }
            );
            observer.observe(secondSection);
        }

        const handleGlobalClick = (e: MouseEvent) => {
            const el = (e.target as HTMLElement)?.closest("a, button");
            if (!el) return;
            // Ignore if clicked inside callback modal, quote modal, or hero quote form
            if (
                el.closest("#callback-modal") ||
                el.closest("[data-modal='callback']") ||
                el.closest("#quote-modal") ||
                el.closest("[data-modal='quote']") ||
                el.closest("#quote") ||
                el.closest("[data-quote-form]") ||
                el.getAttribute("data-no-callback") === "true" ||
                el.closest("[data-no-callback='true']")
            ) {
                return;
            }
            const text = (el.textContent || "").toLowerCase().replace(/\s+/g, " ").trim();
            const href = el.getAttribute("href")?.toLowerCase() || "";
            if (
                href === "#call" ||
                href === "#callback" ||
                text === "book a free call" ||
                text === "book a call" ||
                text.startsWith("book a free call")
            ) {
                e.preventDefault();
                e.stopPropagation();
                setIsCallbackOpen(true);
            }
        };

        document.addEventListener("click", handleGlobalClick, true);

        return () => {
            window.removeEventListener("open-quote-modal", handleOpenQuote);
            window.removeEventListener("open-callback-modal", handleOpenCallback);
            document.removeEventListener("click", handleGlobalClick, true);
            window.removeEventListener("scroll", checkVisibility);
            window.removeEventListener("resize", checkVisibility);
            if (observer) observer.disconnect();
        };
    }, []);

    const displayText = data?.text || "Not ready yet? Get your Free Store Audit.";
    const primaryCta = data?.primaryCta?.label
        ? data.primaryCta
        : {
              label: "Get My Instant Quote",
              href: "#quote",
          };

    const secondaryCta = data?.secondaryCta?.label
        ? data.secondaryCta
        : {
              label: "Book a Free Call",
              href: "#contact",
          };

    const isQuoteAction = (cta?: CTA) => {
        if (!cta) return false;
        const h = (cta.href || "").toLowerCase();
        const l = (cta.label || "").toLowerCase();
        return h === "#quote" || h.includes("quote") || l.includes("quote");
    };

    const isCallbackAction = (cta?: CTA) => {
        if (!cta) return false;
        const h = (cta.href || "").toLowerCase();
        const l = (cta.label || "").toLowerCase();
        return (
            h === "#contact" ||
            h === "#call" ||
            h.includes("call") ||
            l.includes("call") ||
            l.includes("callback")
        );
    };

    const handleAnchorClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string
    ) => {
        if (href.startsWith("#")) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    const handleCtaClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        cta?: CTA
    ) => {
        if (!cta) return;
        if (isQuoteAction(cta)) {
            e.preventDefault();
            setIsQuoteOpen(true);
            return;
        }
        if (isCallbackAction(cta)) {
            e.preventDefault();
            setIsCallbackOpen(true);
            return;
        }
        handleAnchorClick(e, cta.href);
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <div className="fixed bottom-2.5 sm:bottom-3 md:bottom-3.5 lg:bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 sm:px-4 md:px-6">
                        <motion.div
                            initial={{ y: 90, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 90, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="pointer-events-auto w-full max-w-[460px] md:w-auto md:max-w-[880px] lg:max-w-[1020px] xl:max-w-[1120px]"
                        >
                            <div className="relative rounded-[20px] sm:rounded-[24px] bg-white/95 backdrop-blur-md py-2.5 px-3 sm:py-3 sm:px-4 md:py-2.5 md:px-5 lg:py-3 lg:px-6 shadow-[0_16px_50px_rgba(0,0,0,0.18)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.22)] border border-black/10 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-3 md:gap-5 lg:gap-6 transition-shadow duration-200">
                                <div className="flex items-center justify-between gap-2 md:gap-0">
                                    <p className="font-delight text-[12.5px] min-[360px]:text-[13.5px] sm:text-[14.5px] md:text-[16px] lg:text-[17.5px] xl:text-[18.5px] font-semibold text-[#0F1D07] leading-snug md:whitespace-nowrap tracking-tight">
                                        {displayText}
                                    </p>
                                </div>

                                <div className="w-full md:w-auto flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
                                    {primaryCta && (
                                        <a
                                            href={primaryCta.href}
                                            onClick={(e) => handleCtaClick(e, primaryCta)}
                                            className="group flex-1 md:flex-none min-w-0 rounded-full bg-[#0F1D07] py-2 px-2.5 min-[360px]:px-3 sm:px-4 md:py-2.5 md:px-6 lg:py-2.5 lg:px-7 text-white text-[10.5px] min-[360px]:text-[11.5px] sm:text-[12.5px] md:text-[14px] lg:text-[15px] font-semibold font-satoshi flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 transition-all duration-150 hover:bg-[#1b3416] active:scale-[0.98] shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
                                        >
                                            <span>{primaryCta.label}</span>
                                            <span className="text-[11px] min-[360px]:text-[12px] sm:text-[13.5px] md:text-[15.5px] lg:text-[16.5px] leading-none transition-transform duration-150 group-hover:translate-x-0.5 shrink-0">
                                                →
                                            </span>
                                        </a>
                                    )}

                                    {secondaryCta && (
                                        <a
                                            href={secondaryCta.href}
                                            onClick={(e) => handleCtaClick(e, secondaryCta)}
                                            className="group flex-1 md:flex-none min-w-0 rounded-full bg-white border border-[#0F1D07]/25 py-2 px-2.5 min-[360px]:px-3 sm:px-4 md:py-2.5 md:px-6 lg:py-2.5 lg:px-7 text-[#0F1D07] text-[10.5px] min-[360px]:text-[11.5px] sm:text-[12.5px] md:text-[14px] lg:text-[15px] font-semibold font-satoshi flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 transition-all duration-150 hover:bg-black/5 active:scale-[0.98] whitespace-nowrap cursor-pointer"
                                        >
                                            <span>{secondaryCta.label}</span>
                                            <span className="text-[11px] min-[360px]:text-[12px] sm:text-[13.5px] md:text-[15.5px] lg:text-[16.5px] leading-none transition-transform duration-150 group-hover:translate-x-0.5 shrink-0">
                                                →
                                            </span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <QuoteModal
                isOpen={isQuoteOpen}
                onClose={() => setIsQuoteOpen(false)}
                form={quoteForm}
            />

            <CallbackModal
                isOpen={isCallbackOpen}
                onClose={() => setIsCallbackOpen(false)}
                data={callbackForm || data?.callbackForm}
            />
        </>
    );
}
