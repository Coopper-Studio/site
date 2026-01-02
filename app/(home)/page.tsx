import { HeroSection } from "./components/hero-section";
import { WhatWeBuildSection } from "./components/what-we-build-section";
import { ProductsExperimentsSection } from "./components/products-experiments-section";
import { WhyCooperSection } from "./components/why-cooper-section";
import { Footer } from "./components/footer";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 px-4 py-8 md:py-16">
      <HeroSection />
      <WhatWeBuildSection />
      <ProductsExperimentsSection />
      <WhyCooperSection />
      <Footer />
    </div>
  );
}
