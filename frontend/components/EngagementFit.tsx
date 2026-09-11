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
        return (
            <>
                {text.split("\n").map((line, idx) => (
                    <span key={idx} className="block whitespace-normal sm:whitespace-nowrap">
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
                    <span className="block">{line1}</span>
                    <span className="block">{line2}</span>
                    <span className="block whitespace-nowrap">{secondClause}</span>
                </>
            );
        }

        return (
            <>
                <span className="block">{firstClause}</span>
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
                <span className="inline lg:block lg:whitespace-nowrap">The trading calendar has taught shoppers here to wait. When a storefront </span>
                <span className="inline lg:block lg:whitespace-nowrap">doesn&apos;t make the case for a product at full price, the promotion has to — </span>
                <span className="inline lg:block lg:whitespace-nowrap">and margin pays for it. We redesign Shopify stores so the buying </span>
                <span className="inline lg:block lg:whitespace-nowrap">argument sits on the page, not in the discount code.</span>
            </>
        );
    }

    return text;
}

export default function EngagementFit({
    data,
}: {
    data: EngagementFitData;
}) {
    if (!data) return null;
    return (
        <section className="px-6 py-14 sm:py-16 lg:py-20 xl:py-28 bg-white lg:px-[60px] xl:px-[80px]">
            <div className="mx-auto w-full max-w-[1720px]">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-8 xl:gap-10 2xl:gap-16">
                    {/* Left Column: Heading & Description (anchored to left corner) */}
                    <div className="flex flex-col w-full lg:w-[48%] xl:w-[46%] 2xl:w-[45%] 2xl:max-w-[760px] shrink-0">
                        <h2 className="heading-engagement-fit font-delight font-medium tracking-[-0.015em] text-[#0f1d07] mb-4 lg:mb-5 xl:mb-6 max-w-full">
                            {formatHeading(data.heading)}
                        </h2>
                        <p
                            className="font-satoshi font-normal text-black text-[clamp(14px,1.08vw,15.5px)] leading-[1.62] xl:leading-[1.68] max-w-full"
                            style={{ fontFamily: "var(--font-satoshi), Satoshi, sans-serif", fontWeight: 400, color: "#000000" }}
                        >
                            {formatDescription(data.description)}
                        </p>
                    </div>

                    {/* Right Column: 2 Cards stretching cleanly to the right corner (right card wider to fit larger heading on one line) */}
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.16fr] gap-4 sm:gap-4.5 lg:gap-4.5 xl:gap-5 2xl:gap-6 items-stretch w-full sm:max-w-[620px] lg:max-w-[690px] xl:max-w-[740px] 2xl:max-w-[770px] -mt-2 sm:-mt-2.5 lg:-mt-3 xl:-mt-3.5 2xl:-mt-4">
                        {/* Card 1: Suitable */}
                        <div className="rounded-[10px] bg-[#EEF1FA] border border-[#C8C8C8] px-4.5 sm:px-5 lg:px-4.5 xl:px-5 2xl:px-5.5 pt-3 sm:pt-3.5 lg:pt-3 xl:pt-3.5 2xl:pt-4 pb-4 sm:pb-4.5 lg:pb-4 xl:pb-4.5 2xl:pb-5 lg:bg-[#EFF0FC] flex flex-col h-full overflow-hidden">
                            <h3 className="font-delight text-[clamp(18px,1.4vw,22.5px)] font-medium text-black lg:text-[#1A1A1A] leading-[1.25] mb-4.5 sm:mb-5 lg:mb-5 tracking-tight whitespace-nowrap flex items-start -ml-1 sm:-ml-1.5">
                                {data.suitableHeading}
                            </h3>
                            <ul className="space-y-3.5 sm:space-y-4">
                                {(data.suitablePoints || []).map((point) => (
                                     <li key={point.id} className="flex items-start gap-2.5 sm:gap-3">
                                         <img
                                             src="/images/tick.svg"
                                             alt=""
                                             className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] shrink-0 mt-[2.5px] sm:mt-[3px]"
                                         />
                                         <span
                                             className="font-satoshi font-normal text-[clamp(13px,0.98vw,14px)] text-[#1A1A1A] leading-[1.42]"
                                             style={{ fontFamily: "var(--font-satoshi), Satoshi, sans-serif", fontWeight: 400 }}
                                         >
                                             {point.text}
                                         </span>
                                     </li>
                                 ))}
                            </ul>
                        </div>

                        {/* Card 2: Not Suitable */}
                        <div className="rounded-[10px] bg-white border border-[#C8C8C8] px-4.5 sm:px-5 lg:px-4.5 xl:px-5 2xl:px-5.5 pt-3 sm:pt-3.5 lg:pt-3 xl:pt-3.5 2xl:pt-4 pb-4 sm:pb-4.5 lg:pb-4 xl:pb-4.5 2xl:pb-5 flex flex-col h-full shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden">
                            <h3 className="font-delight text-[clamp(18px,1.4vw,22.5px)] font-medium text-black lg:text-[#1A1A1A] leading-[1.25] mb-4.5 sm:mb-5 lg:mb-5 tracking-tight whitespace-nowrap flex items-start -ml-1 sm:-ml-1.5">
                                {data.notSuitableHeading}
                            </h3>
                            <ul className="space-y-3.5 sm:space-y-4">
                                {(data.notSuitablePoints || []).map((point) => (
                                    <li key={point.id} className="flex items-start gap-2.5 sm:gap-3">
                                        <img
                                            src="/images/tick.svg"
                                            alt=""
                                            className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] shrink-0 mt-[2.5px] sm:mt-[3px]"
                                        />
                                        <span
                                            className="font-satoshi font-normal text-[clamp(13px,0.98vw,14px)] text-[#1A1A1A] leading-[1.42]"
                                            style={{ fontFamily: "var(--font-satoshi), Satoshi, sans-serif", fontWeight: 400 }}
                                        >
                                            {point.text}
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