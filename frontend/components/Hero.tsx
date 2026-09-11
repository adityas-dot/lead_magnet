"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getMediaUrl } from "@/lib/strapi";
import CallbackModal from "./CallbackModal";

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
    storeWarning?: string;
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
    issuesWarning?: string;
    budgetWarning?: string;
    selectionWarning?: string;
    estimateButtonLabel?: string;
    // Step 3
    resultTitle?: string;
    resultDescription?: string;
    step3Label?: string;
    estimateLabel?: string;
    basedOnLabel?: string;
    phoneLabel?: string;
    phonePlaceholder?: string;
    phoneWarning?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    bookCallButtonLabel?: string;
    successTitle?: string;
    successDescription?: string;
    disclaimer?: string;
    closeButtonLabel?: string;
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
    if (!data) return null;
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
    const [isCallbackOpen, setIsCallbackOpen] = useState(false);

    // Validation & warning states
    const [step1Warning, setStep1Warning] = useState("");
    const [step2Warning, setStep2Warning] = useState("");
    const [step3Warning, setStep3Warning] = useState("");
    const [issuesTouched, setIssuesTouched] = useState(false);
    const [budgetTouched, setBudgetTouched] = useState(false);
    const [phoneTouched, setPhoneTouched] = useState(false);

    useEffect(() => {
        const handleOpenCallback = () => setIsCallbackOpen(true);
        window.addEventListener("open-callback-modal", handleOpenCallback);
        return () => window.removeEventListener("open-callback-modal", handleOpenCallback);
    }, []);

    const defaultBudgets: BudgetRange[] = [
        { label: "Essential", range: "₹1,00,000 -₹2,00,000", value: "essential" },
        { label: "Balanced", range: "₹2,00,000 -₹5,00,000", value: "balanced" },
        { label: "Premium", range: "₹5,00,000 -₹10,00,000", value: "premium" },
    ];

    const issuesList = form?.issueOptions || [];
    const budgetList = form?.budgetRanges && form.budgetRanges.length > 0 ? form.budgetRanges : defaultBudgets;

    // Helper to render currency (specifically Indian Rupee ₹) clearly with proper font and alignment
    // Helper to render currency (specifically Indian Rupee ₹) with Satoshi font
    const formatCurrency = (text?: string) => {
        if (!text) return "";
        const cleanText = text.replace(/\s*-\s*₹?/g, " -₹").replace(/^₹?\s*/, "₹");
        const parts = cleanText.split(/(₹)/g);
        if (parts.length === 1) return text;
        return (
            <span className="inline-flex items-center self-center">
                {parts.map((part, idx) => {
                    if (!part) return null;
                    if (part === "₹") {
                        return (
                            <span
                                key={idx}
                                className="font-satoshi font-normal text-[1.12em] inline-block select-none leading-none"
                                style={{
                                    verticalAlign: "-0.02em",
                                }}
                            >
                                ₹
                            </span>
                        );
                    }
                    return <span key={idx} className="self-center">{part}</span>;
                })}
            </span>
        );
    };

    const toggleIssue = (label: string) => {
        setSelectedIssues((prev) => {
            const next = prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label];
            if (next.length > 0) {
                setIssuesTouched(false);
                if (selectedBudget) {
                    setStep2Warning("");
                } else if (budgetTouched) {
                    setStep2Warning(form?.budgetWarning || "Please select your preferred budget range");
                }
            }
            return next;
        });
    };

    const handleSelectBudget = (value: string) => {
        setSelectedBudget(value);
        setBudgetTouched(false);
        if (selectedIssues.length > 0) {
            setStep2Warning("");
        } else if (issuesTouched) {
            setStep2Warning(form?.issuesWarning || "Please select at least one issue that needs improvement");
        }
    };

    const handleStep1Continue = () => {
        if (hasStore === null) {
            setStep1Warning(form?.storeWarning || "Please select whether you own a Shopify website");
            return;
        }
        setStep1Warning("");
        setStep(2);
    };

    const handleStep2Continue = () => {
        const hasNoIssues = selectedIssues.length === 0;
        const hasNoBudget = !selectedBudget;

        if (hasNoIssues && hasNoBudget) {
            setIssuesTouched(true);
            setBudgetTouched(true);
            setStep2Warning(form?.selectionWarning || "Please select what needs improvement and your budget range");
            return;
        }
        if (hasNoIssues) {
            setIssuesTouched(true);
            setStep2Warning(form?.issuesWarning || "Please select at least one issue that needs improvement");
            return;
        }
        if (hasNoBudget) {
            setBudgetTouched(true);
            setStep2Warning(form?.budgetWarning || "Please select your preferred budget range");
            return;
        }

        setIssuesTouched(false);
        setBudgetTouched(false);
        setStep2Warning("");
        setStep(3);
    };

    const handlePhoneChange = (val: string) => {
        setPhone(val);
        if (val.trim().replace(/\D/g, "").length >= 7) {
            setStep3Warning("");
            setPhoneTouched(false);
        }
    };

    const handleBookCallSubmit = (e?: React.MouseEvent | React.FormEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setPhoneTouched(true);

        const cleanDigits = phone.trim().replace(/\D/g, "");
        if (!phone.trim() || cleanDigits.length < 7) {
            setStep3Warning(form?.phoneWarning || "Please enter a valid phone number");
            return;
        }

        setStep3Warning("");
        setIsSubmitted(true);
    };

    const brandItems = data?.brands && data.brands.length > 0 ? data.brands : [];
    const trackBrands = brandItems.length > 0 && brandItems.length < 10
        ? [...brandItems, ...brandItems]
        : brandItems;

    const getBrandSize = (brand: Brand) => {
        const name = ((brand.name || "") + (brand.logo?.url || "")).toLowerCase();
        if (name.includes("figo")) return "h-6 sm:h-7 lg:h-7.5";
        if (name.includes("westside")) return "h-5.5 sm:h-6.5 lg:h-7";
        if (name.includes("stiff")) return "h-5.5 sm:h-6.5 lg:h-7";
        if (name.includes("paloma")) return "h-5 sm:h-5.5 lg:h-6";
        return "h-5 sm:h-5.5 lg:h-6";
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
                            <h1 className="font-nohemi font-normal text-white text-[clamp(38px,3.8vw,80px)] tracking-[-0.01em] mb-6 leading-[1.7] sm:leading-[1.3] xl:leading-[1.15] 2xl:leading-[82px]">
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
                                href={data.primaryCta?.href || "#call"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const h = (data.primaryCta?.href || "").toLowerCase();
                                    const l = (data.primaryCta?.label || "").toLowerCase();
                                    if (h === "#quote" || (h.includes("quote") && !l.includes("call"))) {
                                        window.dispatchEvent(new CustomEvent("open-quote-modal"));
                                    } else {
                                        setIsCallbackOpen(true);
                                        window.dispatchEvent(new CustomEvent("open-callback-modal"));
                                    }
                                }}
                                className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-black px-8 py-4 sm:py-3.5 rounded-full font-satoshi font-medium text-[16px] sm:text-[15px] hover:bg-gray-100 transition-all duration-300 ease-out gap-2.5 shadow-sm hover:shadow-md cursor-pointer"
                            >
                                {data.primaryCta?.label || "Book a Free Call"}
                                <svg className="w-4.5 h-4.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>

                        {/* Client logo marquee */}
                        <div className="mt-20 lg:mt-28 xl:mt-auto pt-8">
                            {data.brandsHeading && (
                                <p className="font-satoshi font-normal text-[#F6F6F6] text-[clamp(13px,1.15vw,18px)] mb-3 lg:mb-4 w-full whitespace-nowrap leading-tight tracking-[-0.3px]">
                                    {data.brandsHeading}
                                </p>
                            )}
                            {brandItems.length > 0 && (
                                <div
                                    className="w-full max-w-[963px] overflow-hidden select-none"
                                    style={{
                                        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)'
                                    }}
                                >
                                    <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]">
                                        <div className="flex shrink-0 items-center gap-8 lg:gap-12 pr-8 lg:pr-12">
                                            {trackBrands.map((brand, idx) => (
                                                <div key={`brand-track1-${idx}`} className="flex items-center justify-center h-9 sm:h-10 shrink-0">
                                                    <img
                                                        src={getMediaUrl(brand.logo)}
                                                        alt={brand.name || "Brand logo"}
                                                        className={`${getBrandSize(brand)} w-auto object-contain transition-all duration-300 opacity-90 hover:opacity-100`}
                                                        style={{ filter: 'brightness(0) invert(1)' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex shrink-0 items-center gap-8 lg:gap-12 pr-8 lg:pr-12" aria-hidden="true">
                                            {trackBrands.map((brand, idx) => (
                                                <div key={`brand-track2-${idx}`} className="flex items-center justify-center h-9 sm:h-10 shrink-0">
                                                    <img
                                                        src={getMediaUrl(brand.logo)}
                                                        alt={brand.name || "Brand logo"}
                                                        className={`${getBrandSize(brand)} w-auto object-contain transition-all duration-300 opacity-90 hover:opacity-100`}
                                                        style={{ filter: 'brightness(0) invert(1)' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Interactive Shopify Quote Estimator */}
                    <div id="quote" data-quote-form="true" data-theme="light" className="-mx-6 sm:-mx-8 lg:-mx-[60px] xl:mx-0 w-[calc(100%+48px)] sm:w-[calc(100%+64px)] lg:w-[calc(100%+120px)] xl:w-full bg-[#F9F9F9] text-black px-6 py-8 sm:p-8 lg:p-[40px] xl:p-8 2xl:p-[48px] pb-10 sm:pb-12 xl:pb-8 2xl:pb-[48px] shadow-2xl relative mt-8 xl:mt-0 rounded-t-[20px] rounded-b-none xl:rounded-none transition-all duration-300 scroll-mt-24">
                        <h2 className="font-nohemi text-[clamp(26px,2.5vw,36px)] font-normal text-[#1A1A1A] mb-2 leading-tight">
                            {step === 1 && (form?.title || "Get an instant quote")}
                            {step === 2 && (form?.step2Title || "Choose your budget range")}
                            {step === 3 && (form?.resultTitle || "Your Instant Quote Is Ready!")}
                        </h2>
                        <p className="font-satoshi text-[#6B6B6B] text-[14px] leading-relaxed mb-6">
                            {step === 1 && (form?.description || "Book a free consultation with us. We'll discuss materials, your vision, and provide an estimate.")}
                            {step === 2 && (form?.step2Description || "Select what’s not working and your preferred budget.")}
                            {step === 3 && (form?.resultDescription || "Based on your inputs, here’s your estimated range")}
                        </p>

                        {/* Step Bar */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <div className="flex flex-col cursor-pointer" onClick={() => setStep(1)}>
                                <p className={`font-satoshi text-[14px] font-medium mb-2 ${step === 1 ? "text-[#3145DD]" : "text-transparent"}`}>
                                    {form?.stepLabel || "Store Info"}
                                </p>
                                <div className={`h-[3px] w-full rounded-full transition-colors duration-300 ${step >= 1 ? "bg-[#1A1A1A]" : "bg-[#E0E0E0]"}`}></div>
                            </div>
                            <div className="flex flex-col cursor-pointer" onClick={() => {
                                if (hasStore !== null) {
                                    setStep(2);
                                } else {
                                    setStep1Warning(form?.storeWarning || "Please select whether you own a Shopify website");
                                }
                            }}>
                                <p className={`font-satoshi text-[14px] font-medium mb-2 ${step === 2 ? "text-[#3145DD]" : "text-transparent"}`}>
                                    {form?.step2Label || "Budget range"}
                                </p>
                                <div className={`h-[3px] w-full rounded-full transition-colors duration-300 ${step >= 2 ? "bg-[#1A1A1A]" : "bg-[#E0E0E0]"}`}></div>
                            </div>
                            <div className="flex flex-col cursor-pointer" onClick={() => {
                                if (hasStore === null) {
                                    setStep(1);
                                    setStep1Warning(form?.storeWarning || "Please select whether you own a Shopify website");
                                    return;
                                }
                                handleStep2Continue();
                            }}>
                                <p className={`font-satoshi text-[14px] font-medium mb-2 ${step === 3 ? "text-[#3145DD]" : "text-transparent"}`}>
                                    {form?.step3Label || "Your Estimate"}
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
                                            onClick={() => {
                                                setHasStore(true);
                                                setStep1Warning("");
                                            }}
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
                                            onClick={() => {
                                                setHasStore(false);
                                                setStep1Warning("");
                                            }}
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

                                {step1Warning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12.5px] sm:text-[13px] font-satoshi font-medium mt-3 shadow-2xs"
                                    >
                                        <svg className="w-3.5 h-3.5 text-[#DC2626] shrink-0" viewBox="0 0 16 16" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V5.5A.75.75 0 018 4.75zm0 6.5a.875.875 0 100-1.75.875.875 0 000 1.75z" clipRule="evenodd" />
                                        </svg>
                                        <span>{step1Warning}</span>
                                    </motion.div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleStep1Continue}
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
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="font-nohemi block text-[17px] font-normal text-[#1A1A1A]">
                                            {form?.issuesLabel}
                                        </label>
                                    </div>
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
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="font-nohemi block text-[17px] font-normal text-[#1A1A1A]">
                                            {form?.budgetLabel}
                                        </label>
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {budgetList.map((tier) => {
                                            const isSelected = selectedBudget === tier.value;
                                            return (
                                                <button
                                                    key={tier.id || tier.value}
                                                    type="button"
                                                    onClick={() => handleSelectBudget(tier.value)}
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

                                {step2Warning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12.5px] sm:text-[13px] font-satoshi font-medium mt-3.5 shadow-2xs"
                                    >
                                        <svg className="w-3.5 h-3.5 text-[#DC2626] shrink-0" viewBox="0 0 16 16" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V5.5A.75.75 0 018 4.75zm0 6.5a.875.875 0 100-1.75.875.875 0 000 1.75z" clipRule="evenodd" />
                                        </svg>
                                        <span>{step2Warning}</span>
                                    </motion.div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleStep2Continue}
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
                                    <h3 className="font-nohemi text-[17px] sm:text-[18px] font-normal text-[#1A1A1A]">
                                        {form?.estimateLabel || "Your Estimated Budget"}
                                    </h3>
                                    <p className="font-satoshi text-[13px] sm:text-[13.5px] text-[#6B6B6B] mt-1 mb-4">
                                        {form?.basedOnLabel || "Based on your selections:"}{" "}
                                        {selectedIssues.length > 0 ? (
                                            selectedIssues.map((issue, idx) => (
                                                <span key={idx}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setStep(2)}
                                                        className="font-satoshi text-[#3145DD] underline cursor-pointer hover:opacity-80 font-normal"
                                                    >
                                                        {issue}
                                                    </button>
                                                    {idx < selectedIssues.length - 1 && ", "}
                                                </span>
                                            ))
                                        ) : (
                                            issuesList.slice(0, 2).map((opt, idx) => (
                                                <span key={opt.id || idx}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setStep(2)}
                                                        className="font-satoshi text-[#3145DD] underline cursor-pointer hover:opacity-80 font-normal"
                                                    >
                                                        {opt.label}
                                                    </button>
                                                    {idx < Math.min(issuesList.length, 2) - 1 && ", "}
                                                </span>
                                            ))
                                        )}
                                    </p>

                                    <div className="space-y-3 sm:space-y-3.5 mb-5">
                                        {budgetList.map((tier) => {
                                            const isChosen =
                                                selectedBudget === tier.value ||
                                                selectedBudget === tier.label ||
                                                (!selectedBudget && (tier.value === "balanced" || tier.label === "Balanced"));
                                            return isChosen ? (
                                                <div key={tier.id || tier.value} className="py-1">
                                                    <p className="font-satoshi text-[14.5px] sm:text-[15px] font-medium text-[#3145DD]">
                                                        {tier.label} (Chosen Plan)
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <div className="font-satoshi text-[26px] sm:text-[28px] md:text-[30px] font-medium text-[#3145DD] tracking-tight flex items-center leading-none">
                                                            {formatCurrency(tier.range)}
                                                        </div>
                                                        <span className="inline-flex items-center justify-center shrink-0 -translate-y-[1px] sm:-translate-y-[1.5px]">
                                                            <svg
                                                                className="w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] md:w-[25px] md:h-[25px]"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                aria-label="Chosen Plan"
                                                            >
                                                                <circle cx="12" cy="12" r="10" fill="#B8DFC8" stroke="#168050" strokeWidth="1.8" />
                                                                <path
                                                                    d="M8.2 12.2L10.8 14.8L15.8 9.5"
                                                                    stroke="#168050"
                                                                    strokeWidth="2.2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    key={tier.id || tier.value}
                                                    onClick={() => setSelectedBudget(tier.value)}
                                                    className="text-[#6B6B6B] cursor-pointer hover:text-[#333333] transition-colors py-0.5"
                                                >
                                                    <p className="font-satoshi text-[12px] sm:text-[12.5px] text-[#6B7280] leading-tight">
                                                        {tier.label}
                                                    </p>
                                                    <p className="font-satoshi text-[13.5px] sm:text-[14px] text-[#374151] font-medium mt-0.5 flex items-center">
                                                        {formatCurrency(tier.range)}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                    <div>
                                        <label className="font-nohemi block text-[15px] sm:text-[15.5px] font-normal text-[#1A1A1A] mb-1.5">
                                            {form?.phoneLabel || "Phone Number"}
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => handlePhoneChange(e.target.value)}
                                            placeholder={form?.phonePlaceholder || "Enter Phone Number"}
                                            className={`font-satoshi w-full px-5 py-3 sm:py-3.5 rounded-full border text-[13.5px] sm:text-[14px] text-[#3C3C3C] bg-[#F7F7F9] placeholder-[#8E8E93] transition-all duration-300 ease-out focus:outline-none ${
                                                phoneTouched && (!phone.trim() || phone.trim().replace(/\D/g, "").length < 7)
                                                    ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                                    : "border-[#CAC4D0] focus:border-[#3145DD] focus:ring-1 focus:ring-[#3145DD]"
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="font-nohemi block text-[15px] sm:text-[15.5px] font-normal text-[#1A1A1A] mb-1.5">
                                            {form?.emailLabel || "Email (Optional)"}
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={form?.emailPlaceholder || "Enter Email"}
                                            className="font-satoshi w-full px-5 py-3 sm:py-3.5 rounded-full border border-[#CAC4D0] focus:outline-none focus:border-[#3145DD] focus:ring-1 focus:ring-[#3145DD] text-[13.5px] sm:text-[14px] text-[#3C3C3C] bg-[#F7F7F9] placeholder-[#8E8E93] transition-all duration-300 ease-out"
                                        />
                                    </div>
                                </div>

                                {isSubmitted ? (
                                    <div className="p-4 rounded-xl bg-[#EBF7F2] text-[#1E7448] text-center font-satoshi text-[14px] mt-4 space-y-1">
                                        <p className="font-medium">✓ {form?.resultTitle || "Thank you! We've received your request."}</p>
                                        {form?.resultDescription && (
                                            <p className="text-xs text-[#2A7550]">{form.resultDescription}</p>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        {step3Warning && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12.5px] sm:text-[13px] font-satoshi font-medium mb-3 shadow-2xs"
                                            >
                                                <svg className="w-3.5 h-3.5 text-[#DC2626] shrink-0" viewBox="0 0 16 16" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V5.5A.75.75 0 018 4.75zm0 6.5a.875.875 0 100-1.75.875.875 0 000 1.75z" clipRule="evenodd" />
                                                </svg>
                                                <span>{step3Warning}</span>
                                            </motion.div>
                                        )}

                                        <button
                                            type="button"
                                            data-no-callback="true"
                                            onClick={handleBookCallSubmit}
                                            className="font-satoshi w-full bg-[#3145DD] hover:bg-[#2637b8] text-white font-medium py-3.5 sm:py-4 px-6 rounded-full transition-all duration-300 ease-out flex justify-center items-center gap-2 text-[15.5px] sm:text-[16px] shadow-sm hover:shadow-md cursor-pointer"
                                        >
                                            <span>{form?.bookCallButtonLabel || "Book My Free Call"}</span>
                                            <span className="text-[17px]">→</span>
                                        </button>
                                        <p className="text-center font-satoshi text-[12px] sm:text-[12.5px] text-[#777777] mt-3">
                                            {form?.disclaimer || "We’ll review your store and send insights - no commitments."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CallbackModal
                isOpen={isCallbackOpen}
                onClose={() => setIsCallbackOpen(false)}
            />
        </section>
    );
}