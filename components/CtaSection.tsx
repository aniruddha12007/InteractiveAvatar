"use client";

import { Button } from "./Button";

interface CtaSectionProps {
  onStartLearning: () => void;
}

export default function CtaSection({ onStartLearning }: CtaSectionProps) {
  return (
    <div className="z-10 max-w-3xl w-full space-y-8 text-center py-16 px-6 bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl shadow-lg">
      <h2 className="text-3xl md:text-4xl font-bold">Ready to Begin?</h2>
      <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
        Click below to meet your AI tutor. Customize your avatar and start learning — your way.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        <Button
        onClick={onStartLearning}
        className="!bg-gradient-to-r !from-indigo-500 !to-purple-500 !text-white !text-xl md:!text-2xl !px-10 !py-4 !rounded-xl !shadow-xl hover:!shadow-indigo-500/40 hover:!scale-105 transition-transform duration-300"
      >
        Start Learning Now
      </Button>
        <a
        href="/customized-course"
        className="inline-block bg-slate-700 text-white font-semibold rounded-xl px-8 py-3 mt-4 hover:bg-slate-600 transition-colors duration-200 md:mt-0"
      >
          Customized Courses →
        </a>
      </div>
    </div>
  );
}
