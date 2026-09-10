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

    const formatSectionDescription = (desc: string) => {
        if (!desc) return "";
        const match = desc.match(/(.*?\bmargin)\s+(pays\b.*)/s);
        if (match) {
            return (
                <>
                    {match[1]}
                    <br className="hidden md:block" />
                    <span className="md:hidden"> </span>
                    {match[2]}
                </>
            );
        }
        return desc;
    };

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
                                {formatSectionDescription(data.description)}
                            </p>
                        </>
                    ) : (
                        <p className="font-satoshi font-medium mt-5 w-full whitespace-pre-line text-[clamp(14px,1.2vw,16px)] leading-[1.7] text-[#0F1D07]">
                            {formatSectionDescription(data.description)}
                        </p>
                    )}
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-[1.07fr_1.07fr_0.96fr] md:gap-10 lg:gap-12 max-w-[1360px]">
                    {(data.cards || []).map((card, index) => {
                        const imageUrl = getMediaUrl(card.image?.url);
                        const isDark = index === 0;
                        const bgColors = ["bg-[#014051]", "bg-[#B4BCFE]", "bg-[#D1E6D1]"];
                        const bgColor = bgColors[index % bgColors.length];
                        const textColor = isDark ? "text-white" : "text-[#0F1D07]";
                        const descriptionColor = isDark ? "text-[#FFFFFFC7]" : "text-black";
                        const descriptionWeight = index === 0 ? "font-normal" : "font-medium";
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
                            if (/trades/i.test(title) || /through peak/i.test(title)) {
                                const idx = title.toLowerCase().indexOf("through peak");
                                if (idx !== -1) {
                                    return (
                                        <>
                                            <span className="whitespace-nowrap">{title.slice(0, idx).trimEnd()}</span>
                                            <br />
                                            <span>{title.slice(idx)}</span>
                                        </>
                                    );
                                }
                            }
                            return title;
                        };

                        const formatDescription = (desc: string) => {
                            if (!desc) return "";
                            if (desc.includes("\n")) {
                                return desc.split("\n").map((line, i) => (
                                    <span key={i}>
                                        {i > 0 && <br />}
                                        {line}
                                    </span>
                                ));
                            }
                            if (/Every design decision/i.test(desc)) {
                                return (
                                    <>
                                        Every design decision is judged on whether it helps a
                                        <br />
                                        considered buyer commit without a code. Promotions
                                        <br />
                                        then become a growth lever rather than the only
                                        <br />
                                        working one.
                                    </>
                                );
                            }
                            if (/Product hierarchy/i.test(desc)) {
                                return (
                                    <>
                                        Product hierarchy, delivery information and checkout
                                        <br />
                                        are resolved at 390px first, then expanded. Most
                                        <br />
                                        themes do the reverse, which is where the conversion
                                        <br />
                                        gap originates.
                                    </>
                                );
                            }
                            if (/Modular sections/i.test(desc)) {
                                return (
                                    <>
                                        Modular sections, documented naming and a theme your
                                        <br />
                                        marketing team can re-merchandise without a
                                        <br />
                                        deployment — because the trading calendar does not
                                        <br />
                                        wait for a sprint.
                                    </>
                                );
                            }
                            return desc;
                        };

                        const getImageClass = (idx: number) => {
                            if (idx === 0) {
                                return "h-full max-h-[110px] min-[460px]:max-h-[125px] md:max-h-[160px] w-auto max-w-full object-contain object-left-top";
                            }
                            if (idx === 1) {
                                return "h-full max-h-[102px] min-[460px]:max-h-[116px] md:max-h-[148px] w-auto max-w-full object-contain object-left-top";
                            }
                            // Card 3: extended down to align bottom with card 2
                            return "h-full max-h-[104px] min-[460px]:max-h-[120px] md:max-h-[156px] max-w-[152px] w-auto object-contain object-left-top";
                        };

                        const getContainerPadding = (idx: number) => {
                            if (idx === 0 || idx === 1) {
                                return "p-[30px_24px_0] min-[460px]:p-[32px_28px_0] md:px-8 md:pt-11 md:pb-0";
                            }
                            return "p-[24px_24px_0] min-[460px]:p-[26px_28px_0] md:px-7 md:pt-8 md:pb-0";
                        };

                        return (
                            <article
                                key={card.id}
                                className={`overflow-hidden rounded-[12px] md:rounded-[24px] ${bgColor} ${textColor} flex flex-col h-full min-h-[330px] min-[460px]:min-h-[350px] md:min-h-[415px] lg:min-h-[425px] justify-start ${index === 2 ? "w-full md:max-w-[395px] lg:max-w-[405px]" : "w-full"}`}
                            >
                                {imageUrl && (
                                    <div className={`w-full flex justify-start items-start ${getContainerPadding(index)} h-[140px] min-[460px]:h-[154px] md:h-[196px] shrink-0`}>
                                        <img
                                            src={imageUrl}
                                            alt={card.image?.alternativeText || card.title}
                                            className={getImageClass(index)}
                                        />
                                    </div>
                                )}

                                <div className={`flex flex-col justify-start flex-grow p-[18px_24px_24px] min-[460px]:p-[20px_28px_26px] ${index === 2 ? "md:px-7" : "md:px-8"} md:pt-5 md:pb-9`}>
                                    <h3 className="font-nohemi text-[clamp(20px,1.8vw,26px)] font-normal leading-[1.2] tracking-[-0.02em] mb-2.5 md:mb-3.5 min-h-0 md:min-h-[50px] lg:min-h-[54px] whitespace-pre-line">
                                        {formatTitle(card.title)}
                                    </h3>

                                    {cardMobileDesc ? (
                                        <>
                                            <p className={`block md:hidden font-satoshi text-[12.5px] leading-[1.45] ${descriptionWeight} ${descriptionColor}`}>
                                                {cardMobileDesc}
                                            </p>
                                            <p className={`hidden md:block font-satoshi text-[clamp(12px,0.95vw,13px)] leading-[1.6] ${descriptionWeight} ${descriptionColor}`}>
                                                {formatDescription(card.description)}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className={`block md:hidden font-satoshi text-[12.5px] leading-[1.45] ${descriptionWeight} ${descriptionColor}`}>
                                                {card.description}
                                            </p>
                                            <p className={`hidden md:block font-satoshi text-[clamp(12px,0.95vw,13px)] leading-[1.6] ${descriptionWeight} ${descriptionColor}`}>
                                                {formatDescription(card.description)}
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