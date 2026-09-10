import { getLandingPage } from "@/lib/strapi";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StorefrontProblems from "@/components/StorefrontProblems";
import ConversionInsights from "@/components/ConversionInsights";
import WorkShowcase from "@/components/WorkShowcase";
import EngagementFit from "@/components/EngagementFit";
import OurWork from "@/components/OurWork";
import FinalCTA from "@/components/FinalCTA";
import OurProcess from "@/components/OurProcess";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import BlockRenderer from "@/components/BlockRenderer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getLandingPage();

  if (!data) {
    return (
      <main className="min-h-screen bg-[#37386B] text-white flex items-center justify-center font-sans">
        <p>Loading landing page content...</p>
      </main>
    );
  }

  // Extract quoteForm from dynamic Hero section or fallback hero
  const heroSection =
    (data.sections && Array.isArray(data.sections)
      ? data.sections.find((s: any) => s?.__component === "sections.hero" || s?.__component === "hero" || s?.__component === "Hero")
      : null) || data.hero;
  const quoteFormData = heroSection?.quoteForm;

  // Extract callbackForm from stickyCTA or dynamic sections
  const callbackFormData =
    (data.sections && Array.isArray(data.sections)
      ? data.sections.find((s: any) => s?.__component?.toLowerCase().includes("callback"))
      : null) || data.stickyCTA?.callbackForm || data.callbackForm;

  return (
    <main>
      <Header data={data.header} footerData={data.footer} />

      {/* Render Dynamic Zone sections (Collection Type) */}
      {data.sections && Array.isArray(data.sections) && data.sections.length > 0 ? (
        <BlockRenderer sections={data.sections} />
      ) : (
        /* Graceful fallback to legacy Single Type fields */
        <>
          {data.hero && <Hero data={data.hero} />}

          {data.storefrontProblems && (
            <StorefrontProblems data={data.storefrontProblems} />
          )}

          {data.conversionInsights && (
            <ConversionInsights data={data.conversionInsights} />
          )}

          {data.workShowcase && (
            <WorkShowcase data={data.workShowcase} />
          )}

          {data.engagementFit && (
            <EngagementFit data={data.engagementFit} />
          )}

          {data.ourWork && (
            <OurWork data={data.ourWork} />
          )}

          {data.finalCTA && (
            <FinalCTA data={data.finalCTA} />
          )}

          {data.ourProcess && (
            <OurProcess data={data.ourProcess} />
          )}

          {data.faq && (
            <FAQ data={data.faq} />
          )}
        </>
      )}

      {data.footer && (
        <Footer data={data.footer} />
      )}

      <StickyCTA
        data={data.stickyCTA}
        quoteForm={quoteFormData}
        callbackForm={callbackFormData}
      />
    </main>
  );
}