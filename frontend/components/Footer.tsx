import { getMediaUrl, SOCIAL_ICONS } from "@/lib/strapi";

type FooterContact = {
    id: number;
    location: string;
    phone: string;
    email: string;
    Address: string;
};

type Link = {
    id: number;
    label: string;
    href: string;
};

type SocialLink = {
    id: number;
    platform: string;
    href: string;
};

type FooterData = {
    logo?: {
        url: string;
    };
    sayHi: string;
    heading: string;
    description: string;
    contactHeading: string;
    quickLinksHeading: string;
    marqueeText: string;
    quickLinks: Link[];
    socialLinks: SocialLink[];
    contacts: FooterContact[];
    privacyLink: Link;
    termsLink: Link;
    Newsletter?: Link;
    newsletter?: Link;
};

export default function Footer({
    data,
}: {
    data: FooterData;
}) {
    const newsletterLabel =
        (typeof data?.Newsletter === "object" && data?.Newsletter?.label) ||
        (typeof data?.newsletter === "object" && data?.newsletter?.label) ||
        "Sign up to our newsletter";

    const newsletterHref =
        (typeof data?.Newsletter === "object" && data?.Newsletter?.href) ||
        (typeof data?.newsletter === "object" && data?.newsletter?.href) ||
        "#news";

    return (
        <section id="contact" data-theme="dark" className="w-full pt-16 pb-24 sm:pt-20 sm:pb-28 md:py-24 bg-[#3145DD] overflow-hidden">
            <div className="mx-auto w-full max-w-[1880px] px-6 lg:px-[60px] xl:px-[80px]">
                <div className="flex flex-col lg:flex-row lg:justify-between gap-24 sm:gap-28 lg:gap-10 xl:gap-16">
                    {/* Left Column: Brand info, Heading, Description, Social links */}
                    <div className="flex flex-col w-full lg:max-w-[480px] xl:max-w-[540px]">
                        {/* Top row: Say hi! + Logo */}
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <h1 className="font-delight text-[clamp(44px,4.2vw,80px)] font-medium leading-none text-white tracking-tight">
                                {data.sayHi || "Say hi!"}
                            </h1>

                            {data.logo && (
                                <img
                                    src={getMediaUrl(data.logo.url)}
                                    alt="Logo"
                                    className="h-[48px] w-[48px] sm:h-[64px] sm:w-[64px] animate-spin-pause shrink-0"
                                />
                            )}
                        </div>

                        {/* Text descriptions */}
                        <div className="mt-6 space-y-2 text-white font-satoshi text-[13.5px] sm:text-[12px] leading-[1.65] max-w-[550px]">
                            {data.heading && (
                                <p className="font-medium text-white/95">
                                    {data.heading}
                                </p>
                            )}
                            {data.description && (
                                <p className="font-normal text-white/90">
                                    {data.description}
                                </p>
                            )}
                        </div>

                        {/* Social icons */}
                        <div className="mt-14 sm:mt-16 flex items-center gap-5 sm:gap-6">
                            {data.socialLinks?.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:opacity-80 transition-opacity"
                                    aria-label={social.platform}
                                >
                                    <img
                                        src={SOCIAL_ICONS[social.platform]}
                                        alt={social.platform}
                                        className="h-6 w-6"
                                    />
                                </a>
                            ))}
                        </div>

                        {/* Desktop-only Privacy & Terms placement */}
                        <div className="hidden lg:flex items-center gap-8 mt-auto pt-14 text-[13px] font-satoshi text-white/90">
                            <a
                                href={data?.privacyLink?.href || "#"}
                                className="hover:underline underline-offset-4 transition-all"
                            >
                                {data?.privacyLink?.label || "Privacy Policies"}
                            </a>
                            <a
                                href={data?.termsLink?.href || "#"}
                                className="hover:underline underline-offset-4 transition-all"
                            >
                                {data?.termsLink?.label || "Terms and Conditions"}
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Quick links & Contact (2-column layout on mobile & desktop) */}
                    <div className="flex flex-col w-full lg:max-w-[620px] xl:max-w-[700px]">
                        <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-8">
                            {/* Quick Links (First on mobile, Second on big screen) */}
                            <div className="order-1 lg:order-2 lg:pl-6 xl:pl-10">
                                <h2 className="font-satoshi text-[15px] sm:text-[17px] lg:text-[18px] font-bold text-white tracking-tight mb-4 sm:mb-5 lg:mb-6">
                                    {data.quickLinksHeading || "Quick Links"}
                                </h2>

                                <div className="flex flex-col space-y-3 sm:space-y-3.5 lg:space-y-4">
                                    {data.quickLinks?.map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.href}
                                            className="font-satoshi text-[13px] sm:text-[14px] lg:text-[14.5px] font-medium text-white/90 hover:text-[#95E7D3] transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Contact (Second on mobile, First on big screen) */}
                            <div className="order-2 lg:order-1">
                                <h2 className="font-satoshi text-[15px] sm:text-[17px] lg:text-[18px] font-bold text-white tracking-tight mb-4 sm:mb-5 lg:mb-6">
                                    {data.contactHeading || "Contact"}
                                </h2>

                                <div className="flex flex-col space-y-4 sm:space-y-5 lg:space-y-6">
                                    {data.contacts?.map((contact) => (
                                        <div key={contact.id}>
                                            <p className="font-satoshi text-[13px] sm:text-[14px] lg:text-[15px] font-medium text-white">
                                                {contact.location}
                                            </p>

                                            <a
                                                href={`tel:${contact.phone}`}
                                                className="block mt-0.5 font-satoshi text-[13px] sm:text-[14px] lg:text-[15px] font-medium text-[#95E7D3] underline underline-offset-4 hover:opacity-90 transition-opacity"
                                            >
                                                {contact.phone}
                                            </a>

                                            {contact.Address && (
                                                <p className="hidden lg:block mt-4 max-w-[300px] font-satoshi text-[14px] font-medium leading-[1.4] text-white">
                                                    {contact.Address}
                                                </p>
                                            )}

                                            {contact.email && (
                                                <a
                                                    href={`mailto:${contact.email}`}
                                                    className="hidden lg:block mt-4 font-satoshi text-[14px] font-medium text-[#FFFFFF] hover:underline"
                                                >
                                                    {contact.email}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Newsletter CTA Button (Mobile only) */}
                        <div className="mt-14 sm:mt-12 w-full lg:hidden">
                            <a
                                href={newsletterHref}
                                className="group flex w-full items-center justify-between rounded-full bg-white px-6 sm:px-7 py-3.5 sm:py-4 text-[#1A1A1A] shadow-md transition-all hover:bg-white/95 active:scale-[0.99]"
                            >
                                <span className="font-satoshi text-[13.5px] sm:text-[14.5px] font-medium text-[#1A1A1A] tracking-tight">
                                    {newsletterLabel}
                                </span>
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3145DD] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                >
                                    <path
                                        d="M2 13L13 2M13 2H4M13 2V11"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                        </div>

                        {/* Mobile-only Privacy & Terms placement (below Newsletter button) */}
                        <div className="flex lg:hidden items-center gap-6 mt-6 text-[12px] font-satoshi text-white/90">
                            <a
                                href={data?.privacyLink?.href || "#"}
                                className="hover:underline underline-offset-4 transition-all"
                            >
                                {data?.privacyLink?.label || "Privacy Policies"}
                            </a>
                            <a
                                href={data?.termsLink?.href || "#"}
                                className="hover:underline underline-offset-4 transition-all"
                            >
                                {data?.termsLink?.label || "Terms and Conditions"}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Marquee CTA ticker at bottom */}
            <div className="mt-14 sm:mt-20 overflow-hidden">
                <div className="flex w-max animate-marquee">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="flex shrink-0 items-center gap-8 sm:gap-12 pr-8 sm:pr-12"
                        >
                            <span className="font-delight text-[clamp(44px,4.2vw,100px)] font-medium text-white">
                                {data.marqueeText}
                            </span>

                            <div className="group relative flex h-[90px] w-[90px] sm:h-[140px] sm:w-[140px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#7DE7D0]">
                                <div className="relative h-[36px] w-[36px] sm:h-[54px] sm:w-[54px]">
                                    {/* Arrow 1: flies out to top-right on hover */}
                                    <svg
                                        viewBox="0 0 54 54"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="arrow-slide-out"
                                    >
                                        <path
                                            d="M1.17157 47.1716C-0.390524 48.7337 -0.390524 51.2663 1.17157 52.8284C2.73367 54.3905 5.26633 54.3905 6.82843 52.8284L4 50L1.17157 47.1716ZM54 4C54 1.79086 52.2091 -1.32315e-06 50 -2.33467e-06L14 8.6849e-07C11.7909 -4.80209e-07 10 1.79086 10 4C10 6.20914 11.7909 8 14 8L46 8L46 40C46 42.2091 47.7909 44 50 44C52.2091 44 54 42.2091 54 40L54 4ZM4 50L6.82843 52.8284L52.8284 6.82843L50 4L47.1716 1.17157L1.17157 47.1716L4 50Z"
                                            fill="#3145DD"
                                        />
                                    </svg>

                                    {/* Arrow 2: flies in from bottom-left on hover */}
                                    <svg
                                        viewBox="0 0 54 54"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="arrow-slide-in"
                                    >
                                        <path
                                            d="M1.17157 47.1716C-0.390524 48.7337 -0.390524 51.2663 1.17157 52.8284C2.73367 54.3905 5.26633 54.3905 6.82843 52.8284L4 50L1.17157 47.1716ZM54 4C54 1.79086 52.2091 -1.32315e-06 50 -2.33467e-06L14 8.6849e-07C11.7909 -4.80209e-07 10 1.79086 10 4C10 6.20914 11.7909 8 14 8L46 8L46 40C46 42.2091 47.7909 44 50 44C52.2091 44 54 42.2091 54 40L54 4ZM4 50L6.82843 52.8284L52.8284 6.82843L50 4L47.1716 1.17157L1.17157 47.1716L4 50Z"
                                            fill="#3145DD"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
