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

    // If explicit newlines are present, respect them
    if (text.includes("\n")) {
        return (
            <>
                {text.split("\n").map((line, idx) => (
                    <span key={idx} className="block">
                        {line}
                    </span>
                ))}
            </>
        );
    }

    // Automatically split "Where this engagement works, and where it does not." into 3 clean lines without needing <br> or \n
    const match = text.match(/^(Where\s+this)\s+(engagement\s+works,?\s*)\s+(and\s+where\s+it\s+does\s+not\.?)$/i);
    if (match) {
        return (
            <>
                <span className="block whitespace-nowrap">{match[1]}</span>
                <span className="block whitespace-nowrap">{match[2].trim()}</span>
                <span className="block whitespace-nowrap">{match[3].trim()}</span>
            </>
        );
    }

    // Generic split for 2 comma clauses beginning with "Where this"
    const commaSplit = text.split(/,\s*/);
    if (commaSplit.length === 2 && commaSplit[0].toLowerCase().startsWith("where this")) {
        const line1 = "Where this";
        const line2 = commaSplit[0].substring(line1.length).trim() + ",";
        const line3 = commaSplit[1];
        return (
            <>
                <span className="block whitespace-nowrap">{line1}</span>
                <span className="block whitespace-nowrap">{line2}</span>
                <span className="block whitespace-nowrap">{line3}</span>
            </>
        );
    }

    return <span className="block text-pretty">{text}</span>;
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
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-8 xl:gap-10 2xl:gap-16">
                    {/* Left Column: Heading & Description (anchored to left corner) */}
                    <div className="flex flex-col w-full lg:w-[45%] xl:w-[43%] 2xl:w-[41%] 2xl:max-w-[720px] shrink-0">
                        <h2 className="font-delight text-[clamp(26px,2.4vw,44px)] 2xl:text-[52px] font-medium leading-[1.15] tracking-[-0.015em] text-[#0f1d07] mb-4 lg:mb-5 xl:mb-6 max-w-full">
                            {formatHeading(data.heading)}
                        </h2>
                        <p className="font-satoshi font-medium text-[#0F1D07] text-[14px] lg:text-[14px] xl:text-[14.5px] 2xl:text-[16px] leading-[1.6] xl:leading-[1.65] max-w-[580px] xl:max-w-[640px] 2xl:max-w-[720px] whitespace-pre-line text-pretty">
                            {data.description}
                        </p>
                    </div>

                    {/* Right Column: 2 Cards stretching cleanly to the right corner */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5 lg:gap-4 xl:gap-5 2xl:gap-7 items-stretch w-full flex-1 min-w-0">
                        {/* Card 1: Suitable */}
                        <div className="rounded-[8px] bg-[#EEF1FA] border border-[#C8C8C8] px-4.5 sm:px-5 lg:px-4.5 xl:px-5 2xl:px-8 pb-5 sm:pb-5 lg:pb-5 xl:pb-5.5 2xl:pb-8 pt-5 sm:pt-5 lg:pt-5 xl:pt-5.5 2xl:pt-7 lg:bg-[#EFF0FC] flex flex-col h-full">
                            <h3 className="font-delight text-[17px] sm:text-[18px] lg:text-[17px] xl:text-[18px] 2xl:text-[22px] font-medium text-black lg:text-[#1A1A1A] leading-[1.25] -mt-1 sm:-mt-1.5 -ml-0.5 sm:-ml-1 mb-3.5 lg:mb-3 xl:mb-4 tracking-tight whitespace-nowrap min-h-[26px] sm:min-h-[28px] flex items-center">
                                {data.suitableHeading}
                            </h3>
                            <ul className="space-y-2 sm:space-y-2.5 lg:space-y-2 xl:space-y-2 2xl:space-y-3">
                                {(data.suitablePoints || []).map((point) => (
                                    <li key={point.id} className="flex items-start gap-2 sm:gap-2.5 lg:gap-2 xl:gap-2.5 sm:min-h-[26px] lg:min-h-[24px] xl:min-h-[26px] 2xl:min-h-[32px]">
                                        <img
                                            src="/images/tick.svg"
                                            alt=""
                                            className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-4.5 2xl:h-4.5 shrink-0 mt-[2.5px]"
                                        />
                                        <span className="font-satoshi text-[12.5px] sm:text-[13px] lg:text-[12.5px] xl:text-[13px] 2xl:text-[14.5px] font-normal text-[#111111] leading-[1.38] lg:text-[#1A1A1A]">
                                            {point.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Card 2: Not Suitable */}
                        <div className="rounded-[8px] bg-white border border-[#C8C8C8] px-4.5 sm:px-5 lg:px-4.5 xl:px-5 2xl:px-8 pb-5 sm:pb-5 lg:pb-5 xl:pb-5.5 2xl:pb-8 pt-5 sm:pt-5 lg:pt-5 xl:pt-5.5 2xl:pt-7 flex flex-col h-full shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                            <h3 className="font-delight text-[17px] sm:text-[18px] lg:text-[17px] xl:text-[18px] 2xl:text-[22px] font-medium text-black lg:text-[#1A1A1A] leading-[1.25] -mt-1 sm:-mt-1.5 -ml-0.5 sm:-ml-1 mb-3.5 lg:mb-3 xl:mb-4 tracking-tight whitespace-nowrap min-h-[26px] sm:min-h-[28px] flex items-center">
                                {data.notSuitableHeading}
                            </h3>
                            <ul className="space-y-2 sm:space-y-2.5 lg:space-y-2 xl:space-y-2 2xl:space-y-3">
                                {(data.notSuitablePoints || []).map((point) => (
                                    <li key={point.id} className="flex items-start gap-2 sm:gap-2.5 lg:gap-2 xl:gap-2.5 sm:min-h-[26px] lg:min-h-[24px] xl:min-h-[26px] 2xl:min-h-[32px]">
                                        <img
                                            src="/images/tick.svg"
                                            alt=""
                                            className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-4.5 2xl:h-4.5 shrink-0 mt-[2.5px]"
                                        />
                                        <span className="font-satoshi text-[12.5px] sm:text-[13px] lg:text-[12.5px] xl:text-[13px] 2xl:text-[14.5px] font-normal text-[#111111] leading-[1.38] lg:text-[#1A1A1A]">
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