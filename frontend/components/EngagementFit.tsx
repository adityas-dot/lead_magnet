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
            <span key={idx} className="block whitespace-normal sm:whitespace-nowrap">
                {line}
            </span>
        ));
    }

    const match = heading.match(/^(Where this)\s+(engagement works,)\s+(.*)$/i);
    if (match) {
        return (
            <>
                <span className="block">{match[1]}</span>
                <span className="block whitespace-normal sm:whitespace-nowrap">{match[2]}</span>
                <span className="block whitespace-normal sm:whitespace-nowrap">{match[3]}</span>
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
        <section className="px-6 py-14 sm:py-16 lg:py-20 xl:py-28 bg-white lg:px-[60px] xl:px-[80px]">
            <div className="mx-auto w-full max-w-[1720px]">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-10 xl:gap-14 2xl:gap-16">
                    {/* Left Column: Heading & Description */}
                    <div className="flex flex-col w-full lg:max-w-[480px] xl:max-w-[520px] 2xl:max-w-[560px]">
                        <h2 className="font-delight text-[clamp(28px,3vw,44px)] xl:text-[clamp(36px,3.2vw,50px)] font-medium leading-[1.15] lg:leading-[1.18] tracking-[-0.01em] text-[#0f1d07] space-y-1.5 lg:space-y-2 mb-4 lg:mb-6">
                            {formatHeading(data.heading)}
                        </h2>
                        <p className="font-satoshi font-medium text-[#4A4A4A] text-[14px] xl:text-[15px] leading-[1.65] xl:leading-[1.75] max-w-[460px]">
                            {data.description}
                        </p>
                    </div>

                    {/* Right Column: 2 Cards aligned to right edge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-4 xl:gap-5 items-stretch w-full lg:max-w-[580px] xl:max-w-[660px] 2xl:max-w-[700px] lg:ml-auto">
                        {/* Card 1: Suitable */}
                        <div className="rounded-[12px] bg-[#EEF1FA] border border-[#E2E6F5] p-5 sm:p-6 lg:rounded-[14px] lg:bg-[#EFF0FC] lg:border-[#E5E7F0] lg:p-5 xl:p-6 flex flex-col h-full">
                            <h3 className="font-delight text-[clamp(16px,4.5vw,18px)] lg:text-[15.5px] xl:text-[17px] font-medium text-black lg:text-[#1A1A1A] mb-4 lg:mb-3.5 xl:mb-4 tracking-tight whitespace-nowrap lg:whitespace-normal sm:min-h-[46px] lg:min-h-[40px] xl:min-h-[26px] flex items-center">
                                {data.suitableHeading}
                            </h3>
                            <ul className="space-y-3.5 lg:space-y-3 xl:space-y-3.5">
                                {data.suitablePoints.map((point) => (
                                    <li key={point.id} className="flex items-start gap-3 lg:gap-2.5 sm:min-h-[42px] lg:min-h-[38px] xl:min-h-[42px]">
                                        <img
                                            src="/images/tick.svg"
                                            alt=""
                                            className="w-4 h-4 shrink-0 mt-0.5 lg:mt-3"
                                        />
                                        <span className="font-satoshi text-[14px] font-normal text-[#111111] leading-[1.4] lg:text-[13px] xl:text-[13.5px] 2xl:text-[14px] lg:text-[#1A1A1A] lg:leading-[1.35] xl:leading-[1.4]">
                                            {point.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Card 2: Not Suitable */}
                        <div className="rounded-[12px] bg-white border border-[#E2E6F5] p-5 sm:p-6 lg:rounded-[14px] lg:border-[#E5E7F0] lg:p-5 xl:p-6 flex flex-col h-full shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                            <h3 className="font-delight text-[clamp(16px,4.5vw,18px)] lg:text-[15.5px] xl:text-[17px] font-medium text-black lg:text-[#1A1A1A] mb-4 lg:mb-3.5 xl:mb-4 tracking-tight whitespace-nowrap lg:whitespace-normal sm:min-h-[46px] lg:min-h-[40px] xl:min-h-[26px] flex items-center">
                                {data.notSuitableHeading}
                            </h3>
                            <ul className="space-y-3.5 lg:space-y-3 xl:space-y-3.5">
                                {data.notSuitablePoints.map((point) => (
                                    <li key={point.id} className="flex items-start gap-3 lg:gap-2.5 sm:min-h-[42px] lg:min-h-[38px] xl:min-h-[42px]">
                                        <img
                                            src="/images/tick.svg"
                                            alt=""
                                            className="w-4 h-4 shrink-0 mt-0.5 lg:mt-3"
                                        />
                                        <span className="font-satoshi text-[14px] font-normal text-[#111111] leading-[1.4] lg:text-[13px] xl:text-[13.5px] 2xl:text-[14px] lg:text-[#1A1A1A] lg:leading-[1.35] xl:leading-[1.4]">
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