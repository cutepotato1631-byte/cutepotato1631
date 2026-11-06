import React from "react";
import Hero from "@/components/site/Hero";
import TrustStrip from "@/components/site/TrustStrip";
import MenuSection from "@/components/site/MenuSection";
import HowItWorks from "@/components/site/HowItWorks";
import StorySection from "@/components/site/StorySection";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <MenuSection />
      <HowItWorks />
      <StorySection />
    </>
  );
}