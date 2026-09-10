"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BudgetRange = {
    id?: number;
    label: string;
    sublabel?: string;
    range?: string;
    value: string;
};

type FormOption = {
    id?: number;
    label: string;
    sublabel?: string;
    value: string;
};

export type QuoteFormData = {
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

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    form?: QuoteFormData | QuoteFormData[] | null;
}

export default function QuoteModal({ isOpen, onClose, form: rawForm }: QuoteModalProps) {
    const form = Array.isArray(rawForm) ? rawForm[0] : rawForm;

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [hasStore, setHasStore] = useState<boolean | null>(null);
    const [storeUrl, setStoreUrl] = useState("");
    const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
    const [selectedBudget, setSelectedBudget] = useState<string>("");
    const [otherIssues, setOtherIssues] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Container ref for modal
    const modalContainerRef = useRef<HTMLDivElement>(null);
    const modalCardRef = useRef<HTMLDivElement>(null);

    // Lock body & document scroll, pause Lenis, and handle ESC key
    useEffect(() => {
        if (!isOpen) return;

        const origBodyOverflow = document.body.style.overflow;
        const origDocOverflow = document.documentElement.style.overflow;
        const origBodyOverscroll = document.body.style.overscrollBehavior;
        const origDocOverscroll = document.documentElement.style.overscrollBehavior;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.body.style.overscrollBehavior = "none";
        document.documentElement.style.overscrollBehavior = "none";

        if (typeof window !== "undefined") {
            (window as any).__lenis?.stop();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = origBodyOverflow;
            document.documentElement.style.overflow = origDocOverflow;
            document.body.style.overscrollBehavior = origBodyOverscroll;
            document.documentElement.style.overscrollBehavior = origDocOverscroll;
            if (typeof window !== "undefined") {
                (window as any).__lenis?.start();
            }
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // On desktop, Lenis may still consume wheel events even when stopped.
    // Manually forward wheel events to the modal card so it can scroll.
    useEffect(() => {
        if (!isOpen) return;
        const container = modalContainerRef.current;
        const card = modalCardRef.current;
        if (!container || !card) return;

        const handleWheel = (e: WheelEvent) => {
            // If the card itself can scroll, let it handle the wheel event
            const canScroll =
                card.scrollHeight > card.clientHeight;
            if (canScroll) {
                card.scrollTop += e.deltaY;
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        };

        container.addEventListener("wheel", handleWheel, { passive: false, capture: true });
        return () => container.removeEventListener("wheel", handleWheel, { capture: true });
    }, [isOpen]);

    // Reset step or form state on open if previously completed
    useEffect(() => {
        if (isOpen && isSubmitted) {
            setIsSubmitted(false);
            setStep(1);
        }
    }, [isOpen]);

    const defaultIssues: FormOption[] = [
        { label: "UX issue", sublabel: "Confusing Design", value: "ux_issue" },
        { label: "Conversion issues", sublabel: "Low sales or drop-offs.", value: "conversion_issues" },
        { label: "Outdated Design", sublabel: "Old & Messy Design", value: "outdated_design" },
    ];

    const defaultBudgets: BudgetRange[] = [
        { label: "Essential", sublabel: "Simple Redesign", range: "₹1,00,000 -₹2,00,000", value: "essential" },
        { label: "Balanced", sublabel: "Modern, improved UX", range: "₹2,00,000 -₹5,00,000", value: "balanced" },
        { label: "Premium", sublabel: "Full Custom Scale", range: "₹5,00,000 -₹10,00,000", value: "premium" },
    ];

    const issuesList = form?.issueOptions && form.issueOptions.length > 0 ? form.issueOptions : defaultIssues;
    const budgetList = form?.budgetRanges && form.budgetRanges.length > 0 ? form.budgetRanges : defaultBudgets;

    const currentTier = budgetList.find((b) => b.value === selectedBudget) || budgetList[1] || budgetList[0];

    const toggleIssue = (label: string) => {
        setSelectedIssues((prev) =>
            prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
        );
    };

    const noOptionLabel = form?.noLabel?.replace("No, But I want", "No, I want") || form?.noLabel || "No, I want to build one";

    // Helper to render currency (specifically Indian Rupee ₹) with Satoshi font
    const formatCurrency = (text?: string) => {
        if (!text) return "";
        const cleanText = text.replace(/\s*-\s*₹?/g, "\u00A0-\u00A0₹").replace(/^₹?\s*/, "₹");
        const parts = cleanText.split(/(₹)/g);
        if (parts.length === 1) return text;
        return (
            <span className="inline-flex items-center self-center whitespace-nowrap">
                {parts.map((part, idx) => {
                    if (!part) return null;
                    if (part === "₹") {
                        return (
                            <span
                                key={idx}
                                className="font-satoshi font-normal text-[1.08em] inline-block select-none leading-none shrink-0"
                                style={{
                                    verticalAlign: "-0.02em",
                                }}
                            >
                                ₹
                            </span>
                        );
                    }
                    return <span key={idx} className="self-center whitespace-nowrap">{part}</span>;
                })}
            </span>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    ref={modalContainerRef}
                    id="quote-modal"
                    data-modal="quote"
                    data-lenis-prevent="true"
                    data-lenis-prevent-wheel="true"
                    data-lenis-prevent-touch="true"
                    className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto overscroll-contain no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {/* Semi-transparent Backdrop (no blur, dark overlay showing background) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 cursor-pointer"
                        aria-hidden="true"
                    />

                    {/* Modal Card - Scrollable on small screens, Sharp Corners */}
                    <motion.div
                        ref={modalCardRef}
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 12 }}
                        transition={{ type: "spring", damping: 26, stiffness: 280, mass: 0.8 }}
                        data-lenis-prevent="true"
                        data-lenis-prevent-wheel="true"
                        data-lenis-prevent-touch="true"
                        className="relative w-full max-w-[550px] sm:max-w-[570px] max-h-[92vh] sm:max-h-[88vh] bg-[#FAFAFC] rounded-none p-5 sm:p-7 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] my-auto text-[#111827] z-10 flex flex-col justify-between overflow-y-auto overscroll-contain"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close quote modal"
                            className="absolute top-5 right-5 sm:top-6 sm:right-6 w-7 h-7 flex items-center justify-center text-[#111827] hover:opacity-60 transition-opacity cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div>
                            {/* Title & Description */}
                            <div className="mb-3.5 sm:mb-4">
                                <h2 className="font-nohemi text-[26px] sm:text-[28px] md:text-[30px] font-normal text-[#111827] leading-[1.15] tracking-tight pr-8">
                                    {step === 1 && (form?.title || "Get an instant quote")}
                                    {step === 2 && (form?.step2Title || "Choose your budget range")}
                                    {step === 3 && (form?.resultTitle || "Your Instant Quote Is Ready!")}
                                </h2>
                                <p className="font-satoshi text-[#555555] text-[12px] sm:text-[12.5px] md:text-[13px] leading-relaxed mt-1 sm:mt-1">
                                    {step === 1 && (form?.description || "Book a free consultation with us. We'll discuss materials, your vision, and provide an estimate.")}
                                    {step === 2 && (form?.step2Description || "Select what’s not working and your preferred budget.")}
                                    {step === 3 && (form?.resultDescription || "Based on your inputs, here’s your estimated range")}
                                </p>
                            </div>

                            {/* Progress Header */}
                            <div className="mb-5 sm:mb-6 select-none">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-satoshi text-[14.5px] sm:text-[15.5px] font-medium text-[#3145DD]">
                                        {step === 1 && (form?.stepLabel || "Store Info")}
                                        {step === 2 && (form?.step2Label || "Budget range")}
                                        {step === 3 && (form?.step3Label || "Your Estimate")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div
                                        onClick={() => setStep(1)}
                                        className={`h-[2px] flex-1 transition-colors duration-300 cursor-pointer ${
                                            step >= 1 ? "bg-[#18181B]" : "bg-[#D8D8DC]"
                                        }`}
                                    />
                                    <div
                                        onClick={() => setStep(2)}
                                        className={`h-[2px] flex-1 transition-colors duration-300 cursor-pointer ${
                                            step >= 2 ? "bg-[#18181B]" : "bg-[#D8D8DC]"
                                        }`}
                                    />
                                    <div
                                        onClick={() => setStep(3)}
                                        className={`h-[2px] flex-1 transition-colors duration-300 cursor-pointer ${
                                            step >= 3 ? "bg-[#18181B]" : "bg-[#D8D8DC]"
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* STEP 1 */}
                        {step === 1 && (
                            <div className="flex flex-col justify-between">
                                <div className="space-y-6">
                                    {/* Question 1 */}
                                    <div>
                                        <label className="font-nohemi block text-[16px] sm:text-[17px] font-normal text-[#111827] mb-2.5 sm:mb-3">
                                            {form?.shopifyQuestion || "Do you own a Shopify website ?"}
                                        </label>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setHasStore(true)}
                                                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-[13.5px] sm:text-[14px] font-satoshi transition-all duration-200 cursor-pointer ${
                                                    hasStore === true
                                                        ? "border-[#18181B] bg-white text-[#111827] font-medium"
                                                        : "border-[#D1D5DB] text-[#111827] bg-transparent hover:border-[#9CA3AF]"
                                                }`}
                                            >
                                                <span
                                                    className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
                                                        hasStore === true ? "border-[#18181B]" : "border-[#4B5563]"
                                                    }`}
                                                >
                                                    {hasStore === true && (
                                                        <span className="w-2 h-2 rounded-full bg-[#18181B]" />
                                                    )}
                                                </span>
                                                <span>{form?.yesLabel || "Yes, I do"}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setHasStore(false)}
                                                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-[13.5px] sm:text-[14px] font-satoshi transition-all duration-200 cursor-pointer ${
                                                    hasStore === false
                                                        ? "border-[#18181B] bg-white text-[#111827] font-medium"
                                                        : "border-[#D1D5DB] text-[#111827] bg-transparent hover:border-[#9CA3AF]"
                                                }`}
                                            >
                                                <span
                                                    className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
                                                        hasStore === false ? "border-[#18181B]" : "border-[#4B5563]"
                                                    }`}
                                                >
                                                    {hasStore === false && (
                                                        <span className="w-2 h-2 rounded-full bg-[#18181B]" />
                                                    )}
                                                </span>
                                                <span>{noOptionLabel}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Question 2 */}
                                    <div>
                                        <label className="font-nohemi block text-[16px] sm:text-[17px] font-normal text-[#111827] mb-2.5">
                                            {form?.shopifyLinkLabel || "Add your Shopify link (optional)"}
                                        </label>
                                        <input
                                            type="text"
                                            value={storeUrl}
                                            onChange={(e) => setStoreUrl(e.target.value)}
                                            placeholder={
                                                form?.shopifyLinkPlaceholder ||
                                                "We'll personalize your quote based on your current setup."
                                            }
                                            className="font-satoshi w-full px-5 py-3 sm:py-3.5 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[13.5px] sm:text-[14px] text-[#111827] bg-[#F1F1F3] placeholder-[#8E8E93] transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {/* Gap below Shopify input before Continue button */}
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-3.5 sm:py-4 px-6 rounded-full transition-all duration-200 flex justify-center items-center gap-2 mt-8 sm:mt-14 md:mt-20 text-[15px] sm:text-[15.5px] cursor-pointer shadow-md active:scale-[0.99]"
                                >
                                    <span>{form?.continueLabel || "Continue"}</span>
                                    <span className="text-[17px]">→</span>
                                </button>
                            </div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <div className="flex flex-col justify-between">
                                <div className="space-y-4 sm:space-y-4.5">
                                    {/* Question 1: What needs Improvement ? (Checkboxes) */}
                                    <div>
                                        <label className="font-nohemi block text-[15.5px] sm:text-[16.5px] font-normal text-[#111827] mb-2">
                                            {form?.issuesLabel || "What needs Improvement ?"}
                                        </label>
                                        <div className="grid grid-cols-1 min-[460px]:grid-cols-3 gap-2 sm:gap-1.5">
                                            {issuesList.map((item) => {
                                                const isSelected = selectedIssues.includes(item.label) || selectedIssues.includes(item.value);
                                                return (
                                                    <button
                                                        key={item.id || item.value}
                                                        type="button"
                                                        onClick={() => toggleIssue(item.label)}
                                                        className={`flex items-center gap-2.5 px-3.5 min-[460px]:px-2.5 md:px-3 py-2 min-[460px]:py-1.5 md:py-2 rounded-full border text-left transition-all duration-150 cursor-pointer min-h-[44px] sm:min-h-[46px] w-full ${
                                                            isSelected
                                                                ? "border-[#18181B] bg-white shadow-xs"
                                                                : "border-[#D1D5DB] bg-white hover:border-[#9CA3AF]"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-[4px] border-[1.5px] flex items-center justify-center shrink-0 transition-colors duration-150 ${
                                                                isSelected
                                                                    ? "border-[#18181B] bg-[#18181B] text-white"
                                                                    : "border-[#4B5563] bg-white"
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <svg
                                                                    className="w-3 h-3 stroke-white"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={3}
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </span>
                                                        <div className="flex flex-col min-w-0 flex-1">
                                                            <span className="font-nohemi text-[12.5px] min-[460px]:text-[11.5px] sm:text-[12.5px] font-normal text-[#111827] leading-snug">
                                                                {item.label}
                                                            </span>
                                                            {item.sublabel && (
                                                                <span className="font-satoshi text-[10.5px] min-[460px]:text-[9.5px] sm:text-[10px] text-[#6B7280] leading-tight mt-0.5">
                                                                    {item.sublabel}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Question 2: Select your budget range (Radio buttons) */}
                                    <div>
                                        <label className="font-nohemi block text-[15.5px] sm:text-[16.5px] font-normal text-[#111827] mb-2">
                                            {form?.budgetLabel || "Select your budget range"}
                                        </label>
                                        <div className="grid grid-cols-1 min-[460px]:grid-cols-3 gap-2 sm:gap-1.5">
                                            {budgetList.map((tier) => {
                                                const isSelected = selectedBudget === tier.value || selectedBudget === tier.label;
                                                return (
                                                    <button
                                                        key={tier.id || tier.value}
                                                        type="button"
                                                        onClick={() => setSelectedBudget(tier.value)}
                                                        className={`flex items-center gap-2.5 px-3.5 min-[460px]:px-2.5 md:px-3 py-2 min-[460px]:py-1.5 md:py-2 rounded-full border text-left transition-all duration-150 cursor-pointer min-h-[44px] sm:min-h-[46px] w-full ${
                                                            isSelected
                                                                ? "border-[#18181B] bg-white shadow-xs"
                                                                : "border-[#D1D5DB] bg-white hover:border-[#9CA3AF]"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-colors duration-150 ${
                                                                isSelected ? "border-[#18181B] bg-white" : "border-[#4B5563] bg-white"
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <span className="w-2 h-2 rounded-full bg-[#18181B]" />
                                                            )}
                                                        </span>
                                                        <div className="flex flex-col min-w-0 flex-1">
                                                            <span className="font-nohemi text-[12.5px] min-[460px]:text-[11.5px] sm:text-[12.5px] font-normal text-[#111827] leading-snug">
                                                                {tier.label}
                                                            </span>
                                                            {tier.sublabel && (
                                                                <span className="font-satoshi text-[10.5px] min-[460px]:text-[9.5px] sm:text-[10px] text-[#6B7280] leading-tight mt-0.5">
                                                                    {tier.sublabel}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Question 3: Other issues (optional) */}
                                    <div>
                                        <label className="font-nohemi block text-[15.5px] sm:text-[16.5px] font-normal text-[#111827] mb-2">
                                            {form?.otherIssuesLabel || "Other issues (optional)"}
                                        </label>
                                        <input
                                            type="text"
                                            value={otherIssues}
                                            onChange={(e) => setOtherIssues(e.target.value)}
                                            placeholder={
                                                form?.otherIssuesPlaceholder ||
                                                "Any other issues your shopify store is facing"
                                            }
                                            className="font-satoshi w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[13px] sm:text-[13.5px] text-[#111827] bg-[#F1F1F3] placeholder-[#8E8E93] transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-3.5 sm:py-4 px-6 rounded-full transition-all duration-200 flex justify-center items-center gap-2 mt-5 sm:mt-6 text-[15px] sm:text-[15.5px] cursor-pointer shadow-md active:scale-[0.99]"
                                >
                                    <span>{form?.estimateButtonLabel || "Get My Estimate"}</span>
                                    <span className="text-[17px]">→</span>
                                </button>
                            </div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <div className="flex flex-col justify-between">
                                <div>
                                    <h3 className="font-nohemi text-[17px] sm:text-[18px] font-normal text-[#111827]">
                                        {form?.estimateLabel || "Your Estimated Budget"}
                                    </h3>
                                    <p className="font-satoshi text-[13px] sm:text-[13.5px] text-[#6B7280] mt-1 mb-4">
                                        {form?.basedOnLabel || "Based on your selections:"}{" "}
                                        {selectedIssues.length > 0 ? (
                                            selectedIssues.map((issue, idx) => (
                                                <span key={idx}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setStep(2)}
                                                        className="text-[#3145DD] underline cursor-pointer hover:opacity-80 font-normal"
                                                    >
                                                        {issue}
                                                    </button>
                                                    {idx < selectedIssues.length - 1 && ", "}
                                                </span>
                                            ))
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(2)}
                                                    className="text-[#3145DD] underline cursor-pointer hover:opacity-80 font-normal"
                                                >
                                                    UX issues
                                                </button>
                                                {", "}
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(2)}
                                                    className="text-[#3145DD] underline cursor-pointer hover:opacity-80 font-normal"
                                                >
                                                    Outdated Design
                                                </button>
                                            </>
                                        )}
                                    </p>

                                    {/* 3 Budget Tiers */}
                                    <div className="space-y-3 sm:space-y-3.5 mb-5">
                                        {budgetList.map((tier) => {
                                            const isChosen =
                                                selectedBudget === tier.value ||
                                                selectedBudget === tier.label ||
                                                (!selectedBudget && (tier.value === "balanced" || tier.label === "Balanced"));
                                            return isChosen ? (
                                                <div key={tier.id || tier.value} className="py-0.5">
                                                    <p className="font-satoshi text-[14.5px] sm:text-[15px] font-medium text-[#3145DD]">
                                                        {tier.label} (Chosen Plan)
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <div className="font-satoshi text-[19px] min-[360px]:text-[21px] min-[420px]:text-[24px] sm:text-[27px] md:text-[30px] font-medium text-[#3145DD] tracking-tight flex items-center leading-none whitespace-nowrap">
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
                                                    className="cursor-pointer hover:opacity-80 transition-opacity py-0.5"
                                                >
                                                    <p className="font-satoshi text-[12.5px] sm:text-[13px] text-[#6B7280]">
                                                        {tier.label}
                                                    </p>
                                                    <p className="font-satoshi text-[14px] sm:text-[14.5px] text-[#374151] font-medium mt-0.5 flex items-center">
                                                        {formatCurrency(tier.range)}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Lead Capture Inputs */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                        <div>
                                            <label className="font-nohemi block text-[15px] sm:text-[15.5px] font-normal text-[#111827] mb-1.5">
                                                {form?.phoneLabel || "Phone Number"}
                                            </label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder={form?.phonePlaceholder || "Enter Phone Number"}
                                                className="font-satoshi w-full px-5 py-3 sm:py-3.5 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[13.5px] sm:text-[14px] text-[#111827] bg-[#F7F7F9] placeholder-[#8E8E93] transition-all duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="font-nohemi block text-[15px] sm:text-[15.5px] font-normal text-[#111827] mb-1.5">
                                                {form?.emailLabel || "Email (Optional)"}
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={form?.emailPlaceholder || "Enter Email"}
                                                className="font-satoshi w-full px-5 py-3 sm:py-3.5 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[13.5px] sm:text-[14px] text-[#111827] bg-[#F7F7F9] placeholder-[#8E8E93] transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isSubmitted ? (
                                    <div className="p-4 rounded-xl bg-[#EBF7F2] text-[#1E7448] text-center font-satoshi text-[14px] mt-2 space-y-1.5">
                                        <p className="font-medium">✓ Thank you! We&apos;ve received your request.</p>
                                        <p className="text-xs text-[#2A7550]">We will review your store setup and get back to you shortly.</p>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="text-xs font-semibold underline text-[#1E7448] hover:text-[#145232] cursor-pointer pt-0.5"
                                        >
                                            Close Window
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            type="button"
                                            data-no-callback="true"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsSubmitted(true);
                                            }}
                                            className="font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-3.5 sm:py-4 px-6 rounded-full transition-all duration-200 flex justify-center items-center gap-2 text-[15.5px] sm:text-[16px] cursor-pointer shadow-md active:scale-[0.99]"
                                        >
                                            <span>{form?.bookCallButtonLabel || "Book My Free Call"}</span>
                                            <span className="text-[17px]">→</span>
                                        </button>
                                        <p className="text-center font-satoshi text-[12px] sm:text-[12.5px] text-[#6B7280] mt-2.5">
                                            {form?.disclaimer || "We’ll review your store and send insights - no commitments."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
