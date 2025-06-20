const features = [
  {
    title: "Conversational Learning",
    desc: "Chat naturally with your AI tutor to explore topics interactively.",
  },
  {
    title: "Tailored Curriculum",
    desc: "Lessons adapt to your pace, goals, and interests.",
  },
  {
    title: "Instant Progress Insights",
    desc: "Real-time feedback to boost understanding.",
  },
];

export default function FeaturesSection() {
  return (
    <div className="w-full max-w-6xl px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 text-center shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-indigo-300 mb-3">
              {feature.title}
            </h3>
            <p className="text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
