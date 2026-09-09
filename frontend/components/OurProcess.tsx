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
    icon?: any;
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
    icon?: any;
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

    const ctaLabel = data.cta?.label || "Explore Our Services";
    const hasArrow = ctaLabel.includes("↗") || ctaLabel.includes("→") || ctaLabel.includes("->");

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
            <div className="w-full bg-[#0F1D07] px-4 py-12 sm:px-8 lg:px-16 lg:py-24 text-white">
                <div className="mx-auto max-w-[1300px] w-full">
                    {/* Header */}
                    <div className="mb-8 sm:mb-10 lg:mb-14">
                        <span className="font-satoshi text-[14px] sm:text-[15px] text-white/70">
                            {data.eyebrow}
                        </span>

                        <div className="flex flex-row items-center sm:items-end justify-between gap-4 mt-3 sm:mt-5">
                            <h2 className="font-delight text-[clamp(24px,5.5vw,36px)] font-medium max-w-[240px] xs:max-w-[300px] sm:max-w-[420px] lg:max-w-[500px] leading-[1.15]">
                                {data.heading}
                            </h2>

                            {data.cta && (
                                <a
                                    href={data.cta.href || "#"}
                                    className="shrink-0 rounded-xl font-bold bg-white px-3.5 sm:px-6 py-2 sm:py-2.5 font-satoshi text-[12px] sm:text-[14px] text-[#0F1D07] shadow-sm hover:bg-white/90 transition -translate-y-1 sm:-translate-y-2 flex items-center gap-1.5"
                                >
                                    <span>{ctaLabel}</span>
                                    {!hasArrow && (
                                        <span className="text-[13px] sm:text-[15px] leading-none">↗</span>
                                    )}
                                </a>
                            )}
                        </div>

                        <p className="font-satoshi text-white/90 text-[13.5px] sm:text-[15px] max-w-[750px] mt-3.5 sm:mt-5 leading-relaxed">
                            {data.description}
                        </p>
                    </div>

                    {/* Responsive Grid: 2 columns on mobile/tablet, 4 columns on desktop */}
                    <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {/* 1. Image Diagram Card */}
                        <div className="col-span-2 order-1 lg:order-none lg:col-start-1 lg:col-span-2 lg:row-start-1 h-[210px] sm:h-[300px] lg:h-[410px] overflow-hidden rounded-lg bg-white flex items-center justify-center">
                            {data.image?.url && (
                                <img
                                    src={getMediaUrl(data.image.url)}
                                    alt={data.heading || "Our Process"}
                                    className="h-full w-full object-contain scale-[1.02] lg:scale-[1.06] rounded-lg"
                                />
                            )}
                        </div>

                        {/* 2. Strategise Card */}
                        {data.cards?.[0] && (
                            <ProcessCard
                                card={data.cards[0]}
                                className="col-span-1 order-2 lg:order-none lg:col-start-3 lg:col-span-1 lg:row-start-1"
                            />
                        )}

                        {/* 3. Design Card */}
                        {data.cards?.[1] && (
                            <ProcessCard
                                card={data.cards[1]}
                                className="col-span-1 order-3 lg:order-none lg:col-start-4 lg:col-span-1 lg:row-start-1"
                            />
                        )}

                        {/* 4. Video Showcase Card */}
                        <div className="col-span-2 order-4 lg:order-none lg:col-start-2 lg:col-span-2 lg:row-start-2 h-[210px] sm:h-[300px] lg:h-[410px] overflow-hidden rounded-lg bg-black flex items-center justify-center">
                            {data.video?.url && (
                                <video
                                    src={getMediaUrl(data.video.url)}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="h-full w-full object-cover rounded-lg"
                                />
                            )}
                        </div>

                        {/* 5. Build Card */}
                        {data.cards?.[2] && (
                            <ProcessCard
                                card={data.cards[2]}
                                className="col-span-1 order-5 lg:order-none lg:col-start-1 lg:col-span-1 lg:row-start-2"
                            />
                        )}

                        {/* 6. Grow Card */}
                        {data.cards?.[3] && (
                            <ProcessCard
                                card={data.cards[3]}
                                className="col-span-1 order-6 lg:order-none lg:col-start-4 lg:col-span-1 lg:row-start-2"
                            />
                        )}
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
    const iconUrl = getMediaUrl(card.icon) || (card.icon?.url ? getMediaUrl(card.icon.url) : "");

    const ctaBase = card.cta?.label || "Explore";
    const ctaDesktop = ctaBase.toLowerCase().includes(card.title.toLowerCase())
        ? ctaBase
        : `${ctaBase} ${card.title}`;

    const services = card.services || [];
    const hasServices = services.length > 0;

    return (
        <div
            className={`group relative flex h-full min-h-[250px] sm:min-h-[280px] lg:h-[410px] w-full flex-col rounded-lg text-white overflow-hidden cursor-pointer transition-colors duration-300 select-none shadow-sm hover:shadow-xl ${
                hasServices && isHovered ? "bg-[#2D4620]" : "bg-[#1A2F11]"
            } ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsHovered((prev) => !prev)}
        >
            {/* Front View (Normal State) */}
            <div
                className={`flex h-full w-full flex-col justify-between p-4 sm:p-6 lg:p-8 transition-all duration-300 ease-out ${
                    hasServices && isHovered
                        ? "opacity-0 pointer-events-none -translate-y-2 scale-[0.98]"
                        : "opacity-100 pointer-events-auto translate-y-0 scale-100"
                }`}
            >
                <div>
                    {/* Icon */}
                    {iconUrl && (
                        <div className="h-7 w-7 sm:h-8 sm:w-8 mb-3 sm:mb-4 flex items-center justify-start">
                            <img
                                src={iconUrl}
                                alt={card.title || ""}
                                className="h-7 w-7 sm:h-8 sm:w-8 object-contain brightness-0 invert"
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="font-satoshi text-[17px] sm:text-[20px] lg:text-[34px] font-bold leading-tight text-white">
                        {card.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 sm:mt-2.5 lg:mt-3 font-satoshi text-[11.5px] sm:text-[13px] lg:text-[14.5px] font-normal leading-[1.45] text-[#9BA893] max-w-[300px]">
                        {card.description}
                    </p>
                </div>

                {/* CTA */}
                {card.cta && (
                    <div className="mt-auto pt-3 sm:pt-4 lg:pt-6">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 lg:gap-3 font-satoshi text-[12.5px] sm:text-[14px] lg:text-[16px] font-semibold text-white transition-all duration-200">
                            <span className="lg:hidden">{ctaBase}</span>
                            <span className="hidden lg:inline">{ctaDesktop}</span>
                            <svg
                                className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
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
                    className={`absolute inset-0 flex h-full w-full flex-col justify-between p-3.5 sm:p-5 lg:px-7 lg:pt-2.5 lg:pb-10 bg-[#2D4620] transition-all duration-300 ease-out ${
                        isHovered
                            ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                            : "opacity-0 pointer-events-none translate-y-2 scale-[0.98]"
                    }`}
                >
                    <div className="flex h-full w-full flex-col justify-between -translate-y-1">
                        {services.map((service, idx) => (
                            <div
                                key={service.id || idx}
                                className={`flex flex-1 items-center gap-2.5 sm:gap-3.5 lg:gap-4.5 py-1.5 sm:py-2 ${
                                    idx !== services.length - 1 ? "border-b border-[#3E5634]" : ""
                                }`}
                            >
                                <svg
                                    className="w-2 sm:w-[9px] lg:w-[10px] h-3.5 sm:h-[15px] lg:h-[17px] shrink-0 text-white"
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
                                <span className="font-satoshi text-[11.5px] sm:text-[13px] lg:text-[15px] font-normal leading-tight text-white">
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

