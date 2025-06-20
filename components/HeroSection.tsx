"use client";

import dynamic from "next/dynamic";
import animationData from "../public/ai-avatar.json";
const GradientText = dynamic(() => import("./GradientText"), { ssr: false });

const Player = dynamic(
  () =>
    import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export default function HeroSection() {
  return (
    <div className="z-10 max-w-7xl w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12 px-6">
      <div className="md:w-1/2 space-y-6 text-center md:text-left">
      <p className="text-3xl font-extrabold text-indigo-500 tracking-widest uppercase">
  AI Tutor
</p>
        <GradientText className="text-5xl md:text-6xl font-extrabold" colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]} animationSpeed={6}>
          Meet Your AI Tutor
        </GradientText>
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
          Your personalized learning assistant – guiding you through complex concepts, answering your questions, and helping you grow faster with real-time feedback and engaging lessons.
        </p>
      </div>
      <div className="md:w-1/2 flex justify-center">
        <Player
          autoplay
          loop
          src={animationData}
          style={{ height: "350px", width: "350px" }}
        />
      </div>
    </div>
  );
}
