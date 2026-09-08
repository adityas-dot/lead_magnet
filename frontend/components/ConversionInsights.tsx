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
        <section className="w-full bg-white px-6 pt-10 pb-20 lg:px-[60px] xl:px-[80px] lg:pt-[30px] lg:pb-[90px]">
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
                        const bgColors = ["bg-[#023E45]", "bg-[#B4BCFE]", "bg-[#C4E0C1]"];
                        const bgColor = bgColors[index % bgColors.length];
                        const textColor = isDark ? "text-white" : "text-[#0F1D07]";
                        const descriptionColor = isDark ? "text-white/80" : "text-[#0F1D07]/80";
                        const cardMobileDesc = card.mobileDescription || card.MobileDescription;

                        return (
                            <article
                                key={card.id}
                                className={`overflow-hidden rounded-[24px] ${bgColor} ${textColor} flex flex-col h-full min-h-[380px]`}
                            >
                                {imageUrl && (
                                    <div className="px-8 pt-10 pb-4 w-full h-[180px] flex justify-start items-start">
                                        <img
                                            src={imageUrl}
                                            alt={card.image?.alternativeText || card.title}
                                            className="h-full max-w-full object-contain"
                                        />
                                    </div>
                                )}

                                <div className="p-8 pt-4 flex-grow flex flex-col">
                                    <h3 className="font-nohemi text-[clamp(20px,1.8vw,24px)] font-light leading-[1.2] tracking-[-0.02em] mb-4">
                                        {card.title}
                                    </h3>

                                    {cardMobileDesc ? (
                                        <>
                                            <p className={`block md:hidden font-satoshi text-[clamp(13px,3.6vw,14px)] leading-[1.65] font-medium ${descriptionColor}`}>
                                                {cardMobileDesc}
                                            </p>
                                            <p className={`hidden md:block font-satoshi text-[clamp(13px,1.1vw,14px)] leading-[1.65] font-medium ${descriptionColor}`}>
                                                {card.description}
                                            </p>
                                        </>
                                    ) : (
                                        <p className={`font-satoshi text-[clamp(13px,1.1vw,14px)] leading-[1.65] font-medium ${descriptionColor}`}>
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