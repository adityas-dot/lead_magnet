"use client";

import { useState } from "react";
import { getMediaUrl } from "@/lib/strapi";

type Brand = {
    id: number;
    name: string;
    logo: {
        url: string;
    };
};

type BudgetRange = {
    id?: number;
    label: string;
    range?: string;
    value: string;
};

type FormOption = {
    id?: number;
    label: string;
    value: string;
};

type QuoteForm = {
    id?: number;
    // Step 1
    title?: string;
    description?: string;
    stepLabel?: string;
    shopifyQuestion?: string;
    yesLabel?: string;
    noLabel?: string;
    shopifyLinkLabel?: string;
    shopifyLinkPlaceholder?: string;
    continueLabel?: string;
    // Step 2
    step2Title?: string;
    step2Description?: string;
    step2Label?: string;
    budgetLabel?: string;
    budgetRanges?: BudgetRange[];
    issuesLabel?: string;
    issueOptions?: FormOption[];
    otherIssuesLabel?: string;
    otherIssuesPlaceholder?: string;
    budgetTypeLabel?: string;
    budgetTypeOptions?: FormOption[];
    estimateButtonLabel?: string;
    // Step 3
    resultTitle?: string;
    resultDescription?: string;
    step3Label?: string;
    estimateLabel?: string;
    basedOnLabel?: string;
    phoneLabel?: string;
    phonePlaceholder?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    bookCallButtonLabel?: string;
    disclaimer?: string;
};

type HeroData = {
    heading: string;
    description: string;
    primaryCta: {
        label: string;
        href: string;
    };
    brandsHeading?: string;
    brands: Brand[];
    quoteForm?: QuoteForm | QuoteForm[];
};

export default function Hero({ data }: { data: HeroData }) {
    const form = Array.isArray(data.quoteForm) ? data.quoteForm[0] : data.quoteForm;

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [hasStore, setHasStore] = useState<boolean | null>(null);
    const [storeUrl, setStoreUrl] = useState("");
    const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
    const [selectedBudget, setSelectedBudget] = useState<string>("");
    const [otherIssues, setOtherIssues] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const issuesList = form?.issueOptions || [];
    const budgetList = form?.budgetRanges || [];

    const toggleIssue = (label: string) => {
        setSelectedIssues((prev) =>
            prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
        );
    };

    const brandItems = data?.brands && data.brands.length > 0 ? data.brands : [];
    const trackBrands = brandItems.length > 0 && brandItems.length < 10
        ? [...brandItems, ...brandItems]
        : brandItems;

    const getBrandSize = (brand: Brand) => {
        const name = ((brand.name || "") + (brand.logo?.url || "")).toLowerCase();
        if (name.includes("figo")) return "h-7 sm:h-8 lg:h-8";
        if (name.includes("westside")) return "h-6 sm:h-7 lg:h-7";
        if (name.includes("stiff")) return "h-4 sm:h-4 lg:h-[28px] translate-y-[3px]";
        return "h-5 sm:h-6 lg:h-5";
    };

    const formattedHeading = (() => {
        if (!data.heading) return "";
        if (data.heading.includes("\n")) return data.heading;
        const words = data.heading.split(" ");
        const mid = Math.ceil(words.length / 2);
        return words.slice(0, mid).join(" ") + "\n" + words.slice(mid).join(" ");
    })();

    return (
        <section data-theme="dark" className="relative min-h-0 xl:min-h-screen bg-[#37386B] text-white flex flex-col font-sans overflow-x-hidden">
            <div className="flex-grow flex items-start xl:items-center pt-[100px] pb-0 xl:pb-12 px-6 lg:px-[40px] xl:px-[48px] 2xl:px-[80px]">
                <div className="max-w-[1720px] mx-auto w-full grid grid-cols-1 xl:grid-cols-[1fr_490px] 2xl:grid-cols-[1fr_620px] gap-8 xl:gap-8 2xl:gap-16 items-start">

                    {/* Left Column: Hero copy and client brands */}
                    <div className="max-w-full flex flex-col justify-between self-stretch min-w-0">
                        <div>
                            <h1 className="font-nohemi font-normal text-white text-[clamp(32px,3.8vw,80px)] tracking-[-0.01em] mb-6 leading-[1.7] sm:leading-[1.3] xl:leading-[1.15] 2xl:leading-[82px]">
                                {formattedHeading.split("\n").map((line, idx) => (
                                    <span key={idx} className="block whitespace-normal 2xl:whitespace-nowrap">
                                        {line}
                                    </span>
                                ))}
                            </h1>

                            <p className="font-satoshi text-white/70 lg:text-white text-[clamp(13px,1.2vw,18px)] mb-6 max-w-[778px] leading-[1.5] lg:leading-[35.4px] tracking-normal">
                                {data.description}
                            </p>

                            <a
                                href={data.primaryCta.href}
                                className="inline-flex items-center justify-center bg-white text-black px-8 py-3.5 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 ease-out gap-2 shadow-sm hover:shadow-md"
                            >
                                {data.primaryCta.label}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>

                        {/* Client logo marquee */}
                        <div className="mt-20 lg:mt-28 xl:mt-auto pt-8">
                            {data.brandsHeading && (
                                <p className="font-satoshi font-normal text-[#F6F6F6] text-[clamp(16px,1.4vw,20px)] mb-4 lg:mb-5 max-w-[864px] leading-[1.3] lg:leading-[33.6px] tracking-[-0.48px]">
                                    {data.brandsHeading}
                                </p>
                            )}
                            {brandItems.length > 0 && (
                                <div
                                    className="w-full max-w-[720px] overflow-hidden select-none"
                                    style={{
                                        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
                                    }}
                                >
                                    <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]">
                                        <div className="flex shrink-0 items-center gap-8 lg:gap-12 pr-8 lg:pr-12">
                                            {trackBrands.map((brand, idx) => (
                                                <img
                                                    key={`brand-track1-${idx}`}
                                                    src={getMediaUrl(brand.logo?.url)}
                                                    alt={brand.name || "Brand logo"}
                                                    className={`${getBrandSize(brand)} w-auto object-contain transition-all duration-300 opacity-90 hover:opacity-100 shrink-0`}
                                                    style={{ filter: 'brightness(0) invert(1)' }}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex shrink-0 items-center gap-8 lg:gap-12 pr-8 lg:pr-12" aria-hidden="true">
                                            {trackBrands.map((brand, idx) => (
                                                <img
                                                    key={`brand-track2-${idx}`}
                                                    src={getMediaUrl(brand.logo?.url)}
                                                    alt={brand.name || "Brand logo"}
                                                    className={`${getBrandSize(brand)} w-auto object-contain transition-all duration-300 opacity-90 hover:opacity-100 shrink-0`}
                                                    style={{ filter: 'brightness(0) invert(1)' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Interactive Shopify Quote Estimator */}
                    <div id="quote" data-theme="light" className="-mx-6 sm:-mx-8 lg:-mx-[60px] xl:mx-0 w-[calc(100%+48px)] sm:w-[calc(100%+64px)] lg:w-[calc(100%+120px)] xl:w-full bg-[#F9F9F9] text-black px-6 py-8 sm:p-8 lg:p-[40px] xl:p-8 2xl:p-[48px] pb-10 sm:pb-12 xl:pb-8 2xl:pb-[48px] shadow-2xl relative mt-8 xl:mt-0 rounded-t-[20px] rounded-b-none xl:rounded-none transition-all duration-300 scroll-mt-24">
                        <h2 className="font-nohemi text-[clamp(26px,2.5vw,36px)] font-normal text-[#1A1A1A] mb-2 leading-tight">
                            {step === 1 && form?.title}
                            {step === 2 && form?.step2Title}
                            {step === 3 && form?.resultTitle}
                        </h2>
                        <p className="font-satoshi text-[#6B6B6B] text-[14px] leading-relaxed mb-6">
                            {step === 1 && form?.description}
                            {step === 2 && form?.step2Description}
                            {step === 3 && form?.resultDescription}
                        </p>

                        {/* Step progress tabs */}
                        <div className="flex items-center gap-4 mb-6 select-none">
                            <div
                                onClick={() => setStep(1)}
                                className={`flex-1 ${step > 1 ? "cursor-pointer group" : ""}`}
                            >
                                <p className={`font-satoshi text-[14px] font-medium mb-2 ${step === 1 ? "text-[#3441D4]" : "text-transparent"}`}>
                                    {form?.stepLabel}
                                </p>
                                <div className={`h-[3px] w-full rounded-full transition-colors duration-300 ${step >= 1 ? "bg-[#1A1A1A]" : "bg-[#E0E0E0]"}`}></div>
                            </div>

                            <div
                                onClick={() => (step > 2 ? setStep(2) : null)}
                                className={`flex-1 ${step > 2 ? "cursor-pointer group" : ""}`}
                            >
                                <p className={`font-satoshi text-[14px] font-medium mb-2 ${step === 2 ? "text-[#3441D4]" : "text-transparent"}`}>
                                    {form?.step2Label}
                                </p>
                                <div className={`h-[3px] w-full rounded-full transition-colors duration-300 ${step >= 2 ? "bg-[#1A1A1A]" : "bg-[#E0E0E0]"}`}></div>
                            </div>

                            <div className="flex-1">
                                <p className={`font-satoshi text-[14px] font-medium mb-2 ${step === 3 ? "text-[#3441D4]" : "text-transparent"}`}>
                                    {form?.step3Label}
                                </p>
                                <div className={`h-[3px] w-full rounded-full transition-colors duration-300 ${step >= 3 ? "bg-[#1A1A1A]" : "bg-[#E0E0E0]"}`}></div>
                            </div>
                        </div>

                        {/* Step 1: Store status & URL */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="font-nohemi block text-[17px] font-normal text-[#1A1A1A] mb-2">
                                        {form?.shopifyQuestion}
                                    </label>
                                    <div className="flex flex-wrap gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => setHasStore(true)}
                                            className={`font-satoshi px-5 py-2.5 rounded-full border text-[14px] transition-all duration-300 ease-out cursor-pointer ${
                                                hasStore === true
                                                    ? "border-[#2B44E7] bg-[#EEF2FF] text-[#2B44E7] font-medium"
                                                    : "border-[#CAC4D0] text-[#000000] bg-white hover:border-gray-400"
                                            }`}
                                        >
                                            {form?.yesLabel}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setHasStore(false)}
                                            className={`font-satoshi px-5 py-2.5 rounded-full border text-[14px] transition-all duration-300 ease-out cursor-pointer ${
                                                hasStore === false
                                                    ? "border-[#2B44E7] bg-[#EEF2FF] text-[#2B44E7] font-medium"
                                                    : "border-[#CAC4D0] text-[#000000] bg-white hover:border-gray-400"
                                            }`}
                                        >
                                            {form?.noLabel?.replace("No, But I want", "No, I want") || form?.noLabel || "No, I want to build one"}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <label className="font-nohemi block text-[17px] font-normal text-[#1A1A1A] mb-2">
                                        {form?.shopifyLinkLabel}
                                    </label>
                                    <input
                                        type="text"
                                        value={storeUrl}
                                        onChange={(e) => setStoreUrl(e.target.value)}
                                        placeholder={form?.shopifyLinkPlaceholder}
                                        className="font-satoshi w-full px-5 py-2 sm:py-2.5 rounded-full border border-[#CAC4D0] focus:outline-none focus:border-[#2B44E7] focus:ring-1 focus:ring-[#2B44E7] text-[14px] text-[#3C3C3C] bg-[#F7F7F9] placeholder-[#8E8E93] transition-all duration-300 ease-out"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="font-satoshi w-full bg-[#2B44E7] hover:bg-[#2037CA] text-white font-medium py-2 sm:py-2.5 rounded-full transition-all duration-300 ease-out flex justify-center items-center gap-2 mt-[200px] sm:mt-[230px] lg:mt-[110px] xl:mt-[90px] 2xl:mt-[120px] text-[15px] sm:text-[16px] shadow-none cursor-pointer"
                                >
                                    {form?.continueLabel}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Step 2: Issues & budget selection */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="font-nohemi block text-[17px] font-normal text-[#1A1A1A] mb-2">
                                        {form?.issuesLabel}
                                    </label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {issuesList.map((item) => {
                                            const isSelected = selectedIssues.includes(item.label);
                                            return (
                                                <button
                                                    key={item.id || item.value}
                                                    type="button"
                                                    onClick={() => toggleIssue(item.label)}
                                                    className={`font-satoshi px-5 py-2.5 rounded-full border text-[14px] transition-all duration-300 ease-out cursor-pointer ${
                                                        isSelected
                                                            ? "border-[#2B44E7] bg-[#EEF2FF] text-[#2B44E7] font-medium"
                                                            : "border-[#CAC4D0] text-[#000000] bg-white hover:border-gray-400"
                                                    }`}
                                                >
                                                    {item.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="font-nohemi block text-[17px] font-normal text-[#1A1A1A] mb-2">
                                        {form?.budgetLabel}
                                    </label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {budgetList.map((tier) => {
                                            const isSelected = selectedBudget === tier.value;
                                            return (
                                                <button
                                                    key={tier.id || tier.value}
                                                    type="button"
                                                    onClick={() => setSelectedBudget(tier.value)}
                                                    className={`font-satoshi px-5 py-2.5 rounded-full border text-[14px] transition-all duration-300 ease-out cursor-pointer ${
                                                        isSelected
                                                            ? "border-[#2B44E7] bg-[#EEF2FF] text-[#2B44E7] font-medium"
                                                            : "border-[#CAC4D0] text-[#000000] bg-white hover:border-gray-400"
                                                    }`}
                                                >
                                                    {tier.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="font-nohemi block text-[17px] font-normal text-[#1A1A1A] mb-2">
                                        {form?.otherIssuesLabel}
                                    </label>
                                    <input
                                        type="text"
                                        value={otherIssues}
                                        onChange={(e) => setOtherIssues(e.target.value)}
                                        placeholder={form?.otherIssuesPlaceholder}
                                        className="font-satoshi w-full px-5 py-2 sm:py-2.5 rounded-full border border-[#CAC4D0] focus:outline-none focus:border-[#2B44E7] focus:ring-1 focus:ring-[#2B44E7] text-[14px] text-[#3C3C3C] bg-[#F7F7F9] placeholder-[#8E8E93] transition-all duration-300 ease-out"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="font-satoshi w-full bg-[#2B44E7] hover:bg-[#2037CA] text-white font-medium py-2 sm:py-2.5 rounded-full transition-all duration-300 ease-out flex justify-center items-center gap-2 mt-6 text-[15px] sm:text-[16px] shadow-none cursor-pointer"
                                >
                                    {form?.estimateButtonLabel}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Step 3: Estimate breakdown & lead capture */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-nohemi text-[17px] font-normal text-[#1A1A1A]">
                                        {form?.estimateLabel}
                                    </h3>
                                    <p className="font-satoshi text-[13px] text-[#555555] mt-1">
                                        {form?.basedOnLabel}{" "}
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="font-satoshi text-[#2B44E7] underline hover:opacity-80 transition-opacity inline cursor-pointer font-medium"
                                        >
                                            {selectedIssues.length > 0 ? selectedIssues.join(", ") : "Select issues"}
                                        </button>
                                    </p>

                                    <div className="mt-3 space-y-2">
                                        {budgetList.map((tier) => {
                                            const isChosen = selectedBudget === tier.value;
                                            return isChosen ? (
                                                <div key={tier.id || tier.value} className="py-1">
                                                    <p className="font-satoshi text-[14px] font-medium text-[#2B44E7]">
                                                        {tier.label} (Chosen Plan)
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="font-nohemi text-[24px] sm:text-[28px] font-normal text-[#2B44E7] tracking-tight">
                                                            {tier.range}
                                                        </span>
                                                        <svg className="w-6 h-6 text-[#38A169] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="12" cy="12" r="9" />
                                                            <polyline points="9 12 11.5 14.5 15.5 9.5" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    key={tier.id || tier.value}
                                                    onClick={() => setSelectedBudget(tier.value)}
                                                    className="text-[#6B6B6B] cursor-pointer hover:text-[#333333] transition-colors"
                                                >
                                                    <p className="font-satoshi text-[12px] leading-tight">{tier.label}</p>
                                                    <p className="font-satoshi text-[13px] text-[#444444] font-medium">{tier.range}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <div>
                                        <label className="font-nohemi block text-[17px] font-normal text-[#1A1A1A] mb-2">
                                            {form?.phoneLabel}
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder={form?.phonePlaceholder}
                                            className="font-satoshi w-full px-5 py-2 sm:py-2.5 rounded-full border border-[#CAC4D0] focus:outline-none focus:border-[#2B44E7] focus:ring-1 focus:ring-[#2B44E7] text-[14px] text-[#3C3C3C] bg-[#F7F7F9] placeholder-[#8E8E93] transition-all duration-300 ease-out"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-nohemi block text-[17px] font-normal text-[#1A1A1A] mb-2">
                                            {form?.emailLabel}
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={form?.emailPlaceholder}
                                            className="font-satoshi w-full px-5 py-2 sm:py-2.5 rounded-full border border-[#CAC4D0] focus:outline-none focus:border-[#2B44E7] focus:ring-1 focus:ring-[#2B44E7] text-[14px] text-[#3C3C3C] bg-[#F7F7F9] placeholder-[#8E8E93] transition-all duration-300 ease-out"
                                        />
                                    </div>
                                </div>

                                {isSubmitted ? (
                                    <div className="p-4 rounded-xl bg-[#EBF7F2] text-[#1E7448] text-center font-satoshi text-[14px] mt-4">
                                        ✓ Thank you! We&apos;ve received your request and will review your store.
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsSubmitted(true)}
                                        className="font-satoshi w-full bg-[#2B44E7] hover:bg-[#2037CA] text-white font-medium py-2 sm:py-2.5 rounded-full transition-all duration-300 ease-out flex justify-center items-center gap-2 mt-4 text-[15px] sm:text-[16px] shadow-none cursor-pointer"
                                    >
                                        {form?.bookCallButtonLabel}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                )}

                                <p className="text-center font-satoshi text-[12px] text-[#777777] pt-1">
                                    {form?.disclaimer}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}