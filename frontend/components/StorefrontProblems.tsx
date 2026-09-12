"use client";

import { useState } from "react";

type PainPoint = {
    id: number;
    title: string;
    description: string;
};

type StorefrontProblemsData = {
    heading: string;
    description: string;
    items: PainPoint[];
    summary: string;
    submitLabel: string;
    submitHref: string;
};

export default function StorefrontProblems({
    data,
}: {
    data: StorefrontProblemsData;
}) {
    if (!data) return null;
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <section id="storefront-problems" className="w-full bg-white px-6 pt-15 pb-10 text-[#0D2108] lg:px-[60px] xl:px-[80px] lg:pt-[90px] lg:pb-[30px] border-none outline-none">
            <div className="mx-auto max-w-[1720px] w-full">
                <div className="w-full">
                    <h2 className="font-delight text-[clamp(32px,4.2vw,65px)] font-medium leading-[1.15] tracking-[-0.015em] xl:whitespace-nowrap text-[#0F1D07]">
                        {data.heading}
                    </h2>

                    <p className="font-satoshi font-medium mt-5 max-w-[430px] whitespace-pre-line text-[clamp(12px,4.2vw,16px)] leading-[1.7] text-[#0F1D07]">
                        {data.description}
                    </p>
                </div>

                {/* Interactive problem selection cards */}
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {(data.items || []).map((item) => {
                        const isSelected = selectedIds.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => toggleSelect(item.id)}
                                role="button"
                                tabIndex={0}
                                aria-pressed={isSelected}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        toggleSelect(item.id);
                                    }
                                }}
                                className={`relative min-h-[165px] rounded-[10px] p-5 pb-11 cursor-pointer select-none transition-colors duration-200 ${isSelected
                                    ? "bg-[#B4BCFE]"
                                    : "bg-[#EEF0FF] hover:bg-[#B4BCFE]"
                                    }`}
                            >
                                <div className="pr-7">
                                    <h3 className="font-delight text-[16px] sm:text-[17.5px] lg:text-[18.5px] font-medium leading-[1.3] text-[#0F1D07] text-balance whitespace-pre-line">
                                        {item.title}
                                    </h3>

                                    <p className="font-satoshi mt-2 sm:mt-3 text-[13px] sm:text-[13.5px] lg:text-[14px] leading-[1.55] text-[#0F1D07]">
                                        {item.description}
                                    </p>
                                </div>

                                <div
                                    className={`absolute right-3.5 top-3.5 sm:right-4 sm:top-4 flex h-6 w-6 sm:h-6.5 sm:w-6.5 items-center justify-center rounded-[6px] shrink-0 transition-all duration-200 ${isSelected ? "bg-[#3145DD] text-white" : "bg-white text-[#1A1A1A] shadow-xs"
                                        }`}
                                >
                                    {isSelected ? (
                                        <svg
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1A1A1A]"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M8 3.5V12.5M3.5 8H12.5"
                                                stroke="currentColor"
                                                strokeWidth="1.4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom summary and action bar */}
                {(() => {
                    const count = selectedIds.length;
                    const summaryText = (() => {
                        if (Array.isArray(data.summary)) {
                            if (count === 0) {
                                const def = (data.summary as any[]).find((s: any) => s?.state === "default");
                                if (def?.text) return def.text;
                            } else if (count === 1) {
                                const one = (data.summary as any[]).find((s: any) => s?.state === "one");
                                if (one?.text) return one.text.replace(/\{count\}/g, "1");
                            } else {
                                const mult = (data.summary as any[]).find((s: any) => s?.state === "multiple");
                                if (mult?.text) return mult.text.replace(/\{count\}/g, String(count));
                            }
                        }
                        if (count === 0) {
                            return "Select what applies above to diagnose your storefront.";
                        }
                        if (count < 3) {
                            return `${count} identified. Early signs that structure is impacting your conversions.`;
                        }
                        const summaryStr = typeof data.summary === "string" ? data.summary : "";
                        const suffix = summaryStr
                            ? summaryStr.replace(/^\d+\s*identified\.?\s*/i, "").trim()
                            : "At that point the structure is the problem, not the styling.";
                        return `${count} identified. ${suffix || "At that point the structure is the problem, not the styling."}`;
                    })();

                    return (
                        <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-[8px] bg-[#F7F7F7] px-5 py-3 sm:flex-row">
                            <p className="font-satoshi text-[clamp(13px,1.1vw,16px)] font-bold">
                                {summaryText}
                            </p>

                            <a
                                href={data.submitHref}
                                onClick={(e) => {
                                    if (data.submitHref === "#quote" || data.submitHref?.includes("quote")) {
                                        e.preventDefault();
                                        window.dispatchEvent(new CustomEvent("open-quote-modal"));
                                    }
                                }}
                                className="flex w-full font-inter items-center justify-center rounded-full bg-[#3447E5] px-10 py-4 text-[clamp(13px,1.05vw,14.5px)] font-medium text-white transition hover:opacity-90 sm:w-[260px] cursor-pointer"
                            >
                                {data.submitLabel}
                                <span className="ml-2">→</span>
                            </a>
                        </div>
                    );
                })()}

            </div>
        </section>
    );
}