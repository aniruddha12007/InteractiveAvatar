"use client";

import Link from "next/link";
import AINavbar from "@/components/AINavbar";
import dynamic from "next/dynamic";
const Particles = dynamic(() => import("@/components/Particles"), { ssr: false });

export default function CustomizedCoursePage() {
  return (
    <>
      <AINavbar onGenerateMCQ={() => {}} showGenerate={false} />
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Particles particleColors={["#ffffff"]} particleCount={200} particleSpread={10} speed={0.1} particleBaseSize={100} moveParticlesOnHover alphaParticles={false} disableRotation={false} />
      </div>
    <main className="min-h-screen w-full flex flex-col items-center py-12 px-4 pt-28">
      <div className="w-full max-w-7xl flex flex-col items-center gap-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-center text-indigo-300">
          🏢 Structured AI-Powered Courses for Workforce Enablement
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-200 text-center">
          Train Your Teams on the Skills That Matter to Your Business
        </h2>
        <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-4xl text-center">
          Modern organizations need more than generic training—they need tailored upskilling programs that align with internal tools, workflows, and business goals. Our AI Tutor for Enterprises delivers structured, use-case-driven learning experiences designed specifically around your tech stack, processes, and internal challenges.
        </p>

        {/* Custom Learning Paths */}
        <section className="w-full bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-6 space-y-4">
          <h3 className="text-2xl font-bold text-indigo-400">🛠️ Custom Learning Paths for Your Tech Stack</h3>
          <p className="text-slate-300">We work with you to design learning journeys that reflect exactly what your teams use daily—whether it’s a specific cloud provider, internal APIs, domain-specific workflows, or third-party tools.</p>
          <ul className="list-none grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">🧱 Full-Stack Development with React + Next.js + Firebase (Company Standard Stack)</li>
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">🔍 Retrieval-Augmented Generation using LangChain + Pinecone + OpenAI (Internal AI Workflows)</li>
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">📦 Internal DevOps Pipeline Training with Docker + GitHub Actions + Kubernetes (Your CI/CD Tooling)</li>
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">📊 Data Analytics using Snowflake + dbt + Power BI (Company BI Stack)</li>
          </ul>
        </section>

        {/* Outcome Driven */}
        <section className="w-full bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-6 space-y-4">
          <h3 className="text-2xl font-bold text-indigo-400">📘 Use-Case Based. Outcome Driven.</h3>
          <p className="text-slate-300">Courses aren’t just “about a tool.” They’re built around how your company uses it. Each module centers around tasks your teams already face or will soon encounter: You define the outcomes—we design the curriculum, powered by our AI tutor.</p>
        </section>

        {/* Smart Tutor */}
        <section className="w-full bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-6 space-y-4">
          <h3 className="text-2xl font-bold text-indigo-400">🤖 Smart AI Tutor for Continuous, Self-Paced Learning</h3>
          <ul className="list-none grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">Answers company-specific questions (integrated with your documentation)</li>
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">Offers real-time feedback on hands-on tasks</li>
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">Tracks learner progress and skill gaps</li>
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">Adapts to different learning speeds and styles</li>
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">Ensures privacy and security per enterprise policy</li>
          </ul>
        </section>

        {/* Scale */}
        <section className="w-full bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-6 space-y-4">
          <h3 className="text-2xl font-bold text-indigo-400">📊 Training That Scales with You</h3>
          <p className="text-slate-300">Whether you're onboarding 50 developers on your backend stack or reskilling 200 analysts to transition to GenAI, our platform scales to match your needs with:</p>
          <ul className="list-none grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">Role-based learning paths</li>
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">Team-level progress dashboards</li>
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">Assessments and completion certifications</li>
            <li className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow hover:shadow-indigo-500/30 transition flex items-start gap-3">Integration with your LMS or HR platforms</li>
          </ul>
        </section>

        {/* Security */}
        <section className="w-full bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-6 space-y-4">
          <h3 className="text-2xl font-bold text-indigo-400">🛡️ Built for Enterprise Security & Compliance</h3>
          <p className="text-slate-300">We support single sign-on (SSO), private hosting, custom data governance policies, and audit-friendly logs—so your internal knowledge stays secure while your teams learn effectively.</p>
        </section>

        {/* Call to Action */}
        <section className="w-full space-y-4 text-center">
          <h3 className="text-2xl font-bold text-indigo-400">📞 Let’s Design Your Custom Learning Program</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <a href="#schedule-call" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">📩 Schedule a Discovery Call</a>
            <a href="#request-demo" className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">🔐 Request a Custom Demo</a>
          </div>
        </section>
        <Link
          href="/"
          className="mt-8 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
    </>
  );
}
