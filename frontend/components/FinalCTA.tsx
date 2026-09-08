"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function FinalCTA({
    data,
}: {
    data: FinalCtaData;
}) {
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
        const text = data?.heading || "";
        const match = text.match(/^(.*?)\b(like)\b\s*(.*)$/i);
        if (match) {
            return {
                before: match[1].trimEnd(),
                likeWord: match[2],
                after: match[3].trimStart(),
            };
        }
        return null;
    })();

    return (
        <section className="w-full px-6 py-14 sm:py-24 sm:px-8 bg-white">
            <div className="w-full mx-auto max-w-[850px]">
                <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
                    {data.badge && (
                        <span className="hidden md:block font-satoshi font-medium border rounded-md p-2 pt-1 pb-1 border-[#95E7D3] bg-[#95E7D3] mb-5">
                            {data.badge}
                        </span>
                    )}

                    <h2 className="font-nohemi text-[clamp(36px,4.2vw,47px)] leading-[1.1] tracking-[-0.03em] text-[#000000]">
                        {headingParts ? (
                            <>
                                <span className="block sm:inline">{headingParts.before}</span>{" "}
                                <span className="inline">
                                    {headingParts.likeWord}
                                    <span className="mx-2 sm:mx-3 lg:mx-4 inline-flex h-[46px] w-[46px] sm:h-[52px] sm:w-[52px] lg:h-[60px] lg:w-[60px] align-middle rounded-[10px] border border-[#E2E2E2] bg-white relative overflow-hidden select-none shrink-0">
                                        <AnimatePresence>
                                            {currentLogo?.logo?.url && (
                                                <motion.img
                                                    key={currentLogo.id || currentIndex}
                                                    src={`${STRAPI_URL}${currentLogo.logo.url}`}
                                                    alt=""
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                                    className="absolute inset-0 m-auto max-h-full max-w-full object-contain p-1"
                                                />
                                            )}
                                        </AnimatePresence>
                                    </span>
                                </span>
                                {headingParts.after}
                            </>
                        ) : (
                            data.heading
                        )}
                    </h2>

                    <p className="font-inter font-medium text-[15px] max-w-[600px] mt-4">
                        {data.description}
                    </p>

                    <div className="w-full mt-7 flex flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
                        {/* Primary CTA */}
                        <a
                            href={data.primaryCta.href}
                            className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-full bg-black px-6 py-3 font-inter text-[14px] font-medium text-white transition-opacity hover:opacity-80"
                        >
                            {data.primaryCta.label}
                            <span className="ml-2">→</span>
                        </a>

                        {/* Secondary CTA */}
                        <a
                            href={data.secondaryCta.href}
                            className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#D0D5DD] bg-white px-6 py-3 font-inter text-[14px] font-medium text-black transition-colors hover:border-black"
                        >
                            {data.secondaryCta.label}
                            <span className="ml-2">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}