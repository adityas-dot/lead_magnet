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
    return (
        <span className="whitespace-pre-line text-pretty block">
            {normalized}
        </span>
    );
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
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-10 xl:gap-14 2xl:gap-16">
                    {/* Left Column: Heading & Description */}
                    <div className="flex flex-col w-full lg:max-w-[480px] xl:max-w-[520px] 2xl:max-w-[560px] shrink-0">
                        <h2 className="font-delight text-[clamp(29px,3.6vw,57px)] font-medium leading-[1.15] tracking-[-0.015em] text-[#0f1d07] mb-4 lg:mb-6 max-w-[480px] sm:max-w-[540px]">
                            {formatHeading(data.heading)}
                        </h2>
                        <p className="font-satoshi font-medium text-[#0F1D07] text-[16px] xl:text-[16px] leading-[1.6] xl:leading-[1.65] max-w-[520px] whitespace-pre-line text-pretty">
                            {data.description}
                        </p>
                    </div>

                    {/* Right Column: 2 Cards aligned to right edge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-6 xl:gap-7 items-stretch w-full lg:max-w-[740px] xl:max-w-[820px] 2xl:max-w-[880px] lg:ml-auto">
                        {/* Card 1: Suitable */}
                        <div className="rounded-[8px] bg-[#EEF1FA] border border-[#C8C8C8] px-5 sm:px-6 lg:px-5 xl:px-6 pb-5 sm:pb-6 lg:pb-5 xl:pb-6 pt-5 sm:pt-5.5 lg:pt-5 xl:pt-5.5 lg:bg-[#EFF0FC] flex flex-col h-full">
                            <h3 className="font-delight text-[clamp(16.5px,1.45vw,22px)] font-medium text-black lg:text-[#1A1A1A] leading-[1.25] -mt-1 sm:-mt-1.5 -ml-1 sm:-ml-1.5 mb-4 lg:mb-3.5 xl:mb-4 tracking-tight whitespace-nowrap min-h-[28px] sm:min-h-[32px] flex items-center">
                                {data.suitableHeading}
                            </h3>
                            <ul className="space-y-3 lg:space-y-2.5 xl:space-y-3">
                                {(data.suitablePoints || []).map((point) => (
                                    <li key={point.id} className="flex items-start gap-3 lg:gap-2.5 sm:min-h-[34px] lg:min-h-[30px] xl:min-h-[34px]">
                                        <img
                                            src="/images/tick.svg"
                                            alt=""
                                            className="w-5 h-5 shrink-0 mt-0.5"
                                        />
                                        <span className="font-satoshi text-[14px] sm:text-[14.5px] lg:text-[14.5px] xl:text-[15px] font-normal text-[#111111] leading-[1.4] lg:text-[#1A1A1A]">
                                            {point.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Card 2: Not Suitable */}
                        <div className="rounded-[8px] bg-white border border-[#C8C8C8] px-5 sm:px-6 lg:px-5 xl:px-6 pb-5 sm:pb-6 lg:pb-5 xl:pb-6 pt-5 sm:pt-5.5 lg:pt-5 xl:pt-5.5 flex flex-col h-full shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                            <h3 className="font-delight text-[clamp(16.5px,1.45vw,22px)] font-medium text-black lg:text-[#1A1A1A] leading-[1.25] -mt-1 sm:-mt-1.5 -ml-1 sm:-ml-1.5 mb-4 lg:mb-3.5 xl:mb-4 tracking-tight whitespace-nowrap min-h-[28px] sm:min-h-[32px] flex items-center">
                                {data.notSuitableHeading}
                            </h3>
                            <ul className="space-y-3 lg:space-y-2.5 xl:space-y-3">
                                {(data.notSuitablePoints || []).map((point) => (
                                    <li key={point.id} className="flex items-start gap-3 lg:gap-2.5 sm:min-h-[34px] lg:min-h-[30px] xl:min-h-[34px]">
                                        <img
                                            src="/images/tick.svg"
                                            alt=""
                                            className="w-5 h-5 shrink-0 mt-0.5"
                                        />
                                        <span className="font-satoshi text-[14px] sm:text-[14.5px] lg:text-[14.5px] xl:text-[15px] font-normal text-[#111111] leading-[1.4] lg:text-[#1A1A1A]">
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