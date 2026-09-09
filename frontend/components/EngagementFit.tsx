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

    const normalized = heading.replace(/\\n/g, "\n");
    if (normalized.includes("\n")) {
        return normalized.split("\n").map((line, idx) => (
            <span key={idx} className="block">
                {line}
            </span>
        ));
    }

    const match = heading.match(/^(Where this)\s+(engagement works,)\s+(.*)$/i);
    if (match) {
        return (
            <>
                <span className="block">{match[1]}</span>
                <span className="block">{match[2]}</span>
                <span className="block xl:whitespace-nowrap">{match[3]}</span>
            </>
        );
    }

    return heading;
}

export default function EngagementFit({
    data,
}: {
    data: EngagementFitData;
}) {
    return (
        <section className="px-6 py-16 lg:py-28 xl:py-36 bg-white lg:px-[60px] xl:px-[80px]">
            <div className="mx-auto w-full max-w-[1720px]">
                <div className="flex flex-col lg:flex-row justify-between items-stretch gap-8 lg:gap-8 xl:gap-14 2xl:gap-16">
                    {/* Left Column: Heading & Description */}
                    <div className="flex flex-col justify-between h-full w-full lg:max-w-[380px] xl:max-w-[480px] 2xl:max-w-[520px]">
                        <h2 className="font-delight text-[clamp(30px,3.6vw,52px)] font-medium leading-[1.15] lg:leading-[1.18] tracking-[-0.01em] text-[#0f1d07] space-y-1.5 lg:space-y-2 mb-4 lg:mb-5">
                            {formatHeading(data.heading)}
                        </h2>
                        <p className="font-satoshi font-medium text-[#4A4A4A] text-[14px] xl:text-[15px] leading-[1.65] xl:leading-[1.75] max-w-[480px]">
                            {data.description}
                        </p>
                    </div>

                    {/* Right Column: 2 Cards aligned to right edge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:gap-4 xl:gap-5 items-stretch w-full lg:max-w-[540px] xl:max-w-[660px] 2xl:max-w-[680px] lg:ml-auto">
                        {/* Card 1: Suitable */}
                        <div className="rounded-[14px] bg-[#EFF0FC] border border-[#E5E7F0] p-4 sm:p-5 xl:p-6 flex flex-col h-full">
                            <h3 className="font-delight text-[14px] sm:text-[15px] lg:text-[15px] xl:text-[17px] font-medium text-[#1A1A1A] mb-3.5 xl:mb-4 min-h-[38px] xl:min-h-[24px] flex items-center">
                                {data.suitableHeading}
                            </h3>
                            <ul className="space-y-3 xl:space-y-3.5">
                                {data.suitablePoints.map((point) => (
                                    <li key={point.id} className="flex items-start gap-2 lg:gap-2.5 min-h-[36px] xl:min-h-[40px]">
                                        <img
                                            src="/images/tick.svg"
                                            alt=""
                                            className="w-4 h-4 shrink-0 mt-2.5 xl:mt-[11px]"
                                        />
                                        <span className="font-satoshi text-[12.5px] lg:text-[13px] xl:text-[14px] font-normal text-[#1A1A1A] leading-[1.35] xl:leading-[1.4]">
                                            {point.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Card 2: Not Suitable */}
                        <div className="rounded-[14px] bg-white border border-[#E5E7F0] p-4 sm:p-5 xl:p-6 flex flex-col h-full shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                            <h3 className="font-delight text-[14px] sm:text-[15px] lg:text-[15px] xl:text-[17px] font-medium text-[#1A1A1A] mb-3.5 xl:mb-4 min-h-[38px] xl:min-h-[24px] flex items-center">
                                {data.notSuitableHeading}
                            </h3>
                            <ul className="space-y-3 xl:space-y-3.5">
                                {data.notSuitablePoints.map((point) => (
                                    <li key={point.id} className="flex items-start gap-2 lg:gap-2.5 min-h-[36px] xl:min-h-[40px]">
                                        <img
                                            src="/images/tick.svg"
                                            alt=""
                                            className="w-4 h-4 shrink-0 mt-2.5 xl:mt-[11px]"
                                        />
                                        <span className="font-satoshi text-[12.5px] lg:text-[13px] xl:text-[14px] font-normal text-[#1A1A1A] leading-[1.35] xl:leading-[1.4]">
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