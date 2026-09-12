type FitPoint = {
    id: number;
    text: string;
};

type EngagementFitData = {
    heading: string;
    description: string;
    suitableHeading: string;
    suitablePoints: FitPoint[];
    notSuitableHeading: string;
    notSuitablePoints: FitPoint[];
};

function formatHeading(heading: string) {
    if (!heading) return null;
    const text = heading.replace(/\\n/g, "\n").trim();

    // 1. If CMS explicitly provides line breaks, honor them
    if (text.includes("\n")) {
        const lines = text.split("\n");
        return (
            <>
                {lines.map((line, idx) => (
                    <span key={idx} className={`block whitespace-normal sm:whitespace-nowrap ${idx < lines.length - 1 ? "mb-1 sm:mb-1.5" : ""}`}>
                        {line}
                    </span>
                ))}
            </>
        );
    }

    // 2. Dynamic clause splitting without hardcoding any specific words
    const commaIndex = text.indexOf(",");
    if (commaIndex !== -1) {
        const firstClause = text.slice(0, commaIndex + 1).trim();
        const secondClause = text.slice(commaIndex + 1).trim();
        const words = firstClause.split(/\s+/);

        if (words.length >= 3) {
            const line1 = words.slice(0, 2).join(" ");
            const line2 = words.slice(2).join(" ");
            return (
                <>
                    <span className="block mb-1 sm:mb-1.5">{line1}</span>
                    <span className="block mb-1 sm:mb-1.5">{line2}</span>
                    <span className="block whitespace-nowrap">{secondClause}</span>
                </>
            );
        }

        return (
            <>
                <span className="block mb-1 sm:mb-1.5">{firstClause}</span>
                <span className="block whitespace-nowrap">{secondClause}</span>
            </>
        );
    }

    return <span className="block text-pretty">{text}</span>;
}

function formatDescription(description: string) {
    if (!description) return null;
    const text = description.replace(/\\n/g, "\n").trim();

    // 1. If CMS explicitly provides line breaks, honor them
    if (text.includes("\n")) {
        return (
            <>
                {text.split("\n").map((line, idx) => (
                    <span key={idx} className="block whitespace-normal">
                        {line}
                    </span>
                ))}
            </>
        );
    }

    // 2. Exact 4-line break matching the design specification
    if (text.toLowerCase().includes("trading calendar")) {
        return (
            <>
                <span className="inline lg:block lg:whitespace-nowrap">The trading calendar has taught shoppers here to wait. When a storefront</span>
                <span className="inline lg:block lg:whitespace-nowrap">doesn&apos;t make the case for a product at full price, the promotion has to —</span>
                <span className="inline lg:block lg:whitespace-nowrap">and margin pays for it. We redesign Shopify stores so the buying</span>
                <span className="inline lg:block lg:whitespace-nowrap">argument sits on the page, not in the discount code.</span>
            </>
        );
    }

    return text;
}

const KNOWN_POINT_BREAKS: Record<string, [string, string]> = {
    // Card 2 (Not Suitable)
    "require a theme installed at the lowest available cost": [
        "Require A Theme Installed At The Lowest",
        "Available Cost",
    ],
    "are prelaunch with no trading history to work from": [
        "Are Pre-Launch, With No Trading",
        "History To Work From",
    ],
    "need a full storefront live within a fortnight": [
        "Need A Full Storefront Live Within A",
        "Fortnight",
    ],
    "resolve design decisions by committee": [
        "Resolve Design Decisions By",
        "Committee",
    ],
    "are not prepared to change how the store operates": [
        "Are Not Prepared To Change How The",
        "Store Operates",
    ],
    // Card 1 (Suitable)
    "hold established market share and need more from existing traffic": [
        "Hold Established Market Share and Need",
        "More From Existing Traffic",
    ],
    "invest materially in paid media and want to measure it": [
        "Invest Materially In Paid Media and Want To",
        "Measure It",
    ],
    "have outgrown a theme built or refreshed several years ago": [
        "Have Outgrown A Theme Built or Refreshed",
        "Several Years Ago",
    ],
    "want strategic redesign rather than surface visual refresh": [
        "Want Strategic Redesign Rather Than Surface",
        "Visual Refresh",
    ],
    "can nominate one decisionmaker responsible for the engagement": [
        "Can Nominate One Decision-Maker Responsible",
        "For The Engagement",
    ],
};

function formatPointText(text: string) {
    if (!text) return null;
    const clean = text.replace(/\\n/g, "\n").trim();

    if (clean.includes("\n")) {
        return (
            <>
                {clean.split("\n").map((line, idx) => (
                    <span key={idx} className="block">
                        {line}
                    </span>
                ))}
            </>
        );
    }

    const key = clean.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
    const matched = KNOWN_POINT_BREAKS[key];
    if (matched) {
        return (
            <>
                <span className="block whitespace-nowrap">{matched[0]}</span>
                <span className="block whitespace-nowrap">{matched[1]}</span>
            </>
        );
    }

    return clean;
}

export default function EngagementFit({
    data,
}: {
    data: EngagementFitData;
}) {
    if (!data) return null;
    const suitableCount = data.suitablePoints?.length || 0;
    const notSuitableCount = data.notSuitablePoints?.length || 0;
    const totalPointRows = Math.max(suitableCount, notSuitableCount, 5);

    return (
        <section className="px-6 py-14 sm:py-16 lg:py-20 xl:py-28 bg-white lg:px-[60px] xl:px-[80px]">
            <div className="mx-auto w-full max-w-[1720px]">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-8 xl:gap-10 2xl:gap-16">
                    {/* Left Column: Heading & Description (anchored to left corner) */}
                    <div className="flex flex-col w-full lg:w-[46%] xl:w-[44%] 2xl:w-[42%] 2xl:max-w-[740px] shrink-0">
                        <h2 className="heading-engagement-fit font-delight font-medium tracking-[-0.015em] text-[#0f1d07] mb-4 lg:mb-5 xl:mb-6 max-w-full">
                            {formatHeading(data.heading)}
                        </h2>
                        <p
                            className="font-satoshi font-medium text-black text-[clamp(14.5px,1.06vw,16.2px)] leading-[1.62] xl:leading-[1.68] w-fit max-w-full"
                            style={{ fontFamily: "var(--font-satoshi), Satoshi, sans-serif", fontWeight: 500, color: "#000000" }}
                        >
                            {formatDescription(data.description)}
                        </p>
                    </div>

                    {/* Right Column: 2 Cards stretching cleanly to the right corner (right card slightly wider to fit heading snug on one line) */}
                    <div
                        className="sync-engagement-cards grid grid-cols-1 sm:grid-cols-[1fr_1.08fr] gap-5 sm:gap-x-6 lg:gap-x-7 xl:gap-x-8 gap-y-4 sm:gap-y-[17.5px] xl:gap-y-[18.5px] items-stretch w-full sm:max-w-[620px] lg:max-w-[695px] xl:max-w-[750px] 2xl:max-w-[790px] -mt-2 sm:-mt-2.5 lg:-mt-3 xl:-mt-3.5 2xl:-mt-4"
                        style={{ '--point-rows': totalPointRows } as React.CSSProperties}
                    >
                        {/* Card 1: Suitable */}
                        <div className="sync-engagement-card rounded-[10px] bg-[#EEF1FA] border border-[#C8C8C8] px-4.5 sm:px-5 lg:px-4.5 xl:px-5 2xl:px-5.5 pt-3 sm:pt-3.5 lg:pt-3 xl:pt-3.5 2xl:pt-4 pb-4 sm:pb-4.5 lg:pb-4 xl:pb-4.5 2xl:pb-5 lg:bg-[#EFF0FC] flex flex-col h-full overflow-hidden">
                            <h3 className="font-delight text-[clamp(19px,1.5vw,24.5px)] font-medium text-black lg:text-[#1A1A1A] leading-[1.25] mb-4.5 sm:mb-1 tracking-[-0.01em] whitespace-nowrap flex items-start -translate-x-1.5 sm:-translate-x-2">
                                {data.suitableHeading}
                            </h3>
                            <ul className="space-y-4 sm:space-y-0 sm:contents">
                                {(data.suitablePoints || []).map((point) => (
                                     <li key={point.id} className="flex items-start gap-2.5 sm:gap-3">
                                         <img
                                             src="/images/tick.svg"
                                             alt=""
                                             className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] shrink-0 mt-[11px] sm:mt-[12px]"
                                         />
                                         <span
                                             className="font-satoshi font-normal text-[clamp(13.5px,1.0vw,14.6px)] text-[#1A1A1A] leading-[1.38] sm:leading-[1.4] max-w-[275px] sm:max-w-[290px] lg:max-w-[305px] xl:max-w-[325px]"
                                             style={{ fontFamily: "var(--font-satoshi), Satoshi, sans-serif", fontWeight: 400 }}
                                         >
                                             {formatPointText(point.text)}
                                         </span>
                                     </li>
                                 ))}
                            </ul>
                        </div>

                        {/* Card 2: Not Suitable */}
                        <div className="sync-engagement-card rounded-[10px] bg-white border border-[#C8C8C8] px-4.5 sm:px-5 lg:px-4.5 xl:px-5 2xl:px-5.5 pt-3 sm:pt-3.5 lg:pt-3 xl:pt-3.5 2xl:pt-4 pb-4 sm:pb-4.5 lg:pb-4 xl:pb-4.5 2xl:pb-5 flex flex-col h-full shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden">
                            <h3 className="font-delight text-[clamp(19px,1.5vw,24.5px)] font-medium text-black lg:text-[#1A1A1A] leading-[1.25] mb-4.5 sm:mb-1 tracking-[-0.01em] whitespace-nowrap flex items-start -translate-x-1.5 sm:-translate-x-2">
                                {data.notSuitableHeading}
                            </h3>
                            <ul className="space-y-4 sm:space-y-0 sm:contents">
                                {(data.notSuitablePoints || []).map((point) => (
                                    <li key={point.id} className="flex items-start gap-2.5 sm:gap-3">
                                        <img
                                            src="/images/tick.svg"
                                            alt=""
                                            className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] shrink-0 mt-[11px] sm:mt-[12px]"
                                        />
                                        <span
                                            className="font-satoshi font-normal text-[clamp(13.5px,1.0vw,14.6px)] text-[#1A1A1A] leading-[1.38] sm:leading-[1.4] max-w-[275px] sm:max-w-[290px] lg:max-w-[305px] xl:max-w-[325px]"
                                            style={{ fontFamily: "var(--font-satoshi), Satoshi, sans-serif", fontWeight: 400 }}
                                        >
                                            {formatPointText(point.text)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}