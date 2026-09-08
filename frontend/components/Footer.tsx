type CTA = {
    label: string;
    href: string;
};

type FooterContact = {
    id: number;
    location: string;
    phone: string;
    email: string;
    Address: string;
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



const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function Footer({
    data,
}: {
    data: FooterData;
}) {

    const socialIcons: Record<string, string> = {
        Instagram: "/images/insta_logo.svg",
        YouTube: "/images/youtube_logo.svg",
        Facebook: "/images/facebook.svg",
        LinkedIn: "/images/linkedin-icon.svg",
    };
    return (
        <section data-theme="dark" className="w-full py-20 bg-[#3145DD] overflow-hidden">
            <div className="mx-auto w-full max-w-[1880px] px-6 lg:px-[60px] xl:px-[80px]">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div className="col-span-2 flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="font-delight text-[clamp(45px,4.2vw,80px)] font-medium leading-none text-white">
                                {data.sayHi}
                            </h1>

                            {data.logo && (
                                <img
                                    src={
                                        data.logo.url.startsWith("/")
                                            ? `${STRAPI_URL}${data.logo.url}`
                                            : data.logo.url
                                    }
                                    alt="Logo"
                                    className="h-[64px] w-[64px] animate-spin-pause"
                                />
                            )}
                        </div>

                        <h2 className="mt-7 font-satoshi font-medium text-[15px] text-white">
                            {data.heading}
                        </h2>

                        <p className="mt-2 font-satoshi font-medium text-[15px] text-white">
                            {data.description}
                        </p>
                        <div className="mt-10 flex gap-6">
                            {data.socialLinks.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-satoshi text-white"
                                >
                                    <img
                                        src={socialIcons[social.platform]}
                                        alt={social.platform}
                                        className="h-6 w-6"
                                    />
                                </a>

                            ))}
                        </div>

                        <div className="mt-auto pt-16 flex items-center gap-10">
                            {data.privacyLink && (
                                <a
                                    href={data.privacyLink.href}
                                    className="font-satoshi text-[13px] font-bold text-white hover:underline underline-offset-4"
                                >
                                    {data.privacyLink.label}
                                </a>
                            )}

                            {data.termsLink && (
                                <a
                                    href={data.termsLink.href}
                                    className="font-satoshi text-[13px] font-bold text-white hover:underline underline-offset-4"
                                >
                                    {data.termsLink.label}
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="col-span-1">
                        <h2 className="font-satoshi text-[18px] font-bold text-white">
                            {data.contactHeading}
                        </h2>
                        <div className="mt-6 flex flex-col gap-6">
                            {data.contacts?.map((contact) => (
                                <div key={contact.id}>
                                    <p className="font-satoshi text-[15px] font-medium text-white">
                                        {contact.location}
                                    </p>

                                    <a
                                        href={`tel:${contact.phone}`}
                                        className="block font-satoshi text-[15px] font-medium text-[#95E7D3] underline underline-offset-4"
                                    >
                                        {contact.phone}
                                    </a>

                                    <p className="mt-4 max-w-[300px] font-satoshi text-[14px] font-medium leading-[1.4] text-white">
                                        {contact.Address}
                                    </p>

                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="mt-4 block font-satoshi text-[14px] font-medium text-[#FFFFFF]"
                                    >
                                        {contact.email}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 lg:pl-12">
                        <h2 className="font-satoshi font-bold text-white">
                            {data.quickLinksHeading}
                        </h2>

                        <div className="mt-6 flex flex-col gap-5">
                            {data.quickLinks?.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.href}
                                    className="font-satoshi text-[14px] font-medium text-white hover:text-[#95E7D3] transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <div className="mt-20 overflow-hidden">
                <div className="flex w-max animate-marquee">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="flex shrink-0 items-center gap-12 pr-12"
                        >
                            <span className="font-delight text-[clamp(50px,4.2vw,100px)] font-medium text-white">
                                {data.marqueeText}
                            </span>

                            <div className="group relative flex h-[140px] w-[140px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#7DE7D0]">
                                <div className="relative h-[54px] w-[54px]">
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
