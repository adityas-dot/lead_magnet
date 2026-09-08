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
    data, }: {
        data: StorefrontProblemsData;
    }) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <section className="w-full bg-white px-6 pt-15 pb-10 text-[#0D2108] lg:px-[60px] xl:px-[80px] lg:pt-[90px] lg:pb-[30px]">
            <div className="mx-auto max-w-[1720px] w-full">
                <div className="w-full">
                    <h2 className="font-delight text-[clamp(30px,4.2vw,56px)] font-medium leading-[1.2] tracking-[-0.01em] lg:whitespace-nowrap text-[#0F1D07]">
                        {data.heading}
                    </h2>

                    <p className="font-satoshi font-medium mt-5 max-w-[430px] whitespace-pre-line text-[clamp(12px,4.2vw,16px)] leading-[1.7] text-[#0F1D07]">
                        {data.description}
                    </p>
                </div>

                {/* Interactive problem selection cards */}
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {data.items.map((item) => {
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
                                className={`relative min-h-[140px] rounded-[10px] p-5 cursor-pointer select-none transition-colors duration-200 ${isSelected
                                    ? "bg-[#B4BCFE]"
                                    : "bg-[#EEF0FF] hover:bg-[#B4BCFE]"
                                    }`}
                            >
                                <div className="pr-8">
                                    <h3 className="font-delight text-[16px] font-medium leading-[1.25] text-[#0F1D07]">
                                        {item.title}
                                    </h3>

                                    <p className="font-satoshi mt-3 text-[14px] leading-[1.6] text-[#0F1D07]">
                                        {item.description}
                                    </p>
                                </div>

                                <div
                                    className={`absolute right-3.5 top-3.5 flex h-6 w-6 items-center justify-center rounded-[5px] transition-colors duration-200 ${isSelected ? "bg-[#3145DD]" : "bg-white"
                                        }`}
                                >
                                    {isSelected ? (
                                        <svg
                                            className="w-3.5 h-3.5 text-white"
                                            viewBox="0 0 14 14"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M2.5 7.5L5.5 10.5L11.5 3.5"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-3.5 h-3.5 text-[#1A1A1A]"
                                            viewBox="0 0 14 14"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M7 3V11M3 7H11"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom summary and action bar */}
                <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-[8px] bg-[#F7F7F7] px-5 py-3 sm:flex-row">
                    <p className="font-satoshi text-[clamp(11px,4.2vw,16px)] font-bold">
                        {data.summary}
                    </p>

                    <a
                        href={data.submitHref}
                        className="flex w-full font-inter items-center justify-center rounded-full bg-[#3447E5] px-10 py-4 text-[13px] font-medium text-white transition hover:opacity-90 sm:w-[260px]"
                    >
                        {data.submitLabel}
                        <span className="ml-2">→</span>
                    </a>
                </div>

            </div>
        </section>
    );
}