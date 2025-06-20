import React, { useState, useEffect } from "react";

interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

interface MCQSectionProps {
  conversationText: string;
  onTestComplete?: () => void;
  singleQuestionMode?: boolean;
}

const MCQSection: React.FC<MCQSectionProps> = ({ 
  conversationText, 
  onTestComplete,
  singleQuestionMode = false
}: MCQSectionProps) => {
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [selected, setSelected] = useState<(string | null)[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const fetchMCQs = async () => {
    setLoading(true);
    setError(null);
    setScore(null);
    setSubmitted(false);
    setSelected([]);
    try {
      const res = await fetch("/api/mcq-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch MCQs");
      setMcqs(data.mcqs);
      setSelected(Array(data.mcqs.length).fill(null));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIdx: number, option: string) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = [...prev];
      next[qIdx] = option;
      return next;
    });
  };

  const handleSubmit = () => {
    let sc = 0;
    mcqs.forEach((q, i) => {
      if (selected[i] === q.answer) sc++;
    });
    setScore(sc);
    setSubmitted(true);
    setShowThankYou(true);
  if (onTestComplete) onTestComplete();
  };

  const handleNext = () => {
    if (currentQuestionIndex < mcqs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  useEffect(() => {
    if (showThankYou && onTestComplete) {
      const timeout = setTimeout(() => {
        onTestComplete();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showThankYou, onTestComplete]);

  return (
    <div className="mt-6 w-full max-w-2xl mx-auto bg-zinc-900 rounded-xl p-6 shadow-lg border border-zinc-700">
      <h2 className="text-lg font-bold mb-4 text-white">Test Your Knowledge: MCQs</h2>
      {loading && <div className="text-zinc-300">Generating questions...</div>}
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {!loading && !mcqs.length && !showThankYou && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded mb-2"
          onClick={fetchMCQs}
        >
          Generate MCQs
        </button>
      )}
      {!loading && mcqs.length > 0 && !showThankYou && (
        <div>
          {singleQuestionMode ? (
            <div>
              <h3 className="text-lg font-medium mb-4">
                {mcqs[currentQuestionIndex].question}
              </h3>
              <div className="space-y-2">
                {mcqs[currentQuestionIndex].options.map((option, i) => (
                  <div key={i} className="flex items-center">
                    <input
                      type="radio"
                      id={`option-${i}`}
                      name="mcq"
                      value={option}
                      checked={selected[currentQuestionIndex] === option}
                      onChange={() => handleSelect(currentQuestionIndex, option)}
                      disabled={submitted}
                      className="accent-blue-500"
                    />
                    <label htmlFor={`option-${i}`} className="ml-2">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  className="bg-zinc-700 hover:bg-zinc-800 text-white font-semibold px-4 py-2 rounded"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="bg-zinc-700 hover:bg-zinc-800 text-white font-semibold px-4 py-2 rounded"
                  onClick={handleNext}
                  disabled={currentQuestionIndex === mcqs.length - 1}
                >
                  Next
                </button>
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
                  onClick={handleSubmit}
                  disabled={selected[currentQuestionIndex] === null}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="flex flex-col gap-6">
                {mcqs.map((q, i) => (
                  <div key={i} className="bg-zinc-800 rounded-lg p-4">
                    <div className="font-semibold text-white mb-2">{i + 1}. {q.question}</div>
                    <div className="flex flex-col gap-2">
                      {q.options.map((opt, j) => (
                        <label key={j} className={`flex items-center gap-2 cursor-pointer ${submitted && opt === q.answer ? 'text-green-400' : ''} ${submitted && selected[i] === opt && opt !== q.answer ? 'text-red-400' : ''}`}>
                          <input
                            type="radio"
                            name={`q${i}`}
                            value={opt}
                            checked={selected[i] === opt}
                            onChange={() => handleSelect(i, opt)}
                            disabled={submitted}
                            className="accent-blue-500"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    {submitted && (
                      <div className="mt-2 text-sm">
                        Correct answer: <span className="font-bold text-green-400">{q.answer}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-4">
                {!submitted && (
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
                    disabled={selected.some((s) => s === null)}
                  >
                    Submit
                  </button>
                )}
                <button
                  type="button"
                  className="bg-zinc-700 hover:bg-zinc-800 text-white font-semibold px-4 py-2 rounded"
                  onClick={fetchMCQs}
                >
                  Try Again
                </button>
              </div>
              {submitted && score !== null && (
                <div className="mt-4 text-lg font-bold text-blue-400">
                  Your Score: {score} / {mcqs.length}
                </div>
              )}
            </form>
          )}
        </div>
      )}
      {showThankYou && (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="text-2xl font-bold text-blue-400">Your Score: {score} / {mcqs.length}</div>
          <div className="text-xl text-green-400">Thank you for completing the test!</div>
          <div className="text-zinc-300 text-base">You will be redirected to the main page shortly...</div>
        </div>
      )}
    </div>
  );
};

export default MCQSection;