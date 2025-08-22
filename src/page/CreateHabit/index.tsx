import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Sparkles, Trash2 } from "lucide-react";
import {useNavigate} from "react-router";

/**
 * Habit Prompt Page
 * ------------------------------------------------------------
 * - Focused on habit creation context
 * - Tailwind-only styling
 * - Clean card layout with textarea for describing the habit
 * - Cmd/Ctrl + Enter to submit
 * - Rough token/word/char counter
 * - Loading + error handling
 * - Persists last prompt to localStorage
 */

export default function HabitPromptPage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();
  // Load + persist prompt
  useEffect(() => {
    const saved = localStorage.getItem("habit_prompt_draft");
    if (saved) setPrompt(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("habit_prompt_draft", prompt);
  }, [prompt]);


  const clearAll = () => {
    setPrompt("");
    setError("");
    taRef.current?.focus();
  };

  const submit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 2000)); // simulate loading

    try {
      navigate("/habit")
    } catch (e: any) {
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">Habit Builder</span>
          </div>
          <div className="flex items-center gap-2" style={{cursor: "pointer"}} onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSfnD67OS4VvTMUhgh2Vux1oRa_5ytxNwOf2LG1zF2Vdzg66tw/viewform?usp=dialog", "_target")}>
            <span className="font-semibold">Leave your feedback</span>
          </div>
        </div>


      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm"
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
                Describe the habit you want to build
              </h1>
            </div>

            <div className="relative mb-3">
              <textarea
                ref={taRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="I want to improve my mental health. Suggest a 21-day plan with small daily steps, focused on reducing stress, improving mood, and building mindfulness. Please include short exercises like breathing, journaling, gratitude practice, or meditation. Keep each task under 15 minutes so I can stick to it."
                rows={8}
                className="w-full resize-y rounded-xl border border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-200 outline-none bg-white p-4 leading-relaxed text-sm sm:text-base shadow-inner"
              />

              <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearAll}
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 hover:bg-slate-50 transition text-slate-700"
                    disabled={isLoading && !prompt}
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear
                  </button>
                  <button
                    onClick={submit}
                    type="button"
                    disabled={isLoading || !prompt.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-white shadow hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isLoading ? "Sending..." : "Create Habit Plan"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
