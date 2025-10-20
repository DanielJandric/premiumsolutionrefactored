import { Hero } from "@/components/home/Hero";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { Features } from "@/components/home/Features";
import { Process } from "@/components/home/Process";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";
import { CertificationsMarquee } from "@/components/home/CertificationsMarquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CertificationsMarquee />
      <ServicesOverview />
      <Features />
      <Process />
      <Testimonials />
      <CTASection />
    </>
  );
}
