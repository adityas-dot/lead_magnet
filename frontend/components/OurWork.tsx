"use client";

import { useState } from "react";
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
    const [currentProject, setCurrentProject] = useState(0);

    const projects = data?.projects || [];
    const hasMultipleProjects = projects.length > 1;
    const project = projects[currentProject];

    const nextProject = () => {
        if (!hasMultipleProjects) return;
        setCurrentProject((current) =>
            current === projects.length - 1 ? 0 : current + 1
        );
    };

    const previousProject = () => {
        if (!hasMultipleProjects) return;
        setCurrentProject((current) =>
            current === 0 ? projects.length - 1 : current - 1
        );
    };

    const bannerUrl = getMediaUrl(project?.images);
    const mobileUrl = getMediaUrl(project?.mobileImages);
    const altText =
        getMediaAlt(project?.images) ||
        getMediaAlt(project?.mobileImages) ||
        data?.heading ||
        "Our Work";

    return (
        <section className="w-full py-10 sm:py-20 overflow-hidden">
            <div className="mx-auto flex w-full max-w-[1880px] flex-col px-6 lg:px-[60px] xl:px-[80px]">
                <div className="flex w-full justify-between items-end gap-6">
                    <div className="max-w-[900px]">
                        <h2 className="font-nohemi text-[clamp(32px,4.2vw,52px)] font-medium leading-[1.15] text-[#000000]">
                            {data.heading}
                        </h2>

                        {data.MobileDescription && (
                            <p className="block md:hidden max-w-[650px] font-satoshi text-[clamp(14px,4.2vw,16px)] text-[#262626] whitespace-pre-line leading-relaxed mt-4">
                                {data.MobileDescription}
                            </p>
                        )}
                        <p
                            className={`${
                                data.MobileDescription ? "hidden md:block" : ""
                            } max-w-[820px] font-satoshi text-[clamp(14px,1.2vw,16px)] font-medium text-[#000000] whitespace-pre-line leading-relaxed mt-3`}
                        >
                            {data.description}
                        </p>
                    </div>

                    {/* Desktop project navigation */}
                    <div className="hidden md:flex gap-3 shrink-0 mb-1">
                        <button
                            onClick={previousProject}
                            type="button"
                            aria-label="Previous project"
                            disabled={!hasMultipleProjects}
                            className={`flex h-11 w-11 items-center justify-center rounded-md bg-[#092008] transition-opacity ${
                                hasMultipleProjects
                                    ? "hover:opacity-80 cursor-pointer opacity-100"
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
                            disabled={!hasMultipleProjects}
                            className={`flex h-11 w-11 items-center justify-center rounded-md bg-[#092008] transition-opacity ${
                                hasMultipleProjects
                                    ? "hover:opacity-80 cursor-pointer opacity-100"
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

                        {/* Tracker Indicator Dots */}
                        <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1.5">
                                {projects.map((p, idx) => {
                                    const isCurrent = idx === currentProject;
                                    return (
                                        <button
                                            key={p.id || idx}
                                            onClick={() => setCurrentProject(idx)}
                                            type="button"
                                            aria-label={`Go to slide ${idx + 1}`}
                                            className={`transition-all duration-300 rounded-full ${
                                                isCurrent
                                                    ? "w-7 h-2 bg-[#092008]"
                                                    : "w-2 h-2 bg-[#092008]/25 hover:bg-[#092008]/50"
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            onClick={nextProject}
                            type="button"
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

            {/* Responsive project banner */}
            <div className="mt-6 sm:mt-12 w-full overflow-hidden">
                {bannerUrl || mobileUrl ? (
                    <picture key={currentProject} className="w-full">
                        {mobileUrl && (
                            <source media="(max-width: 767px)" srcSet={mobileUrl} />
                        )}
                        <img
                            src={bannerUrl || mobileUrl || ""}
                            alt={altText}
                            className="h-auto w-full object-cover block"
                        />
                    </picture>
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