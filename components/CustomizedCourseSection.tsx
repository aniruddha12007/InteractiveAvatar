"use client";

export default function CustomizedCourseSection() {
  return (
    <div className="w-full max-w-6xl px-4 py-16">
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-300 mb-6">
          Customized Courses
        </h2>
        <p className="text-slate-300 text-lg md:text-xl text-center leading-relaxed max-w-3xl mx-auto">
          Need a course tailored exactly to your objectives? Provide your own materials or describe your goals, and our AI generates a learning path crafted just for you.
        </p>
        <ul className="mt-8 space-y-4">
          <li className="flex items-start gap-3">
            <span className="text-indigo-400">✔</span>
            <span className="text-slate-300">Upload documents, slide decks or datasets.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-indigo-400">✔</span>
            <span className="text-slate-300">AI analyses content and your learning style.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-indigo-400">✔</span>
            <span className="text-slate-300">Receive a fully-fledged course with interactive sessions.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
