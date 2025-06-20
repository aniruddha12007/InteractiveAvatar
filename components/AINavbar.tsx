import Link from 'next/link';

type AINavbarProps = {
  onGenerateMCQ: () => void;
  showGenerate?: boolean;
};

export default function AINavbar({ onGenerateMCQ, showGenerate = true }: AINavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black shadow-md z-50 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          AI Tutor
        </Link>
        {showGenerate && (
          <button 
            onClick={onGenerateMCQ}
            className="px-4 py-2 rounded-md bg-blue-600 text-white"
          >
            Generate MCQ
          </button>
        )}
      </div>
    </nav>
  );
}
