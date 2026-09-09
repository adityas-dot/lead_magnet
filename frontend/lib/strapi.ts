/** Base URL for Strapi CMS API */
const RAW_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://lead-magnet-strapi.onrender.com";
export const STRAPI_URL = RAW_STRAPI_URL.replace(/\/+$/, "");

/** Centralized SVG icon paths for social media platforms */
export const SOCIAL_ICONS: Record<string, string> = {
    Instagram: "/images/insta_logo.svg",
    YouTube: "/images/youtube_logo.svg",
    Facebook: "/images/facebook.svg",
    LinkedIn: "/images/linkedin-icon.svg",
};

/**
 * Normalizes media input (string, object, or array) into a fully qualified Cloudinary or Strapi URL.
 */
export function getMediaUrl(
    media?: string | { url?: string | null } | Array<{ url?: string | null }> | null
): string {
    if (!media) return "";
    let rawUrl: string | undefined | null;

    if (typeof media === "string") {
        rawUrl = media;
    } else if (Array.isArray(media)) {
        rawUrl = media[0]?.url;
    } else {
        rawUrl = media?.url;
    }

    if (!rawUrl) return "";
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
        return rawUrl;
    }
    return `${STRAPI_URL}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
}

/**
 * Fetches landing page content with all populated relation blocks.
 */
export async function getLandingPage() {
    try {
        const response = await fetch(
            `${STRAPI_URL}/api/landing-page?populate[header][populate][quickLinks]=true&populate[hero][populate][primaryCta]=true&populate[hero][populate][brands][populate][logo]=true&populate[hero][populate][quoteForm][populate]=*&populate[storefrontProblems][populate][items]=true&populate[conversionInsights][populate][cards][populate][image]=true&populate[engagementFit][populate][suitablePoints]=true&populate[engagementFit][populate][notSuitablePoints]=true&populate[workShowcase][populate][items][populate][beforeImage]=true&populate[workShowcase][populate][items][populate][afterImage]=true&populate[workShowcase][populate][items][populate][mobileBeforeImage]=true&populate[workShowcase][populate][items][populate][mobileAfterImage]=true&populate[ourWork][populate][projects][populate][images]=true&populate[ourWork][populate][projects][populate][mobileImages]=true&populate[finalCTA][populate][logos][populate][logo]=true&populate[finalCTA][populate][primaryCta]=true&populate[finalCTA][populate][secondaryCta]=true&populate[ourProcess][populate][marqueeItems]=true&populate[ourProcess][populate][cta]=true&populate[ourProcess][populate][cards][populate][icon]=true&populate[ourProcess][populate][cards][populate][services]=true&populate[ourProcess][populate][cards][populate][cta]=true&populate[ourProcess][populate][video]=true&populate[ourProcess][populate][image]=true&populate[ourProcess][populate][service][populate][icon]=true&populate[ourProcess][populate][mobilePrimaryCta]=true&populate[ourProcess][populate][mobileSecondaryCta]=true&populate[faq][populate][items]=true&populate[faq][populate][mobileItems]=true&populate[footer][populate][logo]=true&populate[footer][populate][quickLinks]=true&populate[footer][populate][socialLinks]=true&populate[footer][populate][contacts]=true&populate[footer][populate][privacyLink]=true&populate[footer][populate][termsLink]=true&populate[footer][populate][Newsletter]=true&populate[stickyCTA][populate]=*`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to fetch landing page:", response.status, response.statusText, errorText);
            return null;
        }

        const json = await response.json();
        return json.data;
    } catch (err: unknown) {
        if (err && typeof err === "object" && "digest" in err && (err as { digest: string }).digest === "DYNAMIC_SERVER_USAGE") {
            throw err;
        }
        console.error("Error fetching landing page:", err);
        return null;
    }
}