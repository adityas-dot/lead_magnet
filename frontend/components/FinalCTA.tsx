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
    const validLogos = (data.logos || []).filter((l) => Boolean(getMediaUrl(l?.logo)));
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

    const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
        const h = (href || "").toLowerCase();
        const l = (label || "").toLowerCase();
        if (h === "#quote" || h.includes("quote") || l.includes("quote")) {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("open-quote-modal"));
        } else if (h === "#contact" || h === "#call" || h.includes("call") || l.includes("call") || l.includes("callback")) {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("open-callback-modal"));
        }
    };

    return (
        <section
            className="w-full px-4 sm:px-8 py-20 sm:py-28 lg:py-32 bg-[#95e7d30d]"
            style={{ backgroundColor: "#95E7D30D" }}
        >
            <div className="w-full mx-auto max-w-[1180px]">
                {/* 1. DESKTOP / TABLET VIEW (Centered, badge, side-by-side buttons, scaling with 4.2vw text clamp) */}
                <div className="hidden sm:flex flex-col items-center text-center">
                    {data.badge && (
                        <span className="inline-block font-satoshi font-medium border-2 border-[#95E7D3] bg-[#D1F4EC] rounded-[12px] px-4 py-1.5 text-black text-[15px] mb-5">
                            {data.badge}
                        </span>
                    )}

                    <h2 className="font-nohemi font-normal font-[400] text-[clamp(28px,4.2vw,65px)] leading-[1.15] tracking-[-0.025em] text-[#000000]">
                        {headingParts ? (
                            <>
                                <span>
                                    {headingParts.line1Before}{" "}
                                </span>
                                <span className="inline-flex items-center whitespace-nowrap">
                                    <span>{headingParts.likeWord}</span>
                                    <span className="mx-2.5 lg:mx-3.5 inline-flex h-[clamp(36px,4.2vw,68px)] w-[clamp(36px,4.2vw,68px)] align-middle -mt-1 lg:-mt-1.5 rounded-[10px] lg:rounded-[12px] border border-[#00000030] bg-white relative overflow-hidden select-none shrink-0 shadow-xs">
                                        <AnimatePresence mode="wait">
                                            {currentLogo?.logo && (
                                                <motion.img
                                                    key={currentLogo.id || currentIndex}
                                                    src={getMediaUrl(currentLogo.logo)}
                                                    alt=""
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                                    className="absolute inset-0 m-auto max-h-full max-w-full object-contain p-1.5 lg:p-2"
                                                />
                                            )}
                                        </AnimatePresence>
                                    </span>
                                    <span>{headingParts.line1After}</span>
                                </span>
                                {headingParts.line2 && (
                                    <span className="block whitespace-nowrap mt-1 lg:mt-1.5">
                                        {headingParts.line2}
                                    </span>
                                )}
                            </>
                        ) : (
                            data.heading
                        )}
                    </h2>

                    <p className="font-inter font-normal text-[16px] text-black w-full max-w-[600px] mt-4 leading-[1.5] text-center mx-auto">
                        {data.description}
                    </p>

                    <div className="mx-auto mt-7 flex flex-row items-center justify-center gap-3.5">
                        <a
                            href={data.primaryCta.href}
                            onClick={(e) => handleCtaClick(e, data.primaryCta.href, data.primaryCta.label)}
                            className="w-auto min-w-[210px] lg:min-w-[235px] inline-flex items-center justify-center whitespace-nowrap rounded-full px-8 lg:px-11 py-4 font-satoshi text-[16.5px] font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] bg-black text-white hover:opacity-85"
                        >
                            {data.primaryCta.label}
                            <span className="ml-2 text-[18px]">→</span>
                        </a>

                        <a
                            href={data.secondaryCta.href}
                            onClick={(e) => handleCtaClick(e, data.secondaryCta.href, data.secondaryCta.label)}
                            className="w-auto min-w-[210px] lg:min-w-[235px] inline-flex items-center justify-center whitespace-nowrap rounded-full px-8 lg:px-11 py-4 font-satoshi text-[16.5px] font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] border border-black/80 bg-transparent text-black hover:bg-black/5 hover:border-black"
                        >
                            {data.secondaryCta.label}
                            <span className="ml-2 text-[18px]">→</span>
                        </a>
                    </div>
                </div>

                {/* 2. SMALL SCREEN / MOBILE VIEW (Left-aligned, 3 lines reaching right corner) */}
                <div className="flex sm:hidden flex-col items-start text-left w-full">
                    <h2 className="w-full font-nohemi font-normal font-[400] text-[clamp(34px,10.8vw,62px)] leading-[1.12] tracking-[-0.025em] text-[#000000]">
                        {headingParts ? (
                            <>
                                <span className="block whitespace-nowrap">
                                    {headingParts.line1Before}
                                </span>
                                <span className="inline-flex items-center whitespace-nowrap mt-1">
                                    <span>{headingParts.likeWord}</span>
                                    <span className="mx-2 sm:mx-2.5 inline-flex h-[clamp(39px,10.8vw,56px)] w-[clamp(39px,10.8vw,56px)] align-middle -mt-1 rounded-[10px] border border-[#00000025] bg-white relative overflow-hidden select-none shrink-0 shadow-xs">
                                        <AnimatePresence mode="wait">
                                            {currentLogo?.logo && (
                                                <motion.img
                                                    key={currentLogo.id || currentIndex}
                                                    src={getMediaUrl(currentLogo.logo)}
                                                    alt=""
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                                    className="absolute inset-0 m-auto max-h-full max-w-full object-contain p-1.5"
                                                />
                                            )}
                                        </AnimatePresence>
                                    </span>
                                    <span>{headingParts.line1After}</span>
                                </span>
                                {headingParts.line2 && (
                                    <span className="block whitespace-nowrap mt-1">
                                        {headingParts.line2}
                                    </span>
                                )}
                            </>
                        ) : (
                            data.heading
                        )}
                    </h2>

                    <p className="font-inter font-normal text-[15px] sm:text-[16px] text-[#4A4A4A] w-full mt-4 leading-[1.5] text-left">
                        {data.description}
                    </p>

                    <div className="w-full mt-6 flex flex-col items-stretch justify-start gap-3">
                        <a
                            href={data.primaryCta.href}
                            onClick={(e) => handleCtaClick(e, data.primaryCta.href, data.primaryCta.label)}
                            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-4 font-satoshi text-[16px] font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] bg-black text-white hover:opacity-85"
                        >
                            {data.primaryCta.label}
                            <span className="ml-2 text-[17px]">→</span>
                        </a>

                        <a
                            href={data.secondaryCta.href}
                            onClick={(e) => handleCtaClick(e, data.secondaryCta.href, data.secondaryCta.label)}
                            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-4 font-satoshi text-[16px] font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] border border-[#D0D5DD] bg-white text-black hover:bg-black/5"
                        >
                            {data.secondaryCta.label}
                            <span className="ml-2 text-[17px]">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}