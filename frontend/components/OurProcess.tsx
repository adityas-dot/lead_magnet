"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getMediaUrl } from "@/lib/strapi";

type MarqueeItem = {
    id: number;
    text: string;
};

type ProcessService = {
    id: number;
    text: string;
};

type ProcessCard = {
    id: number;
    icon?: {
        url: string;
    };
    title: string;
    description: string;
    services: ProcessService[];
    cta?: {
        label: string;
        href: string;
    };
};

type MobileService = {
    id: number;
    title: string;
    description: string;
    icon?: {
        url: string;
    };
};

type CtaLink = {
    id?: number;
    label: string;
    href: string;
};

type OurProcessData = {
    marqueeItems: MarqueeItem[];
    eyebrow: string;
    heading: string;
    description: string;
    mobileEyebrow?: string;
    mobileHeading?: string;
    mobileDescription?: string;
    cta?: CtaLink;
    image?: {
        url: string;
    };
    cards: ProcessCard[];
    video?: {
        url: string;
    };
    service?: MobileService[];
    mobilePrimaryCta?: CtaLink;
    mobileSecondaryCta?: CtaLink;
};

const DURATION = 35;

export default function OurProcess({
    data,
}: {
    data: OurProcessData;
}) {
    const items = data?.marqueeItems?.length
        ? [...data.marqueeItems, ...data.marqueeItems]
        : [];

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scrollDistance, setScrollDistance] = useState(0);

    useEffect(() => {
        const updateDistance = () => {
            if (containerRef.current && contentRef.current) {
                const distance = contentRef.current.scrollWidth - containerRef.current.clientWidth;
                setScrollDistance(distance > 0 ? distance : 0);
            }
        };

        updateDistance();
        window.addEventListener("resize", updateDistance);
        return () => window.removeEventListener("resize", updateDistance);
    }, [items]);

    const formattedEyebrow = (() => {
        const raw = data.mobileEyebrow || data.eyebrow || "Services";
        return raw.endsWith(".") ? raw : `${raw}.`;
    })();


    // Group services into pairs of 2 for mobile slides
    const servicePairs: MobileService[][] = [];
    if (data.service && data.service.length > 0) {
        for (let i = 0; i < data.service.length; i += 2) {
            servicePairs.push(data.service.slice(i, i + 2));
        }
    }

    // Group cards into pairs of 2 for fallback mobile slides
    const cardPairs: ProcessCard[][] = [];
    if (data.cards && data.cards.length > 0) {
        for (let i = 0; i < data.cards.length; i += 2) {
            cardPairs.push(data.cards.slice(i, i + 2));
        }
    }

    return (
        <section data-theme="dark" className="w-full overflow-hidden">
            {/* Top Marquee Banner */}
            <div
                ref={containerRef}
                className="w-full overflow-hidden bg-[#4A71A5] py-2.5 lg:py-4 select-none"
            >
                <motion.div
                    key={`${scrollDistance}-${DURATION}`}
                    ref={contentRef}
                    className="flex w-max shrink-0 items-center px-4 lg:px-6"
                    initial={{ x: -scrollDistance }}
                    animate={{ x: 0 }}
                    transition={{
                        duration: DURATION,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 0.5,
                    }}
                >
                    {items.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex shrink-0 items-center">
                            {/* Mobile / Tablet */}
                            <div className="flex lg:hidden items-center">
                                <span className="text-white text-[13px] font-satoshi font-medium tracking-[0.04em] uppercase leading-none whitespace-nowrap">
                                    {item.text}
                                </span>
                                <span className="inline-block h-[6px] w-[6px] rounded-full bg-white shrink-0 mx-3.5" />
                            </div>

                            {/* Desktop */}
                            <div className="hidden lg:flex items-center">
                                <span className="text-white text-[clamp(16px,2vw,27px)] font-nohemi whitespace-nowrap">
                                    {item.text}
                                </span>
                                <span className="inline-block h-2 w-2 rounded-full bg-white shrink-0 mx-6" />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Main Content Area */}
            <div className="w-full bg-[#0F1D07] px-6 py-14 sm:px-8 lg:px-16 lg:py-24 text-white">
                <div className="mx-auto max-w-[1300px] w-full">
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <div className="flex flex-row items-center justify-between items-start mb-14 gap-6">
                            <div>
                                <span className="font-satoshi text-white/70">
                                    {data.eyebrow}
                                </span>

                                <h2 className="font-delight text-[clamp(24px,4.2vw,36px)] font-medium mt-5 max-w-[500px]">
                                    {data.heading}
                                </h2>

                                <p className="font-satoshi text-white/90 max-w-[750px] mt-5">
                                    {data.description}
                                </p>
                            </div>

                            {data.cta && (
                                <a
                                    href={data.cta.href || "#"}
                                    className="shrink-0 rounded-xl font-bold bg-white px-6 py-2.5 font-satoshi text-[14px] text-[#0F1D07] shadow-sm hover:bg-white/90 transition"
                                >
                                    {data.cta.label}
                                </a>
                            )}
                        </div>

                        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-1 h-[410px] overflow-hidden rounded-lg bg-white flex items-center justify-center">
                                {data.image?.url && (
                                    <img
                                        src={getMediaUrl(data.image.url)}
                                        alt={data.heading || "Our Process"}
                                        className="h-full w-full object-contain scale-[1.06] rounded-lg"
                                    />
                                )}
                            </div>

                            {data.cards?.[0] && (
                                <ProcessCard card={data.cards[0]} className="lg:col-start-3 lg:row-start-1" />
                            )}

                            {data.cards?.[1] && (
                                <ProcessCard card={data.cards[1]} className="lg:col-start-4 lg:row-start-1" />
                            )}

                            {data.cards?.[2] && (
                                <ProcessCard card={data.cards[2]} className="lg:col-start-1 lg:row-start-2" />
                            )}

                            {data.cards?.[3] && (
                                <ProcessCard card={data.cards[3]} className="lg:col-start-4 lg:row-start-2" />
                            )}

                            <div className="col-span-2 lg:col-start-2 lg:col-span-2 lg:row-start-2 h-[410px] overflow-hidden rounded-lg bg-black">
                                {data.video?.url && (
                                    <video
                                        src={getMediaUrl(data.video.url)}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="block md:hidden">
                        {/* Header Area */}
                        <div>
                            <span className="font-satoshi text-[15px] font-normal text-[#7E9275]">
                                {formattedEyebrow}
                            </span>

                            <h2 className="font-delight text-[clamp(28px,7.8vw,36px)] font-medium leading-[1.14] text-white mt-3 max-w-[340px] tracking-[-0.01em]">
                                {data.mobileHeading || data.heading}
                            </h2>

                            {(data.mobileDescription || data.description) && (
                                <p className="font-satoshi text-[14px] leading-[1.55] text-[#A2B499] mt-3.5 max-w-[330px]">
                                    {data.mobileDescription || data.description}
                                </p>
                            )}
                        </div>

                        {/* Mobile Services Horizontal Snap Slider */}
                        {servicePairs.length > 0 ? (
                            <div className="-mx-6 sm:-mx-8 flex items-stretch gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar scroll-pl-6 sm:scroll-pl-8 px-6 sm:px-8 mt-8 pb-2">
                                {servicePairs.map((pair, pairIndex) => (
                                    <div
                                        key={pairIndex}
                                        className="w-[calc(100vw-48px)] sm:w-[calc(100vw-64px)] shrink-0 flex items-stretch gap-3 sm:gap-4 snap-start"
                                    >
                                        {pair.map((item) => (
                                            <div
                                                key={item.id}
                                                className="w-[calc((100%-12px)/2)] sm:w-[calc((100%-16px)/2)] shrink-0 rounded-[8px] bg-[#2C3825] p-4 sm:p-4.5 flex flex-col justify-start min-h-[270px] select-none"
                                            >
                                                {item.icon?.url && (
                                                    <div className="h-6 w-6 mb-5 sm:mb-6 flex items-center justify-start">
                                                        <img
                                                            src={getMediaUrl(item.icon.url)}
                                                            alt=""
                                                            className="h-6 w-6 object-contain brightness-0 invert"
                                                        />
                                                    </div>
                                                )}

                                                <h3 className="font-delight text-[17px] sm:text-[18px] font-medium leading-tight text-white mb-2.5">
                                                    {item.title}
                                                </h3>

                                                <p className="font-satoshi text-[13px] sm:text-[13.5px] font-normal leading-[1.6] text-[#9EAFA0] flex-1">
                                                    {item.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                <div className="w-1 shrink-0" aria-hidden="true" />
                            </div>
                        ) : (
                            /* Fallback to horizontal slider for cards if service array is empty */
                            <div className="-mx-6 sm:-mx-8 flex items-stretch gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar scroll-pl-6 sm:scroll-pl-8 px-6 sm:px-8 mt-8 pb-2">
                                {cardPairs.map((pair, pairIndex) => (
                                    <div
                                        key={pairIndex}
                                        className="w-[calc(100vw-48px)] sm:w-[calc(100vw-64px)] shrink-0 flex items-stretch gap-3 sm:gap-4 snap-start"
                                    >
                                        {pair.map((card) => (
                                            <div key={card.id} className="w-[calc((100%-12px)/2)] sm:w-[calc((100%-16px)/2)] shrink-0">
                                                <ProcessCard card={card} className="!bg-[#2C3825]" />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                <div className="w-1 shrink-0" aria-hidden="true" />
                            </div>
                        )}

                        {/* Mobile Dual Action Buttons */}
                        <div className="mt-8 flex flex-col gap-3 w-full">
                            {(data.mobilePrimaryCta || data.cta) && (
                                <a
                                    href={data.mobilePrimaryCta?.href || data.cta?.href || "#quote"}
                                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#F0F2F0] hover:bg-white text-[#0C1805] py-3.5 px-6 font-satoshi text-[14.5px] font-medium transition shadow-sm text-center"
                                >
                                    <span>{data.mobilePrimaryCta?.label || data.cta?.label || "Get My Instant Quote"}</span>
                                    <span className="text-[17px] leading-none">→</span>
                                </a>
                            )}

                            {data.mobileSecondaryCta && (
                                <a
                                    href={data.mobileSecondaryCta.href || "#contact"}
                                    className="w-full flex items-center justify-center gap-2 rounded-full border border-[#2B3F23] hover:border-[#3C5731] bg-transparent text-white py-3.5 px-6 font-satoshi text-[14.5px] font-medium transition text-center"
                                >
                                    <span>{data.mobileSecondaryCta.label}</span>
                                    <span className="text-[17px] leading-none">→</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProcessCard({
    card,
    className = "",
}: {
    card: ProcessCard;
    className?: string;
}) {
    const [isHovered, setIsHovered] = useState(false);

    const ctaText = card.cta?.label?.toLowerCase().includes(card.title.toLowerCase())
        ? card.cta.label
        : `${card.cta?.label || "Explore"} ${card.title}`;

    const services = card.services || [];
    const hasServices = services.length > 0;

    return (
        <div
            className={`group relative flex h-[410px] w-full flex-col rounded-lg text-white overflow-hidden cursor-pointer transition-colors duration-300 select-none shadow-sm hover:shadow-xl ${
                hasServices && isHovered ? "bg-[#2D4620]" : "bg-[#1A2F11]"
            } ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsHovered((prev) => !prev)}
        >
            {/* Front View (Normal State) */}
            <div
                className={`flex h-full w-full flex-col justify-between p-7 lg:p-8 transition-all duration-300 ease-out ${
                    hasServices && isHovered
                        ? "opacity-0 pointer-events-none -translate-y-2 scale-[0.98]"
                        : "opacity-100 pointer-events-auto translate-y-0 scale-100"
                }`}
            >
                <div>
                    {/* Icon */}
                    {card.icon?.url && (
                        <img
                            src={getMediaUrl(card.icon.url)}
                            alt=""
                            className="h-8 w-8 object-contain brightness-0 invert"
                        />
                    )}

                    {/* Title */}
                    <h3 className="mt-4 font-satoshi text-[34px] font-bold leading-tight text-white">
                        {card.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 font-satoshi text-[14.5px] font-normal leading-[1.5] text-[#9BA893] max-w-[300px]">
                        {card.description}
                    </p>
                </div>

                {/* CTA */}
                {card.cta && (
                    <div className="mt-auto pt-6">
                        <div className="inline-flex items-center gap-3 font-satoshi text-[16px] font-semibold text-white transition-all duration-200">
                            <span>{ctaText}</span>
                            <svg
                                className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <polyline points="13 5 20 12 13 19" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* Hovered View (Services List) */}
            {hasServices && (
                <div
                    className={`absolute inset-0 flex h-full w-full flex-col justify-between px-7 pt-2.5 pb-10 bg-[#2D4620] transition-all duration-300 ease-out ${
                        isHovered
                            ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                            : "opacity-0 pointer-events-none translate-y-2 scale-[0.98]"
                    }`}
                >
                    <div className="flex h-full w-full flex-col justify-between -translate-y-1">
                        {services.map((service, idx) => (
                            <div
                                key={service.id || idx}
                                className={`flex flex-1 items-center gap-4.5 py-2 ${
                                    idx !== services.length - 1 ? "border-b border-[#3E5634]" : ""
                                }`}
                            >
                                <svg
                                    className="w-[10px] h-[17px] shrink-0 text-white"
                                    viewBox="0 0 10 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1 1L9 9L1 17"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="font-satoshi text-[14.5px] lg:text-[15px] font-normal leading-[1.3] text-white -translate-y-[1px]">
                                    {service.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
