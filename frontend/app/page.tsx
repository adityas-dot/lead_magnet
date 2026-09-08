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

  return (
    <main>
      <Header data={data.header} footerData={data.footer} />

      <Hero data={data.hero} />

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

      {data.footer && (
        <Footer data={data.footer} />
      )}
    </main>
  );
}