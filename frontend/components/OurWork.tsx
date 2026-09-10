"use client";

import { useState, useRef } from "react";
import { getMediaUrl } from "@/lib/strapi";

type OurWorkImage = {
    url: string;
    alternativeText?: string | null;
};

type OurWorkProject = {
    id: number;
    images?: OurWorkImage | OurWorkImage[] | null;
    mobileImages?: OurWorkImage | OurWorkImage[] | null;
};

type OurWorkData = {
    heading: string;
    description: string;
    MobileDescription?: string;
    projects: OurWorkProject[];
};

function getMediaAlt(media?: OurWorkImage | OurWorkImage[] | null, fallback: string = ""): string {
    if (!media) return fallback;
    const item = Array.isArray(media) ? media[0] : media;
    return item?.alternativeText || fallback;
}

export default function OurWork({ data }: { data: OurWorkData }) {
    const projects = data?.projects || [];
    const hasMultipleProjects = projects.length > 1;

    // Infinite clone slider: [lastProject, ...projects, firstProject]
    // Index 1 corresponds to projects[0]
    const [currentIndex, setCurrentIndex] = useState(1);
    const [withTransition, setWithTransition] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    const touchStartX = useRef<number | null>(null);
    const touchDeltaX = useRef<number>(0);

    const slides = hasMultipleProjects
        ? [projects[projects.length - 1], ...projects, projects[0]]
        : projects;

    const nextProject = () => {
        if (!hasMultipleProjects || isAnimating) return;
        setIsAnimating(true);
        setWithTransition(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const previousProject = () => {
        if (!hasMultipleProjects || isAnimating) return;
        setIsAnimating(true);
        setWithTransition(true);
        setCurrentIndex((prev) => prev - 1);
    };

    const goToProject = (dotIdx: number) => {
        if (!hasMultipleProjects || isAnimating) return;
        const targetIndex = dotIdx + 1;
        if (targetIndex === currentIndex) return;
        setIsAnimating(true);
        setWithTransition(true);
        setCurrentIndex(targetIndex);
    };

    const handleTransitionEnd = () => {
        if (!hasMultipleProjects) return;

        if (currentIndex === slides.length - 1) {
            // Reached clone of first item -> reset instantly to real first item (index 1)
            setWithTransition(false);
            setCurrentIndex(1);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setWithTransition(true);
                    setIsAnimating(false);
                });
            });
        } else if (currentIndex === 0) {
            // Reached clone of last item -> reset instantly to real last item
            setWithTransition(false);
            setCurrentIndex(projects.length);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setWithTransition(true);
                    setIsAnimating(false);
                });
            });
        } else {
            setIsAnimating(false);
        }
    };

    // Active project index (0..projects.length - 1) for indicators
    const activeProjectIndex = hasMultipleProjects
        ? (currentIndex - 1 + projects.length) % projects.length
        : 0;

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current === null) return;
        if (Math.abs(touchDeltaX.current) > 45) {
            if (touchDeltaX.current < 0) {
                nextProject();
            } else {
                previousProject();
            }
        }
        touchStartX.current = null;
        touchDeltaX.current = 0;
    };

    const formatDescription = (desc: string) => {
        if (!desc) return "";
        const match = desc.match(/(.*?\bredesign to)\s+(full technical management.*)/i);
        if (match) {
            return (
                <>
                    <span>{match[1]}</span>
                    <br className="hidden md:block" />
                    <span className="md:hidden"> </span>
                    <span>{match[2]}</span>
                </>
            );
        }
        return desc;
    };

    return (
        <section className="w-full py-10 sm:py-20 overflow-hidden">
            <div className="mx-auto flex w-full max-w-[1880px] flex-col px-6 lg:px-[60px] xl:px-[80px]">
                <div className="flex w-full justify-between items-end gap-6">
                    <div className="max-w-[960px]">
                        <h2 className="font-nohemi text-[clamp(28px,4vw,65px)] font-normal font-[400] leading-[1.15] tracking-[-0.015em] text-[#000000]">
                            {data.heading}
                        </h2>

                        {data.MobileDescription && (
                            <p className="block md:hidden max-w-[650px] font-satoshi font-medium text-[clamp(14px,4.2vw,16px)] text-[#262626] whitespace-pre-line leading-relaxed mt-4">
                                {data.MobileDescription}
                            </p>
                        )}
                        <p
                            className={`${
                                data.MobileDescription ? "hidden md:block" : ""
                            } max-w-[960px] font-satoshi text-[clamp(14px,1.2vw,16px)] font-medium text-[#000000] whitespace-pre-line leading-relaxed mt-3`}
                        >
                            {formatDescription(data.description)}
                        </p>
                    </div>

                    {/* Desktop project navigation */}
                    <div className="hidden md:flex gap-3 shrink-0 mb-1">
                        <button
                            onClick={previousProject}
                            type="button"
                            aria-label="Previous project"
                            disabled={!hasMultipleProjects || isAnimating}
                            className={`flex h-11 w-11 items-center justify-center rounded-md bg-[#092008] transition-opacity ${
                                hasMultipleProjects
                                    ? "hover:opacity-80 cursor-pointer opacity-100 active:scale-95"
                                    : "opacity-40 cursor-not-allowed"
                            }`}
                        >
                            <img
                                src="/images/arrow_left.svg"
                                alt=""
                                className="h-4 w-4"
                            />
                        </button>

                        <button
                            onClick={nextProject}
                            type="button"
                            aria-label="Next project"
                            disabled={!hasMultipleProjects || isAnimating}
                            className={`flex h-11 w-11 items-center justify-center rounded-md bg-[#092008] transition-opacity ${
                                hasMultipleProjects
                                    ? "hover:opacity-80 cursor-pointer opacity-100 active:scale-95"
                                    : "opacity-40 cursor-not-allowed"
                            }`}
                        >
                            <img
                                src="/images/arrow_right.svg"
                                alt=""
                                className="h-4 w-4"
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile project navigation */}
                {hasMultipleProjects && (
                    <div className="flex md:hidden items-center justify-between w-full mt-6 pt-1">
                        <button
                            onClick={previousProject}
                            type="button"
                            disabled={isAnimating}
                            className="flex items-center gap-2 font-satoshi text-[15px] font-medium text-[#000000] hover:opacity-75 transition-opacity cursor-pointer select-none"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            <span>Back</span>
                        </button>

                        {/* Tracker Indicator */}
                        <div className="flex items-center gap-1.5">
                            {[0, 1, 2].slice(0, Math.min(3, projects.length)).map((dotIdx) => {
                                const isCurrent = dotIdx === (activeProjectIndex % Math.min(3, projects.length));

                                return (
                                    <button
                                        key={dotIdx}
                                        onClick={() => goToProject(dotIdx)}
                                        type="button"
                                        aria-label={`Indicator ${dotIdx + 1}`}
                                        className={`transition-all duration-300 ease-out rounded-full cursor-pointer ${
                                            isCurrent
                                                ? "w-7 h-1.5 bg-[#2442EB]"
                                                : "w-2.5 h-1.5 bg-[#2442EB]/25 hover:bg-[#2442EB]/40"
                                        }`}
                                    />
                                );
                            })}
                        </div>

                        <button
                            onClick={nextProject}
                            type="button"
                            disabled={isAnimating}
                            className="flex items-center gap-2 font-satoshi text-[15px] font-medium text-[#000000] hover:opacity-75 transition-opacity cursor-pointer select-none"
                        >
                            <span>Next</span>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Responsive project banner with hardware-accelerated GPU slide */}
            <div
                className="mt-6 sm:mt-12 w-full overflow-hidden select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {slides.length > 0 ? (
                    <div
                        className="flex w-full will-change-transform"
                        style={{
                            transform: `translate3d(-${hasMultipleProjects ? currentIndex * 100 : 0}%, 0, 0)`,
                            transition: withTransition
                                ? "transform 550ms cubic-bezier(0.16, 1, 0.3, 1)"
                                : "none",
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {slides.map((proj, idx) => {
                            const bUrl = getMediaUrl(proj?.images);
                            const mUrl = getMediaUrl(proj?.mobileImages);
                            const alt =
                                getMediaAlt(proj?.images) ||
                                getMediaAlt(proj?.mobileImages) ||
                                data?.heading ||
                                "Our Work";

                            return (
                                <div key={idx} className="w-full shrink-0">
                                    <picture className="w-full block">
                                        {mUrl && (
                                            <source media="(max-width: 767px)" srcSet={mUrl} />
                                        )}
                                        <img
                                            src={bUrl || mUrl || ""}
                                            alt={alt}
                                            className="h-auto w-full object-cover block select-none pointer-events-none"
                                            draggable={false}
                                        />
                                    </picture>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="mx-auto max-w-[1300px] px-8">
                        <div className="flex h-[320px] w-full items-center justify-center rounded-2xl bg-[#F5F5F5] text-gray-400">
                            <p className="font-satoshi text-base">No banner image available</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}