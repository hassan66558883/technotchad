import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Services from "@/components/home/Services";
import UpcomingFormations from "@/components/home/UpcomingFormations";
import Workshops from "@/components/home/Workshops";
import WhyUs from "@/components/home/WhyUs";
import Projects from "@/components/home/Projects";
import Technologies from "@/components/home/Technologies";
import About from "@/components/home/About";
import Testimonials from "@/components/home/Testimonials";
import News from "@/components/home/News";
import ContactCta from "@/components/home/ContactCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <UpcomingFormations />
      <Workshops />
      <WhyUs />
      <Projects />
      <Technologies />
      <About />
      <Testimonials />
      <News />
      <ContactCta />
    </>
  );
}
