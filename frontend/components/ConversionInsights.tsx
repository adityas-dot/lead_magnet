import { getMediaUrl } from "@/lib/strapi";

type InsightCard = {
    id: number;
    title: string;
    description: string;
    mobileDescription?: string;
    MobileDescription?: string;
    image?: {
        url: string;
        alternativeText?: string | null;
    };
};

type ConversionInsightsData = {
    heading: string;
    description: string;
    MobileHeading?: string;
    mobileHeading?: string;
    MobileDescription?: string;
    mobileDescription?: string;
    cards: InsightCard[];
};

export default function ConversionInsights({
    data,
}: {
    data: ConversionInsightsData;
}) {
    if (!data) return null;
    const mobileHeading = data.MobileHeading || data.mobileHeading;
    const mobileDesc = data.MobileDescription || data.mobileDescription;

    return (
        <section className="w-full bg-white px-5 sm:px-6 pt-10 pb-20 lg:px-[60px] xl:px-[80px] lg:pt-[30px] lg:pb-[90px]">
            <div className="mx-auto max-w-[1720px] w-full">
                <div className="w-full max-w-[1200px]">
                    {mobileHeading ? (
                        <>
                            <h2 className="block md:hidden font-delight text-[clamp(26px,5.5vw,36px)] font-medium leading-[1.2] tracking-[-0.01em] text-[#0F1D07]">
                                {mobileHeading}
                            </h2>
                            <h2 className="hidden md:block font-delight text-[clamp(32px,4.5vw,65px)] font-medium leading-[1.15] tracking-[-0.015em] text-[#0F1D07]">
                                {data.heading}
                            </h2>
                        </>
                    ) : (
                        <h2 className="font-delight text-[clamp(32px,4.5vw,65px)] font-medium leading-[1.15] tracking-[-0.015em] text-[#0F1D07]">
                            {data.heading}
                        </h2>
                    )}

                    {mobileDesc ? (
                        <>
                            <p className="block md:hidden font-satoshi font-medium mt-5 w-full whitespace-pre-line text-pretty text-[clamp(13px,3.6vw,16px)] leading-[1.7] text-[#0F1D07]">
                                {mobileDesc}
                            </p>
                            <p className="hidden md:block font-satoshi font-medium mt-5 w-full max-w-[1200px] whitespace-pre-line text-pretty text-[clamp(14px,1.2vw,16px)] leading-[1.7] text-[#0F1D07]">
                                {data.description}
                            </p>
                        </>
                    ) : (
                        <p className="font-satoshi font-medium mt-5 w-full max-w-[1200px] whitespace-pre-line text-pretty text-[clamp(14px,1.2vw,16px)] leading-[1.7] text-[#0F1D07]">
                            {data.description}
                        </p>
                    )}
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10 lg:gap-12 w-full">
                    {(data.cards || []).map((card, index) => {
                        const imageUrl = getMediaUrl(card.image);
                        const isDark = index === 0;
                        const bgColors = ["bg-[#014051]", "bg-[#B4BCFE]", "bg-[#D1E6D1]"];
                        const bgColor = bgColors[index % bgColors.length];
                        const textColor = isDark ? "text-white" : "text-[#0F1D07]";
                        const descriptionColor = isDark ? "text-[#FFFFFFC7]" : "text-black";
                        const descriptionWeight = index === 0 ? "font-normal" : "font-medium";
                        const cardMobileDesc = card.mobileDescription || card.MobileDescription;

                        const descMaxWidth = index === 0 
                            ? "max-w-[315px] min-[1750px]:max-w-none" 
                            : "max-w-[335px] min-[1750px]:max-w-none";

                        const getImageClass = (idx: number) => {
                            if (idx === 0) {
                                return "h-full max-h-[110px] min-[460px]:max-h-[125px] md:max-h-[160px] min-[1750px]:max-h-[190px] w-auto max-w-full object-contain object-left-top";
                            }
                            if (idx === 1) {
                                return "h-full max-h-[102px] min-[460px]:max-h-[116px] md:max-h-[148px] min-[1750px]:max-h-[178px] w-auto max-w-full object-contain object-left-top";
                            }
                            // Card 3: extended down to align bottom with card 2
                            return "h-full max-h-[104px] min-[460px]:max-h-[120px] md:max-h-[156px] max-w-[152px] min-[1750px]:max-w-none min-[1750px]:max-h-[186px] w-auto object-contain object-left-top";
                        };

                        const getContainerPadding = (idx: number) => {
                            if (idx === 0 || idx === 1) {
                                return "p-[30px_24px_0] min-[460px]:p-[32px_28px_0] md:px-8 md:pt-11 md:pb-0 min-[1750px]:px-10 min-[1750px]:pt-12";
                            }
                            return "p-[24px_24px_0] min-[460px]:p-[26px_28px_0] md:px-8 md:pt-8 md:pb-0 min-[1750px]:px-10 min-[1750px]:pt-10";
                        };

                        return (
                            <article
                                key={card.id}
                                className={`overflow-hidden rounded-[12px] md:rounded-[24px] ${bgColor} ${textColor} flex flex-col h-full min-h-[330px] min-[460px]:min-h-[350px] md:min-h-[415px] lg:min-h-[425px] min-[1750px]:min-h-[475px] justify-start w-full`}
                            >
                                {imageUrl && (
                                    <div className={`w-full flex justify-start items-start ${getContainerPadding(index)} h-[140px] min-[460px]:h-[154px] md:h-[196px] min-[1750px]:h-[235px] shrink-0`}>
                                        <img
                                            src={imageUrl}
                                            alt={card.image?.alternativeText || card.title}
                                            className={getImageClass(index)}
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col justify-start flex-grow p-[18px_24px_24px] min-[460px]:p-[20px_28px_26px] md:px-8 md:pt-5 md:pb-9 min-[1750px]:px-10 min-[1750px]:pt-7 min-[1750px]:pb-11">
                                    <h3 className={`font-nohemi font-normal whitespace-pre-line text-pretty ${textColor} text-[clamp(20px,1.8vw,26px)] min-[1750px]:text-[29px] leading-[1.2] min-[1750px]:leading-[1.22] tracking-[-0.02em] mb-4 md:mb-5 min-h-[48px] md:min-h-[64px] min-[1750px]:min-h-[72px] max-w-[340px] min-[1750px]:max-w-[345px] flex items-start`}>
                                        {card.title}
                                    </h3>

                                    {cardMobileDesc ? (
                                        <>
                                            <p className={`block md:hidden font-satoshi text-[12px] leading-[1.5] whitespace-pre-line text-pretty ${descMaxWidth} ${descriptionWeight} ${descriptionColor}`}>
                                                {cardMobileDesc}
                                            </p>
                                            <p className={`hidden md:block font-satoshi text-[clamp(12px,0.95vw,13px)] min-[1750px]:text-[14.5px] leading-[1.6] min-[1750px]:leading-[1.65] whitespace-pre-line text-pretty ${descMaxWidth} ${descriptionWeight} ${descriptionColor}`}>
                                                {card.description}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className={`block md:hidden font-satoshi text-[12px] leading-[1.5] whitespace-pre-line text-pretty ${descMaxWidth} ${descriptionWeight} ${descriptionColor}`}>
                                                {card.description}
                                            </p>
                                            <p className={`hidden md:block font-satoshi text-[clamp(12px,0.95vw,13px)] min-[1750px]:text-[14.5px] leading-[1.6] min-[1750px]:leading-[1.65] whitespace-pre-line text-pretty ${descMaxWidth} ${descriptionWeight} ${descriptionColor}`}>
                                                {card.description}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}