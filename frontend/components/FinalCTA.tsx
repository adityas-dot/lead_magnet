"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMediaUrl } from "@/lib/strapi";

type FinalCtaLogo = {
    id: number;
    logo: {
        url: string;
    };
};

type FinalCtaData = {
    badge: string;
    heading: string;
    description: string;
    logos: FinalCtaLogo[];
    primaryCta: {
        label: string;
        href: string;
    };
    secondaryCta: {
        label: string;
        href: string;
    };
};

export default function FinalCTA({
    data,
}: {
    data: FinalCtaData;
}) {
    if (!data) return null;
    const validLogos = (data.logos || []).filter((l) => l?.logo?.url);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (validLogos.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % validLogos.length);
        }, 2200);

        return () => clearInterval(interval);
    }, [validLogos.length]);

    const currentLogo = validLogos[currentIndex];

    const headingParts = (() => {
        const rawText = data?.heading || "";
        // Clean out "experience" so it cleanly matches "their Shopify." as in the reference design
        const text = rawText.replace(/\s+experience\.?/i, ".");
        const parts = text.split(/\blike\b/i);
        if (parts.length >= 2) {
            const beforeLike = parts[0].trim();
            const afterLike = parts[1].trim();
            const words = afterLike.split(/\s+/);
            const firstWordAfter = words[0] || ""; // e.g. "transformed"
            const rest = words.slice(1).join(" ").replace(/\s+experience\.?/i, "."); // e.g. "their Shopify."
            const cleanRest = rest.endsWith(".") ? rest : `${rest}.`;
            return {
                line1Before: beforeLike,
                likeWord: "like",
                line1After: firstWordAfter,
                line2: cleanRest,
            };
        }
        return null;
    })();

    return (
        <section
            className="w-full px-5 sm:px-8 py-12 sm:py-24 bg-[#95e7d30d]"
            style={{ backgroundColor: "#95E7D30D" }}
        >
            <div className="w-full mx-auto max-w-[1180px]">
                <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
                    {data.badge && (
                        <span className="hidden md:inline-block font-satoshi font-medium border-2 border-[#95E7D3] bg-[#D1F4EC] rounded-[12px] px-4 py-1.5 text-black text-[15px] mb-5">
                            {data.badge}
                        </span>
                    )}

                    <h2 className="font-nohemi font-normal font-[400] text-[clamp(36px,9.6vw,45px)] sm:text-[clamp(44px,4.5vw,65px)] leading-[1.12] sm:leading-[1.15] tracking-[-0.025em] text-[#000000]">
                        {headingParts ? (
                            <>
                                <span className="block md:inline whitespace-nowrap">
                                    {headingParts.line1Before}{" "}
                                </span>
                                <span className="inline-flex items-center whitespace-nowrap mt-0.5 sm:mt-1 md:mt-0">
                                    <span>{headingParts.likeWord}</span>
                                    <span className="mx-2.5 sm:mx-3.5 lg:mx-4.5 inline-flex h-[42px] w-[42px] min-[360px]:h-[46px] min-[360px]:w-[46px] sm:h-[56px] sm:w-[56px] lg:h-[68px] lg:w-[68px] align-middle -mt-0.5 sm:-mt-1.5 rounded-[8px] sm:rounded-[10px] border border-[#00000030] bg-white relative overflow-hidden select-none shrink-0 shadow-xs">
                                        <AnimatePresence mode="wait">
                                            {currentLogo?.logo?.url && (
                                                <motion.img
                                                    key={currentLogo.id || currentIndex}
                                                    src={getMediaUrl(currentLogo.logo.url)}
                                                    alt=""
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                                    className="absolute inset-0 m-auto max-h-full max-w-full object-contain p-1.5 sm:p-2"
                                                />
                                            )}
                                        </AnimatePresence>
                                    </span>
                                    <span>{headingParts.line1After}</span>
                                </span>
                                {headingParts.line2 && (
                                    <span className="block whitespace-nowrap mt-0.5 sm:mt-1.5">
                                        {headingParts.line2}
                                    </span>
                                )}
                            </>
                        ) : (
                            data.heading
                        )}
                    </h2>

                    <p className="font-inter font-normal text-[14.5px] min-[360px]:text-[15.5px] sm:text-[16px] text-[#4A4A4A] sm:text-black max-w-[480px] sm:max-w-[600px] mt-4 leading-[1.5]">
                        {data.description}
                    </p>

                    <div className="w-full mt-6 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5">
                        {(() => {
                            const isPrimaryCall = (data.primaryCta?.label || "").toLowerCase().includes("call");
                            const primaryClass = isPrimaryCall
                                ? "border border-[#D0D5DD] sm:border-black/80 bg-transparent text-black hover:bg-black/5 hover:border-black"
                                : "bg-black text-white hover:opacity-85";
                            const secondaryClass = isPrimaryCall
                                ? "bg-black text-white hover:opacity-85"
                                : "border border-[#D0D5DD] sm:border-black/80 bg-transparent text-black hover:bg-black/5 hover:border-black";

                            return (
                                <>
                                    <a
                                        href={data.primaryCta.href}
                                        onClick={(e) => {
                                            const h = (data.primaryCta.href || "").toLowerCase();
                                            const l = (data.primaryCta.label || "").toLowerCase();
                                            if (h === "#quote" || h.includes("quote") || l.includes("quote")) {
                                                e.preventDefault();
                                                window.dispatchEvent(new CustomEvent("open-quote-modal"));
                                            } else if (h === "#contact" || h === "#call" || h.includes("call") || l.includes("call") || l.includes("callback")) {
                                                e.preventDefault();
                                                window.dispatchEvent(new CustomEvent("open-callback-modal"));
                                            }
                                        }}
                                        className={`w-full sm:w-auto min-w-0 sm:min-w-[210px] md:min-w-[235px] inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 sm:px-9 md:px-11 py-3.5 sm:py-4 font-satoshi text-[15.5px] sm:text-[16.5px] font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] ${primaryClass}`}
                                    >
                                        {data.primaryCta.label}
                                        <span className="ml-2 text-[16px] sm:text-[18px]">→</span>
                                    </a>

                                    <a
                                        href={data.secondaryCta.href}
                                        onClick={(e) => {
                                            const h = (data.secondaryCta.href || "").toLowerCase();
                                            const l = (data.secondaryCta.label || "").toLowerCase();
                                            if (h === "#quote" || h.includes("quote") || l.includes("quote")) {
                                                e.preventDefault();
                                                window.dispatchEvent(new CustomEvent("open-quote-modal"));
                                            } else if (h === "#contact" || h === "#call" || h.includes("call") || l.includes("call") || l.includes("callback")) {
                                                e.preventDefault();
                                                window.dispatchEvent(new CustomEvent("open-callback-modal"));
                                            }
                                        }}
                                        className={`w-full sm:w-auto min-w-0 sm:min-w-[210px] md:min-w-[235px] inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 sm:px-9 md:px-11 py-3.5 sm:py-4 font-satoshi text-[15.5px] sm:text-[16.5px] font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] ${secondaryClass}`}
                                    >
                                        {data.secondaryCta.label}
                                        <span className="ml-2 text-[16px] sm:text-[18px]">→</span>
                                    </a>
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </section>
    )
}