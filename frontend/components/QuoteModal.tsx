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
    const [selectedBudget, setSelectedBudget] = useState<string>("balanced");
    const [otherIssues, setOtherIssues] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Validation & warning states
    const [step1Warning, setStep1Warning] = useState("");
    const [step2Warning, setStep2Warning] = useState("");
    const [step3Warning, setStep3Warning] = useState("");
    const [issuesTouched, setIssuesTouched] = useState(false);
    const [budgetTouched, setBudgetTouched] = useState(false);
    const [phoneTouched, setPhoneTouched] = useState(false);

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

    // Reset step or form state on open if previously completed
    useEffect(() => {
        if (isOpen && isSubmitted) {
            setIsSubmitted(false);
            setStep(1);
        }
    }, [isOpen]);

    const defaultIssues: FormOption[] = [
        { label: "UX issue", sublabel: "Confusing Design", value: "ux_issues" },
        { label: "Conversion Issue", sublabel: "Low sales or drop-offs", value: "conversion_issue" },
        { label: "Outdated Design", sublabel: "Old & Messy Design", value: "outdated_design" },
    ];

    const defaultBudgets: BudgetRange[] = [
        { label: "Essential", sublabel: "Simple Redesign", range: "₹1,00,000 - ₹2,00,000", value: "essential" },
        { label: "Balanced", sublabel: "Modern, improved UX", range: "₹2,00,000 - ₹5,00,000", value: "balanced" },
        { label: "Premium", sublabel: "High-performance Shopify", range: "₹5,00,000 - ₹10,00,000", value: "premium" },
    ];

    const issuesList = form?.issueOptions && form.issueOptions.length > 0 ? form.issueOptions : defaultIssues;
    const budgetList = form?.budgetRanges && form.budgetRanges.length > 0 ? form.budgetRanges : defaultBudgets;

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

    const noOptionLabel = form?.noLabel?.replace("No, But I want", "No, I want") || form?.noLabel || "No, I want to build one";

    // Helper to render currency (specifically Indian Rupee ₹) with clean Inter sans-serif styling
    const formatCurrency = (text?: string) => {
        if (!text) return "";
        const numbers = text.match(/[\d,]+/g);
        if (numbers && numbers.length >= 2) {
            return (
                <span className="inline-flex items-baseline whitespace-nowrap">
                    <span className="inline-flex items-baseline">
                        <span className="font-inter font-normal text-[0.92em] mr-[1.5px] select-none" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>₹</span>
                        <span>{numbers[0]}</span>
                    </span>
                    <span className="mx-1.5 text-current opacity-70 font-normal select-none">–</span>
                    <span className="inline-flex items-baseline">
                        <span className="font-inter font-normal text-[0.92em] mr-[1.5px] select-none" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>₹</span>
                        <span>{numbers[1]}</span>
                    </span>
                </span>
            );
        }
        if (numbers && numbers.length === 1) {
            return (
                <span className="inline-flex items-baseline whitespace-nowrap">
                    <span className="font-inter font-normal text-[0.92em] mr-[1.5px] select-none" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>₹</span>
                    <span>{numbers[0]}</span>
                </span>
            );
        }
        return text;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    ref={modalContainerRef}
                    id="quote-modal"
                    data-modal="quote"
                    onClick={onClose}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-5 md:p-6 bg-black/60 cursor-pointer select-none overflow-y-auto overscroll-contain no-scrollbar"
                >
                    {/* Modal Card - Exact width, height and spacing from reference */}
                    <motion.div
                        ref={modalCardRef}
                        initial={{ opacity: 0, scale: 0.94, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 12 }}
                        transition={{ type: "spring", damping: 26, stiffness: 280, mass: 0.8 }}
                        data-lenis-prevent="true"
                        className={`relative w-full max-w-[570px] sm:max-w-[595px] md:max-w-[610px] max-h-[94vh] sm:max-h-[90vh] ${step === 3
                                ? "min-h-0 sm:min-h-[515px] md:min-h-[535px] pb-4 sm:pb-8 md:pb-9"
                                : "min-h-0 sm:min-h-[535px] md:min-h-[555px] pb-4 sm:pb-8 md:pb-9"
                            } bg-[#F6F6F6] rounded-none pt-4 sm:pt-8 md:pt-9 px-4 sm:px-7 md:px-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] my-auto text-[#111827] z-10 flex flex-col justify-between overflow-y-auto overscroll-contain cursor-default select-text transition-[min-height,padding] duration-200`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close quote modal"
                            className="absolute top-3.5 right-3.5 sm:top-7 sm:right-7 w-7 h-7 flex items-center justify-center text-[#111827] hover:opacity-60 transition-opacity cursor-pointer z-20"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div>
                            {/* Title & Description */}
                            <div className="mb-2 sm:mb-3.5">
                                <h2 className="font-nohemi text-[19px] sm:text-[27px] md:text-[29px] font-normal text-[#111827] leading-[1.15] tracking-tight pr-8">
                                    {step === 1 && (form?.title || "Get an instant quote")}
                                    {step === 2 && (form?.step2Title || "Choose your budget range")}
                                    {step === 3 && (form?.resultTitle || "Your Instant Quote Is Ready!")}
                                </h2>
                                <p className="font-satoshi text-[#374151] text-[10px] sm:text-[11px] md:text-[11.5px] leading-normal mt-0.5 font-normal">
                                    {step === 1 && (form?.description || "Book a free consultation with us. We'll discuss materials, your vision, and provide an estimate.")}
                                    {step === 2 && (form?.step2Description || "Select what’s not working and your preferred budget.")}
                                    {step === 3 && (form?.resultDescription || "Based on your inputs, here’s your estimated range")}
                                </p>
                            </div>

                            {/* Progress Header */}
                            <div className="mb-3.5 sm:mb-7 select-none">
                                <div className="flex items-center justify-between mb-1.5 sm:mb-3">
                                    <span className="font-satoshi text-[13.5px] sm:text-[16px] md:text-[16.5px] font-medium text-[#3145DD] pl-1">
                                        {step === 1 && (form?.stepLabel || "Store Info")}
                                        {step === 2 && (form?.step2Label || "Budget range")}
                                        {step === 3 && (form?.step3Label || "Your Estimate")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div
                                        onClick={() => setStep(1)}
                                        className={`h-[2px] flex-1 transition-colors duration-300 cursor-pointer ${step >= 1 ? "bg-[#18181B]" : "bg-[#D8D8DC]"
                                            }`}
                                    />
                                    <div
                                        onClick={() => {
                                            if (hasStore !== null) {
                                                setStep(2);
                                            } else {
                                                setStep1Warning(form?.storeWarning || "Please select whether you own a Shopify website");
                                            }
                                        }}
                                        className={`h-[2px] flex-1 transition-colors duration-300 cursor-pointer ${step >= 2 ? "bg-[#18181B]" : "bg-[#D8D8DC]"
                                            }`}
                                    />
                                    <div
                                        onClick={() => {
                                            if (hasStore === null) {
                                                setStep(1);
                                                setStep1Warning(form?.storeWarning || "Please select whether you own a Shopify website");
                                                return;
                                            }
                                            handleStep2Continue();
                                        }}
                                        className={`h-[2px] flex-1 transition-colors duration-300 cursor-pointer ${step >= 3 ? "bg-[#18181B]" : "bg-[#D8D8DC]"
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* STEP 1 */}
                        {step === 1 && (
                            <div className="flex flex-col flex-1 justify-between">
                                <div className="space-y-3 sm:space-y-5">
                                    {/* Question 1 */}
                                    <div>
                                        <label className="font-nohemi block text-[13.5px] sm:text-[17px] font-normal text-[#111827] mb-1 sm:mb-1.5">
                                            {form?.shopifyQuestion || "Do you own a Shopify website ?"}
                                        </label>
                                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-6">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setHasStore(true);
                                                    setStep1Warning("");
                                                }}
                                                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#C5C5CA] text-[13px] sm:text-[14.5px] font-nohemi font-normal transition-all duration-200 cursor-pointer bg-[#F7F7F7] text-[#111827] hover:border-[#9CA3AF] ${hasStore === true ? "shadow-xs" : "hover:bg-[#EFEFEF]"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full border-[1.25px] flex items-center justify-center transition-colors shrink-0 ${hasStore === true ? "border-[#18181B]" : "border-[#18181B]"
                                                        }`}
                                                >
                                                    {hasStore === true && (
                                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#18181B]" />
                                                    )}
                                                </span>
                                                <span className="font-nohemi font-normal text-[#111827]">{form?.yesLabel || "Yes, I do"}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setHasStore(false);
                                                    setStep1Warning("");
                                                }}
                                                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#C5C5CA] text-[13px] sm:text-[14.5px] font-nohemi font-normal transition-all duration-200 cursor-pointer bg-[#F7F7F7] text-[#111827] hover:border-[#9CA3AF] ${hasStore === false ? "shadow-xs" : "hover:bg-[#EFEFEF]"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full border-[1.25px] flex items-center justify-center transition-colors shrink-0 ${hasStore === false ? "border-[#18181B]" : "border-[#18181B]"
                                                        }`}
                                                >
                                                    {hasStore === false && (
                                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#18181B]" />
                                                    )}
                                                </span>
                                                <span className="font-nohemi font-normal text-[#111827]">{noOptionLabel}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Question 2 */}
                                    <div className="pt-0.5 mb-1 sm:mb-3">
                                        <label className="font-nohemi block text-[13.5px] sm:text-[17px] font-normal text-[#111827] mb-1 sm:mb-2.5">
                                            {form?.shopifyLinkLabel || "Add your Shopify link (optional)"}
                                        </label>
                                        <input
                                            type="text"
                                            value={storeUrl}
                                            onChange={(e) => setStoreUrl(e.target.value)}
                                            placeholder={
                                                form?.shopifyLinkPlaceholder ||
                                                "We’ll personalize your quote based on your current setup."
                                            }
                                            className="font-satoshi w-full px-3.5 sm:px-5 py-2 sm:py-3 rounded-full border border-[#C5C5CA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[12px] sm:text-[13.5px] text-[#18181B] bg-[#F7F7F7] placeholder-[#4B5563] transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {step1Warning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[11.5px] sm:text-[13px] font-satoshi font-medium mt-2 sm:mt-3.5 shadow-2xs"
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
                                    className="font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-2.5 sm:py-3 px-5 sm:px-6 rounded-full transition-all duration-200 flex justify-center items-center gap-2 mt-3 sm:mt-auto mb-1 sm:mb-4 md:mb-5 text-[14px] sm:text-[15.5px] cursor-pointer shadow-md active:scale-[0.99]"
                                >
                                    <span>{form?.continueLabel || "Continue"}</span>
                                    <span className="text-[16px] sm:text-[17px]">→</span>
                                </button>
                            </div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <div className="flex flex-col flex-1 justify-between">
                                <div className="space-y-2.5 sm:space-y-4">
                                    {/* Question 1: What needs improvement ? (3 columns) */}
                                    <div>
                                        <label className="font-nohemi block text-[13.5px] sm:text-[18px] font-normal text-[#111827] mb-1 sm:mb-1.5">
                                            {form?.issuesLabel || "What needs improvement ?"}
                                        </label>
                                        <div className="grid grid-cols-1 min-[460px]:grid-cols-3 gap-1.5 sm:gap-1.5">
                                            {issuesList.map((item) => {
                                                const isSelected = selectedIssues.includes(item.label) || selectedIssues.includes(item.value);
                                                return (
                                                    <button
                                                        key={item.id || item.value}
                                                        type="button"
                                                        onClick={() => toggleIssue(item.label)}
                                                        className={`flex items-center justify-between min-[460px]:justify-start gap-2.5 px-3.5 min-[460px]:px-2 md:px-2.5 py-2 min-[460px]:py-1.5 rounded-full border text-left transition-all duration-150 cursor-pointer min-h-[36px] sm:min-h-[40px] w-full ${isSelected
                                                                ? "border-[#18181B] bg-[#F2F2F5] shadow-xs"
                                                                : "border-[#D1D1D6] bg-[#F7F7F7] hover:border-[#9CA3AF] hover:bg-[#EFEFEF]"
                                                            }`}
                                                    >
                                                        <div className="flex flex-col min-w-0 flex-1 justify-center order-1 min-[460px]:order-2">
                                                            <span className="font-nohemi text-[12.5px] min-[460px]:text-[13px] sm:text-[13.5px] md:text-[14px] font-normal text-[#111827] leading-tight">
                                                                {item.label}
                                                            </span>
                                                            {item.sublabel && (
                                                                <span className="font-satoshi text-[10px] min-[460px]:text-[10.5px] sm:text-[11px] text-[#4B5563] leading-tight mt-0.5">
                                                                    {item.sublabel}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span
                                                            className={`w-[16px] h-[16px] sm:w-[17px] sm:h-[17px] rounded-[3px] flex items-center justify-center shrink-0 transition-all duration-150 order-2 min-[460px]:order-1 ${isSelected
                                                                    ? "bg-[#18181B] shadow-[0_0_0_1px_#ffffff,0_0_0_2px_#18181B]"
                                                                    : "border border-[#18181B] bg-transparent"
                                                                }`}
                                                        >
                                                            {isSelected && (
                                                                <svg
                                                                    className="w-[9px] h-[9px] sm:w-[9.5px] sm:h-[9.5px] text-white"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={3.5}
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                            )}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Question 2: Select your budget range (3 columns) */}
                                    <div>
                                        <label className="font-nohemi block text-[13.5px] sm:text-[18px] font-normal text-[#111827] mb-1 sm:mb-1.5">
                                            {form?.budgetLabel || "Select your budget range"}
                                        </label>
                                        <div className="grid grid-cols-1 min-[460px]:grid-cols-3 gap-1.5 sm:gap-1.5">
                                            {budgetList.map((tier) => {
                                                const isSelected = selectedBudget === tier.value || selectedBudget === tier.label;
                                                return (
                                                    <button
                                                        key={tier.id || tier.value}
                                                        type="button"
                                                        onClick={() => handleSelectBudget(tier.value)}
                                                        className={`flex items-center justify-between min-[460px]:justify-start gap-2.5 px-3.5 min-[460px]:px-2 md:px-2.5 py-2 min-[460px]:py-1.5 rounded-full border text-left transition-all duration-150 cursor-pointer min-h-[36px] sm:min-h-[40px] w-full ${isSelected
                                                                ? "border-[#18181B] bg-[#F2F2F5] shadow-xs"
                                                                : "border-[#D1D1D6] bg-[#F7F7F7] hover:border-[#9CA3AF] hover:bg-[#EFEFEF]"
                                                            }`}
                                                    >
                                                        <div className="flex flex-col min-w-0 flex-1 justify-center order-1 min-[460px]:order-2">
                                                            <span className="font-nohemi text-[12.5px] min-[460px]:text-[13px] sm:text-[13.5px] md:text-[14px] font-normal text-[#111827] leading-tight">
                                                                {tier.label}
                                                            </span>
                                                            {tier.sublabel && (
                                                                <span className="font-satoshi text-[10px] min-[460px]:text-[10.5px] sm:text-[11px] text-[#4B5563] leading-tight mt-0.5">
                                                                    {tier.sublabel}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span
                                                            className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full border-[1.25px] border-[#18181B] flex items-center justify-center shrink-0 transition-colors order-2 min-[460px]:order-1"
                                                        >
                                                            {isSelected && (
                                                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#18181B]" />
                                                            )}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Question 3: Other issues (optional) */}
                                    <div>
                                        <label className="font-nohemi block text-[13px] sm:text-[16.5px] font-normal text-[#111827] mb-1 sm:mb-1.5">
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
                                            className="font-satoshi w-full px-3.5 sm:px-5 py-2 sm:py-3 rounded-full border border-[#C5C5CA] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[12px] sm:text-[13.5px] text-[#18181B] bg-[#F7F7F7] placeholder-[#4B5563] transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {step2Warning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[11.5px] sm:text-[13px] font-satoshi font-medium mt-2 sm:mt-3 shadow-2xs"
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
                                    className="font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-2.5 sm:py-3 px-5 sm:px-6 rounded-full transition-all duration-200 flex justify-center items-center gap-2 mt-3 sm:mt-auto mb-1 sm:mb-4 md:mb-5 text-[14px] sm:text-[15.5px] cursor-pointer shadow-md active:scale-[0.99]"
                                >
                                    <span>{form?.estimateButtonLabel || "Get My Estimate"}</span>
                                    <span className="text-[16px] sm:text-[17px]">→</span>
                                </button>
                            </div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <div className="flex flex-col justify-between flex-1">
                                <div>
                                    <h3 className="font-nohemi text-[15px] sm:text-[18px] font-normal text-[#111827]">
                                        {form?.estimateLabel || "Your Estimated Budget"}
                                    </h3>
                                    <p className="font-satoshi text-[11px] sm:text-[12.5px] text-[#6B7280] mt-0.5 mb-2">
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
                                            issuesList.slice(0, 2).map((opt, idx) => (
                                                <span key={opt.id || idx}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setStep(2)}
                                                        className="text-[#3145DD] underline cursor-pointer hover:opacity-80 font-normal"
                                                    >
                                                        {opt.label}
                                                    </button>
                                                    {idx < Math.min(issuesList.length, 2) - 1 && ", "}
                                                </span>
                                            ))
                                        )}
                                    </p>

                                    {/* 3 Budget Tiers */}
                                    <div className="space-y-1 sm:space-y-2 mb-2">
                                        {budgetList.map((tier) => {
                                            const isChosen =
                                                selectedBudget === tier.value ||
                                                selectedBudget === tier.label ||
                                                (!selectedBudget && (tier.value === "balanced" || tier.label === "Balanced"));
                                            return isChosen ? (
                                                <div key={tier.id || tier.value} className="py-0.5">
                                                    <p className="font-satoshi text-[13px] sm:text-[14.5px] md:text-[15px] font-medium text-[#3145DD]">
                                                        {tier.label} (Chosen Plan)
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <div className="font-satoshi text-[21px] min-[360px]:text-[23px] min-[420px]:text-[26px] sm:text-[28px] md:text-[29px] font-medium text-[#3145DD] tracking-tight flex items-center leading-none whitespace-nowrap">
                                                            {formatCurrency(tier.range)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    key={tier.id || tier.value}
                                                    onClick={() => setSelectedBudget(tier.value)}
                                                    className="cursor-pointer hover:opacity-80 transition-opacity py-0.5"
                                                >
                                                    <p className="font-satoshi text-[11px] sm:text-[12px] text-[#6B7280]">
                                                        {tier.label}
                                                    </p>
                                                    <p className="font-satoshi text-[12px] sm:text-[13px] text-[#374151] font-medium mt-0.5 flex items-center">
                                                        {formatCurrency(tier.range)}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Lead Capture Inputs */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 mb-2">
                                        <div>
                                            <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                                                <label className="font-nohemi block text-[12.5px] sm:text-[13.5px] font-normal text-[#111827]">
                                                    {form?.phoneLabel || "Phone Number"}
                                                </label>
                                            </div>
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => handlePhoneChange(e.target.value)}
                                                placeholder={form?.phonePlaceholder || "Enter Phone Number"}
                                                className={`font-satoshi w-full px-3 sm:px-3.5 py-1.5 sm:py-2.5 rounded-full border text-[12px] sm:text-[13px] text-[#111827] bg-[#F7F7F9] placeholder-[#8E8E93] transition-all duration-200 focus:outline-none ${phoneTouched && (!phone.trim() || phone.trim().replace(/\D/g, "").length < 7)
                                                        ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                                        : "border-[#D1D5DB] focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B]"
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <label className="font-nohemi block text-[12.5px] sm:text-[13.5px] font-normal text-[#111827] mb-0.5 sm:mb-1">
                                                {form?.emailLabel || "Email (Optional)"}
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={form?.emailPlaceholder || "Enter Email"}
                                                className="font-satoshi w-full px-3 sm:px-3.5 py-1.5 sm:py-2.5 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[12px] sm:text-[13px] text-[#111827] bg-[#F7F7F9] placeholder-[#8E8E93] transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isSubmitted ? (
                                    <div className="p-3.5 sm:p-4 rounded-none bg-[#EBF7F2] text-[#1E7448] text-center font-satoshi text-[13px] sm:text-[14px] mt-1.5 sm:mt-2 space-y-1 sm:space-y-1.5">
                                        <p className="font-medium text-[14px] sm:text-[15px]">✓ {form?.successTitle || "Thank you! We've received your request."}</p>
                                        <p className="text-[11px] sm:text-xs text-[#2A7550]">{form?.successDescription || "We will review your store setup and call you with your quote."}</p>
                                        {(form?.closeButtonLabel || (form as any)?.closeLabel) && (
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="text-xs font-semibold underline text-[#1E7448] hover:text-[#145232] cursor-pointer pt-0.5"
                                            >
                                                {form?.closeButtonLabel || (form as any)?.closeLabel}
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        {step3Warning && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[11.5px] sm:text-[12.5px] font-satoshi font-medium mb-1.5 shadow-2xs"
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
                                            className="font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-2.5 sm:py-3.5 px-5 sm:px-6 rounded-full transition-all duration-200 flex justify-center items-center gap-2 text-[14px] sm:text-[15px] cursor-pointer shadow-md active:scale-[0.99] mt-2 sm:mt-2"
                                        >
                                            <span>{form?.bookCallButtonLabel || "Book My Free Call"}</span>
                                            <span className="text-[16px] sm:text-[17px]">→</span>
                                        </button>
                                        <p className="text-center font-satoshi text-[10.5px] sm:text-[11.5px] text-[#111827] mt-1 sm:mt-1.5">
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
