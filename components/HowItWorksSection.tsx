"use client";

export default function HowItWorksSection() {
  const steps = [
    {
      title: "1. Pick Your Avatar & Goal",
      desc: "Choose an AI tutor persona and set your learning objective—anything from mastering React to onboarding on your internal data stack.",
    },
    {
      title: "2. Interactive Lessons",
      desc: "Learn through dialogue, code snippets, and quizzes. The AI adapts content depth and examples in real-time based on your responses.",
    },
    {
      title: "3. Measure & Iterate",
      desc: "Track progress with instant analytics. Receive personalized exercises or summary notes to close any knowledge gaps.",
    },
  ];

  return (
    <section className="w-full max-w-6xl px-4 py-16 flex flex-col items-center gap-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-300">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {steps.map((step) => (
          <div
            key={step.title}
            className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-6 text-center shadow hover:shadow-indigo-500/30 transition-all duration-300 flex flex-col gap-4"
          >
            <h3 className="text-xl font-semibold text-indigo-200">
              {step.title}
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
