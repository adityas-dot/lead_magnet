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
                    {(data.cards || []).map((card, index) => {
                        const imageUrl = getMediaUrl(card.image?.url);
                        const isDark = index === 0;
                        const bgColors = ["bg-[#014051]", "bg-[#B4BCFE]", "bg-[#C4E0C1]"];
                        const bgColor = bgColors[index % bgColors.length];
                        const textColor = isDark ? "text-white" : "text-[#0F1D07]";
                        const descriptionColor = isDark ? "text-[#FFFFFFC7]" : "text-black";
                        const cardMobileDesc = card.mobileDescription || card.MobileDescription;

                        const formatTitle = (title: string) => {
                            if (!title) return "";
                            if (title.includes("\n")) {
                                return title.split("\n").map((line, i) => (
                                    <span key={i}>
                                        {i > 0 && <br />}
                                        {line}
                                    </span>
                                ));
                            }
                            if (/as the objective/i.test(title)) {
                                const idx = title.toLowerCase().indexOf("the objective");
                                return (
                                    <>
                                        {title.slice(0, idx).trimEnd()}
                                        <br />
                                        {title.slice(idx)}
                                    </>
                                );
                            }
                            return title;
                        };

                        return (
                            <article
                                key={card.id}
                                className={`overflow-hidden rounded-[12px] md:rounded-[24px] ${bgColor} ${textColor} flex flex-col h-full min-h-0 md:min-h-[360px] justify-start`}
                            >
                                {imageUrl && (
                                    <div className="w-full flex justify-start items-start p-[22px_24px_0] min-[460px]:p-[24px_28px_0] md:px-8 md:pt-8 md:pb-0 h-[115px] min-[460px]:h-[125px] md:h-[150px] shrink-0">
                                        <img
                                            src={imageUrl}
                                            alt={card.image?.alternativeText || card.title}
                                            className="h-full max-h-[95px] min-[460px]:max-h-[105px] md:max-h-[120px] w-auto max-w-full object-contain object-left-top"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col justify-start flex-grow p-[22px_24px_26px] min-[460px]:p-[24px_28px_28px] md:px-8 md:pt-7 md:pb-8">
                                    <h3 className="font-nohemi text-[clamp(20px,1.8vw,26px)] font-normal leading-[1.2] tracking-[-0.02em] mb-2.5 md:mb-3.5 min-h-0 md:min-h-[50px] lg:min-h-[54px] whitespace-pre-line">
                                        {formatTitle(card.title)}
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