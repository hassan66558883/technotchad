import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/dictionaries";
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
import OurSoftware from "@/components/home/OurSoftware";
import ContactCta from "@/components/home/ContactCta";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.meta.siteTitle, description: dict.meta.siteDescription };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <Stats />
      <Services lang={lang} dict={dict} />
      <UpcomingFormations lang={lang} dict={dict} />
      <Workshops lang={lang} dict={dict} />
      <WhyUs dict={dict} />
      <Projects lang={lang} dict={dict} />
      <Technologies dict={dict} />
      <About dict={dict} />
      <Testimonials dict={dict} />
      <OurSoftware lang={lang} dict={dict} />
      <ContactCta dict={dict.home.contact} />
    </>
  );
}
