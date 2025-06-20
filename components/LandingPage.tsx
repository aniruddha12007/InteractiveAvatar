"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import dynamic from "next/dynamic";

const Player = dynamic(
  () =>
    import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);
import animationData from "../public/ai-avatar.json"; // Replace with your Lottie JSON file

interface LandingPageProps {
  onStartLearning: () => void;
}
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
const ScrollReveal = dynamic(() => import("./ScrollReveal"), { ssr: false });
import CtaSection from "./CtaSection";

export default function LandingPage({ onStartLearning }: LandingPageProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-16 md:gap-24 px-6 py-12 pt-28">
      <HeroSection />
      <FeaturesSection />
      <ScrollReveal enableBlur={true} baseOpacity={0} baseRotation={3} blurStrength={100}>
      <HowItWorksSection />
      </ScrollReveal>
      <CtaSection onStartLearning={onStartLearning} />
    </div>
  );
}
