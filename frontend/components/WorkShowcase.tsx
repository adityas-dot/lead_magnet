"use client";

import { useState, useEffect, useRef } from "react";

type ShowcaseItem = {
    id: number;
    name: string;
    beforeImage?: {
        url: string;
    };
    afterImage?: {
        url: string;
    };
    mobileBeforeImage?: {
        url: string;
    };
    mobileAfterImage?: {
        url: string;
    };
};

type WorkShowcaseData = {
    heading: string;
    description: string;
    MobileDescription?: string;
    mobileDescription?: string;
    items: ShowcaseItem[];
};

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function getMediaUrl(url?: string): string {
    if (!url) return "";
    return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

export default function WorkShowcase({
    data,
}: {
    data: WorkShowcaseData;
}) {
    const [selectedItem, setSelectedItem] = useState(data.items[0]?.id);
    const [position, setPosition] = useState(50);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const activeItem = data.items.find((item) => item.id === selectedItem);
    const mobileDesc = data.MobileDescription || data.mobileDescription;

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const updatePosition = (clientX: number, clientY: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (isMobile) {
            const y = clientY - rect.top;
            const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
            setPosition(percentage);
        } else {
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setPosition(percentage);
        }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        updatePosition(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDragging) {
            updatePosition(e.clientX, e.clientY);
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
    };

    return (
        <section className="px-6 py-20 bg-[#f5f5f5] lg:px-[60px] xl:px-[80px]">
            <div className="mx-auto max-w-[1720px] w-full">
                <div className="w-full">
                    <h2 className="max-w-[900px] font-delight text-[clamp(28px,4.2vw,50px)] font-medium mb-6">
                        {data.heading}
                    </h2>
                    {mobileDesc ? (
                        <>
                            <p className="block sm:hidden max-w-[650px] font-satoshi text-[clamp(13px,3.6vw,16px)] text-[#000000] whitespace-pre-line leading-relaxed">
                                {mobileDesc}
                            </p>
                            <p className="hidden sm:block max-w-[650px] font-satoshi text-[clamp(14px,1.2vw,16px)] text-[#000000] whitespace-pre-line leading-relaxed">
                                {data.description}
                            </p>
                        </>
                    ) : (
                        <p className="max-w-[650px] font-satoshi text-[clamp(14px,1.2vw,16px)] text-[#000000] whitespace-pre-line leading-relaxed">
                            {data.description}
                        </p>
                    )}

                    {/* Filter Pills (Horizontal scroll on mobile as in reference image) */}
                    <div className="mt-8 flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 md:flex-wrap">
                        {data.items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedItem(item.id)}
                                type="button"
                                className={`shrink-0 rounded-full border px-5 py-2.5 text-[13px] font-satoshi font-medium transition-colors ${
                                    selectedItem === item.id
                                        ? "border-[#79BDB4] bg-[#DDF2EF] text-[#0D2108]"
                                        : "border-[#CAC4D0] bg-transparent text-[#3C3C3C] hover:border-gray-400"
                                }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* BEFORE / AFTER COMPARISON */}
                {activeItem && (activeItem.beforeImage || activeItem.mobileBeforeImage) && (activeItem.afterImage || activeItem.mobileAfterImage) && (
                    <div
                        ref={containerRef}
                        role="slider"
                        aria-valuenow={Math.round(position)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        tabIndex={0}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        onKeyDown={(e) => {
                            if (isMobile) {
                                if (e.key === "ArrowUp") setPosition((prev) => Math.max(0, prev - 5));
                                if (e.key === "ArrowDown") setPosition((prev) => Math.min(100, prev + 5));
                            } else {
                                if (e.key === "ArrowLeft") setPosition((prev) => Math.max(0, prev - 5));
                                if (e.key === "ArrowRight") setPosition((prev) => Math.min(100, prev + 5));
                            }
                        }}
                        className="relative mt-8 sm:mt-12 aspect-[9/18.5] sm:aspect-[9/16] md:aspect-[16/9] w-full max-w-[440px] md:max-w-none mx-auto overflow-hidden rounded-[24px] md:rounded-lg touch-none select-none cursor-pointer bg-white shadow-sm border border-black/5"
                    >
                        {/* AFTER IMAGE (Bottom on mobile / Right on desktop) */}
                        {activeItem.mobileAfterImage?.url && (
                            <img
                                src={getMediaUrl(activeItem.mobileAfterImage.url)}
                                alt="After"
                                className="md:hidden absolute inset-0 h-full w-full object-cover object-top pointer-events-none"
                                draggable={false}
                            />
                        )}
                        {activeItem.afterImage?.url && (
                            <img
                                src={getMediaUrl(activeItem.afterImage.url)}
                                alt="After"
                                className={`${activeItem.mobileAfterImage?.url ? "hidden md:block" : ""} absolute inset-0 h-full w-full object-cover object-top pointer-events-none`}
                                draggable={false}
                            />
                        )}

                        {/* BEFORE IMAGE (Top on mobile / Left on desktop) */}
                        {activeItem.mobileBeforeImage?.url && (
                            <img
                                src={getMediaUrl(activeItem.mobileBeforeImage.url)}
                                alt="Before"
                                className="md:hidden absolute inset-0 h-full w-full object-cover object-top pointer-events-none"
                                draggable={false}
                                style={{
                                    clipPath: `inset(0 0 ${100 - position}% 0)`,
                                }}
                            />
                        )}
                        {activeItem.beforeImage?.url && (
                            <img
                                src={getMediaUrl(activeItem.beforeImage.url)}
                                alt="Before"
                                className={`${activeItem.mobileBeforeImage?.url ? "hidden md:block" : ""} absolute inset-0 h-full w-full object-cover object-top pointer-events-none`}
                                draggable={false}
                                style={{
                                    clipPath: isMobile
                                        ? `inset(0 0 ${100 - position}% 0)`
                                        : `inset(0 ${100 - position}% 0 0)`,
                                }}
                            />
                        )}

                        {/* DIVIDER & HANDLE */}
                        {/* MOBILE: HORIZONTAL DIVIDER (TOP / BOTTOM SPLIT) */}
                        <div
                            className="md:hidden absolute left-0 right-0 h-[2px] -translate-y-1/2 bg-black z-20 pointer-events-none"
                            style={{ top: `${position}%` }}
                        >
                            <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-md pointer-events-none">
                                <div className="flex flex-col items-center justify-center -space-y-0.5">
                                    <svg
                                        className="w-3.5 h-3.5 text-white"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 15l-6-6-6 6" />
                                    </svg>
                                    <svg
                                        className="w-3.5 h-3.5 text-white"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* DESKTOP: VERTICAL DIVIDER (LEFT / RIGHT SPLIT) */}
                        <div
                            className="hidden md:block absolute top-0 bottom-0 w-[2px] -translate-x-1/2 bg-black z-20 pointer-events-none"
                            style={{ left: `${position}%` }}
                        >
                            <div className="absolute left-1/2 top-1/2 flex h-12 w-12 sm:h-[50px] sm:w-[50px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-lg pointer-events-none select-none">
                                <div className="flex items-center justify-center gap-1">
                                    <svg
                                        className="w-4 h-4 text-white"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                    <svg
                                        className="w-4 h-4 text-white"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* IF THERE IS ONLY AN AFTER IMAGE */}
                {activeItem?.afterImage && !activeItem.beforeImage && !activeItem.mobileBeforeImage && (
                    <div className="mt-8 sm:mt-12 overflow-hidden rounded-[20px] sm:rounded-[24px] md:rounded-lg">
                        <img
                            src={getMediaUrl(activeItem.afterImage.url)}
                            alt={activeItem.name}
                            className="h-auto w-full"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}