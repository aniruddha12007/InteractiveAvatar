import "@/styles/globals.css";
import { Metadata } from "next";
import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";



const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "AI Tutor",
    template: `%s - AI Tutor`,
  },
  icons: {
    icon: "/aitutor.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} font-sans`}
      lang="en"
    >
      <head />
      <body className="min-h-screen bg-[#0f0f1a] text-slate-200 font-sans">
        {/* Aesthetic Indigo-Purple Background Glow */}
        <div className="pointer-events-none fixed inset-0 z-0">
          {/* Top left soft glow */}
          <div className="absolute -top-[20vh] -left-[20vw] w-[60vw] h-[60vh] bg-purple-500/20 rounded-full blur-[100px]" />
          
          {/* Bottom right soft glow */}
          <div className="absolute -bottom-[20vh] -right-[20vw] w-[60vw] h-[60vh] bg-indigo-500/20 rounded-full blur-[100px]" />
          
          {/* Center radial blur */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-blue-500/10 rounded-full blur-[80px]" />
          
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f0f1a]/80" />
        </div>

        <main className="relative flex flex-col min-h-screen w-screen z-10">
          
          {children}
        </main>
      </body>
    </html>
  );
}
