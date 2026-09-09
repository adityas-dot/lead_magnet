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
                            <h2 className="hidden md:block font-delight text-[clamp(28px,4.2vw,56px)] font-medium leading-[1.2] tracking-[-0.01em] text-[#0F1D07]">
                                {data.heading}
                            </h2>
                        </>
                    ) : (
                        <h2 className="font-delight text-[clamp(28px,4.2vw,56px)] font-medium leading-[1.2] tracking-[-0.01em] text-[#0F1D07]">
                            {data.heading}
                        </h2>
                    )}

                    {mobileDesc ? (
                        <>
                            <p className="block md:hidden font-satoshi font-medium mt-5 w-full whitespace-pre-line text-[clamp(13px,3.6vw,16px)] leading-[1.7] text-[#0F1D07]">
                                {mobileDesc}
                            </p>
                            <p className="hidden md:block font-satoshi font-medium mt-5 w-full whitespace-pre-line text-[clamp(14px,1.2vw,16px)] leading-[1.7] text-[#0F1D07]">
                                {data.description}
                            </p>
                        </>
                    ) : (
                        <p className="font-satoshi font-medium mt-5 w-full whitespace-pre-line text-[clamp(14px,1.2vw,16px)] leading-[1.7] text-[#0F1D07]">
                            {data.description}
                        </p>
                    )}
                </div>

                <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                    {data.cards.map((card, index) => {
                        const imageUrl = getMediaUrl(card.image?.url);
                        const isDark = index === 0;
                        const bgColors = ["bg-[#014051]", "bg-[#B4BCFE]", "bg-[#C4E0C1]"];
                        const bgColor = bgColors[index % bgColors.length];
                        const textColor = isDark ? "text-white" : "text-[#0F1D07]";
                        const descriptionColor = isDark ? "text-white/80" : "text-[#0F1D07]/80";
                        const cardMobileDesc = card.mobileDescription || card.MobileDescription;

                        return (
                            <article
                                key={card.id}
                                className={`overflow-hidden rounded-[12px] md:rounded-[24px] ${bgColor} ${textColor} flex flex-col h-[297px] min-[460px]:h-[325px] md:h-full md:min-h-[380px] p-[24px_30px] min-[460px]:p-[26px_32px] md:p-0 justify-between`}
                            >
                                {imageUrl && (
                                    <div className="w-full flex justify-start items-start md:px-8 md:pt-10 md:pb-4 md:h-[180px]">
                                        <img
                                            src={imageUrl}
                                            alt={card.image?.alternativeText || card.title}
                                            className="h-[clamp(100px,26vw,140px)] w-auto max-w-full object-contain md:h-full md:w-auto"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col justify-end mt-auto md:mt-0 md:p-8 md:pt-4 md:flex-grow">
                                    <h3 className="font-nohemi text-[20px] min-[460px]:text-[22px] md:text-[clamp(20px,1.8vw,24px)] font-light leading-[1.2] tracking-[-0.02em] mb-2.5 md:mb-4">
                                        {card.title}
                                    </h3>

                                    {cardMobileDesc ? (
                                        <>
                                            <p className={`block md:hidden font-satoshi text-[13.5px] leading-[1.5] font-normal ${descriptionColor}`}>
                                                {cardMobileDesc}
                                            </p>
                                            <p className={`hidden md:block font-satoshi text-[clamp(13px,1.1vw,14px)] leading-[1.65] font-medium ${descriptionColor}`}>
                                                {card.description}
                                            </p>
                                        </>
                                    ) : (
                                        <p className={`font-satoshi text-[13.5px] md:text-[clamp(13px,1.1vw,14px)] leading-[1.5] md:leading-[1.65] font-normal md:font-medium ${descriptionColor}`}>
                                            {card.description}
                                        </p>
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