"use client";

import { motion, AnimatePresence } from "framer-motion";

type CTA = {
    label: string;
    href: string;
};

export type StickyCTAData = {
    text: string;
    primaryCta?: CTA;
    secondaryCta?: CTA;
};

export default function StickyCTA({ data }: { data?: StickyCTAData | null }) {

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

    return (
        <AnimatePresence>
            <div className="fixed bottom-2.5 sm:bottom-3 md:bottom-3.5 lg:bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 sm:px-4 md:px-6">
                <motion.div
                    initial={{ y: 90, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 90, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                                    onClick={(e) =>
                                        handleAnchorClick(e, primaryCta.href)
                                    }
                                    className="group flex-1 md:flex-none min-w-0 rounded-full bg-[#0F1D07] py-2 px-2.5 min-[360px]:px-3 sm:px-4 md:py-2.5 md:px-6 lg:py-2.5 lg:px-7 text-white text-[10.5px] min-[360px]:text-[11.5px] sm:text-[12.5px] md:text-[14px] lg:text-[15px] font-semibold font-satoshi flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 transition-all duration-150 hover:bg-[#1b3416] active:scale-[0.98] shadow-md hover:shadow-lg whitespace-nowrap"
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
                                    onClick={(e) =>
                                        handleAnchorClick(e, secondaryCta.href)
                                    }
                                    className="group flex-1 md:flex-none min-w-0 rounded-full bg-white border border-[#0F1D07]/25 py-2 px-2.5 min-[360px]:px-3 sm:px-4 md:py-2.5 md:px-6 lg:py-2.5 lg:px-7 text-[#0F1D07] text-[10.5px] min-[360px]:text-[11.5px] sm:text-[12.5px] md:text-[14px] lg:text-[15px] font-semibold font-satoshi flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 transition-all duration-150 hover:bg-black/5 active:scale-[0.98] whitespace-nowrap"
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
        </AnimatePresence>
    );
}
