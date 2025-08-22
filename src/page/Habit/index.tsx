import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Flame, XCircle, Circle, CheckCircle, Clock, Camera, X } from "lucide-react";
import { useNavigate } from 'react-router';

/**
 * Habit Progress Page (21-Day Tracker)
 * ------------------------------------------------------------
 * - Top row: 21 circles (each day). Icons indicate status: done/missed/pending.
 * - Click a circle to view that day.
 * - Main card: current day's details per provided structure.
 * - Tailwind-only. No SCSS needed.
 */

// Types based on your structure
export type Difficulty = "easy" | "normal" | "hard";
export type DayStatus = "done" | "missed" | "pending";

export interface HabitDay {
  id: string; // UUID PK
  habit_id: string; // FK
  day_number: number; // >= 1 (unique per habit)
  title: string; // not null
  description: string; // not null
  duration: number; // >= 1 (second)
  motivation?: string | null;
  reflection_question?: string | null;
  difficulty: Difficulty; // default 'easy'
  status: DayStatus; // UI-only for this demo
  reflection_note?: string | null; // User's reflection when completed
  completion_photo?: string | null; // Base64 image when completed
}

// --- Demo data (replace with real data from API/DB) ---
const demoDays: HabitDay[] = [
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000001",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 1,
    "title": "Breathing reset",
    "description": "Practice 5 minutes of deep breathing. Inhale for 4, hold for 4, exhale for 6.",
    "duration": 600,
    "motivation": "Small calm moments add up to big change.",
    "reflection_question": "How do you feel after focusing only on your breath?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000002",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 2,
    "title": "Gratitude journaling",
    "description": "Write down 3 things you are grateful for today.",
    "duration": 600,
    "motivation": "Gratitude shifts focus from problems to blessings.",
    "reflection_question": "What surprised you most about today’s gratitude list?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000003",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 3,
    "title": "Mindful walk",
    "description": "Take a 10-minute walk. Focus on your steps, breathing, and surroundings.",
    "duration": 900,
    "motivation": "Nature and movement calm the mind.",
    "reflection_question": "What details did you notice outside that you usually miss?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000004",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 4,
    "title": "Body scan meditation",
    "description": "Spend 10 minutes noticing sensations from head to toes without judgment.",
    "duration": 600,
    "motivation": "Awareness creates relaxation.",
    "reflection_question": "Where did you feel the most tension in your body?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000005",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 5,
    "title": "Positive affirmations",
    "description": "Repeat 5 positive statements about yourself out loud or in writing.",
    "duration": 600,
    "motivation": "Your words shape your mindset.",
    "reflection_question": "Which affirmation felt the hardest to believe?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000006",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 6,
    "title": "Digital detox",
    "description": "Take a 15-minute break from screens. Sit quietly or stretch.",
    "duration": 900,
    "motivation": "Disconnection recharges your mind.",
    "reflection_question": "How did your body feel after a short tech pause?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000007",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 7,
    "title": "Gratitude letters",
    "description": "Write a short note to someone you appreciate (you don’t have to send it).",
    "duration": 900,
    "motivation": "Expressing gratitude deepens joy.",
    "reflection_question": "How did writing this letter affect your mood?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000008",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 8,
    "title": "Breathing box",
    "description": "Do 10 minutes of box breathing (inhale 4, hold 4, exhale 4, hold 4).",
    "duration": 600,
    "motivation": "Structured breathing brings stability.",
    "reflection_question": "How did your stress level change after the exercise?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000009",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 9,
    "title": "Mindful eating",
    "description": "Spend 10 minutes eating slowly. Notice flavors, textures, and smells.",
    "duration": 600,
    "motivation": "Mindful eating nourishes body and mind.",
    "reflection_question": "What did you notice about your food that you often ignore?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000010",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 10,
    "title": "Journaling for clarity",
    "description": "Write freely for 10 minutes about how you feel today.",
    "duration": 600,
    "motivation": "Writing clears mental clutter.",
    "reflection_question": "Did any new insight appear while writing?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000011",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 11,
    "title": "Gratitude snapshot",
    "description": "Take a photo of something simple that makes you happy.",
    "duration": 600,
    "motivation": "Little joys create big smiles.",
    "reflection_question": "Why did you choose this object or moment?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000012",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 12,
    "title": "Guided meditation",
    "description": "Listen to a 10-minute guided meditation for relaxation.",
    "duration": 600,
    "motivation": "Guidance makes meditation easier.",
    "reflection_question": "What part of your body felt most relaxed?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000013",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 13,
    "title": "Positive playlist",
    "description": "Listen to 2 uplifting songs mindfully, focusing on lyrics and rhythm.",
    "duration": 600,
    "motivation": "Music is therapy for the mind.",
    "reflection_question": "Which song lifted your mood the most?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000014",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 14,
    "title": "Kindness act",
    "description": "Do one small kind thing for someone without expecting return.",
    "duration": 900,
    "motivation": "Helping others helps you too.",
    "reflection_question": "How did the act of kindness make you feel?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000015",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 15,
    "title": "Evening reflection",
    "description": "Before sleep, write 2 things you did well today.",
    "duration": 600,
    "motivation": "Celebrate small wins daily.",
    "reflection_question": "What achievement made you proud today?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000016",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 16,
    "title": "Visualization",
    "description": "Spend 10 minutes imagining a calm place where you feel safe.",
    "duration": 600,
    "motivation": "Your mind creates your safe space.",
    "reflection_question": "What details made the visualization vivid?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000017",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 17,
    "title": "Breathing ladder",
    "description": "Each round increase exhale length by 1 count, repeat for 10 minutes.",
    "duration": 600,
    "motivation": "Longer exhales calm the nervous system.",
    "reflection_question": "Did you feel calmer as your breath slowed down?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000018",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 18,
    "title": "Journaling on emotions",
    "description": "Write for 10 minutes about one strong emotion you felt today.",
    "duration": 600,
    "motivation": "Naming emotions reduces their power.",
    "reflection_question": "How did writing change how you feel about that emotion?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000019",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 19,
    "title": "Stretch & breathe",
    "description": "Do gentle stretches for 5 minutes, combine with deep breaths.",
    "duration": 600,
    "motivation": "Movement + breath relieves stress.",
    "reflection_question": "Which stretch gave you the most relief?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000020",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 20,
    "title": "Gratitude expansion",
    "description": "List 5 people or experiences you’re grateful for, and why.",
    "duration": 900,
    "motivation": "Going deeper grows gratitude muscles.",
    "reflection_question": "Which gratitude item touched you most today?",
    "difficulty": "easy",
    "status": "pending"
  },
  {
    "id": "1a0d1e10-1111-4c1a-aaaa-000000000021",
    "habit_id": "99999999-aaaa-bbbb-cccc-111111111111",
    "day_number": 21,
    "title": "Celebration meditation",
    "description": "Spend 10 minutes reflecting on your 21-day journey. Breathe, smile, and celebrate your progress.",
    "duration": 600,
    "motivation": "Completion is proof you can change.",
    "reflection_question": "What is the biggest change you noticed in yourself in 21 days?",
    "difficulty": "easy",
    "status": "pending"
  }
]


export default function HabitProgressPage() {
  const [days, setDays] = useState<HabitDay[]>(demoDays);
  const [selected, setSelected] = useState<number>(1); // 1-based; current day is 5 in demo
  const [showModal, setShowModal] = useState<boolean>(false);
  const [reflectionText, setReflectionText] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const progress = useMemo(() => {
    const done = days.filter((d) => d.status === "done").length;
    const missed = days.filter((d) => d.status === "missed").length;
    return { done, missed, total: days.length };
  }, [days]);

  const current = days.find((d) => d.day_number === selected) || days[0];

  function setStatus(dayNumber: number, status: DayStatus) {
    setDays((prev) => prev.map((d) => (d.day_number === dayNumber ? { ...d, status } : d)));
  }

  function handleMarkDone() {
    setShowModal(true);
  }

  function handleModalSubmit() {
    let updated: HabitDay[] = [];
    setDays((prev) => {
      updated = prev.map((d) =>
        d.day_number === current.day_number
          ? { ...d, status: "done", reflection_note: reflectionText, completion_photo: uploadedImage }
          : d
      );
      return updated;
    });

    console.log("Updated day:", current.day_number);

   if(current.day_number === 21){
        navigate('/habit-complete');
        return;
    }else{
     setSelected(selected + 1)
   }

    setShowModal(false);
    setReflectionText("");
    setUploadedImage(null);
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function DifficultyBadge({ value }: { value: Difficulty }) {
    const map: Record<Difficulty, string> = {
      easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
      normal: "bg-amber-50 text-amber-700 border-amber-200",
      hard: "bg-rose-50 text-rose-700 border-rose-200",
    };
    const label = value.charAt(0).toUpperCase() + value.slice(1);
    return (
        <span className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${map[value]}`}>
        {label}
      </span>
    );
  }

  function StatusIcon({ status }: { status: DayStatus }) {
    if (status === "done") return <CheckCircle className="h-4 w-4" />;
    if (status === "missed") return <XCircle className="h-4 w-4" />;
    return <Circle className="h-4 w-4" />;
  }

  function StatusDot({ status }: { status: DayStatus }) {
    const colors: Record<DayStatus, string> = {
      done: "bg-emerald-500",
      missed: "bg-rose-500",
      pending: "bg-slate-300",
    };
    return <span className={`inline-block h-1.5 w-1.5 rounded-full ${colors[status]}`} />;
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
        <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
          <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Habit — 21-Day Tracker</span>
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-3">
              <span className="flex items-center gap-1"><StatusDot status="done" /> Done: {progress.done}</span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1"><StatusDot status="missed" /> Missed: {progress.missed}</span>
              <span className="hidden sm:inline">·</span>
              <span>Total: {progress.total}</span>


              <div className="flex items-center gap-2" style={{cursor: "pointer"}} onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSfnD67OS4VvTMUhgh2Vux1oRa_5ytxNwOf2LG1zF2Vdzg66tw/viewform?usp=dialog", "_target")}>
                <span className="font-semibold">Leave your feedback</span>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
          {/* 21 circles row */}
          <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm"
          >
            <div className="p-4 sm:p-6">
              <div className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Flame className="h-4 w-4" /> 21-Day Streak
              </div>

              <div className="relative overflow-x-auto">
                <div className="flex items-center gap-2 min-w-max py-2">
                  {days.map((d) => {
                    const isSelected = d.day_number === selected;
                    const hasDetails = d.status === "done" && (d.reflection_note || d.completion_photo);
                    const base =
                        d.status === "done"
                            ? "bg-emerald-600 text-white border-emerald-700"
                            : d.status === "missed"
                                ? "bg-rose-600 text-white border-rose-700"
                                : "bg-white text-slate-700 border-slate-300";
                    return (
                        <button
                            key={d.id}
                            onClick={function () { setSelected(d.day_number); }}
                            className={`group inline-flex items-center justify-center rounded-full border ${base} h-10 w-10 shrink-0 transition relative shadow-sm hover:shadow ${isSelected ? "ring-4 ring-slate-200" : ""}`}
                            title={`Day ${d.day_number} — ${d.status}`}
                        >
                          <span className="sr-only">Day {d.day_number}</span>
                          <StatusIcon status={d.status} />
                          {hasDetails && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 border border-white rounded-full flex items-center justify-center">
                              <Sparkles className="h-1.5 w-1.5 text-yellow-800" />
                            </div>
                          )}
                          <span className="absolute -bottom-5 text-[10px] text-slate-500">{d.day_number}</span>
                        </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Current day card */}
          <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Day {current.day_number}: {current.title}</h2>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                    <Clock className="h-3.5 w-3.5" /> {current.duration} min
                    <span className="hidden sm:inline">·</span>
                    <DifficultyBadge value={current.difficulty} />
                    <span className="hidden sm:inline">·</span>
                    <span className="flex items-center gap-1">Status: <StatusIcon status={current.status} /></span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                      onClick={handleMarkDone}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-white shadow hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4" /> Mark done
                  </button>
                  <button
                      onClick={function () { setStatus(current.day_number, "missed"); }}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-white shadow hover:bg-rose-700"
                  >
                    <XCircle className="h-4 w-4" /> Missed
                  </button>
                </div>
              </div>

              <div className="grid gap-4">


                  <div className="">
                    <div className="text-xs font-semibold text-slate-500 mb-1">Motivation</div>
                    <div className="text-sm text-slate-700">{current.motivation || "—"}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-700 leading-relaxed">{current.description}</div>
                  </div>

                  {/* Show reflection and photo for completed days */}
                  {current.status === "done" && (current.reflection_note || current.completion_photo) && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="text-xs font-semibold text-emerald-700 mb-3 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        {current?.reflection_question}
                      </div>

                      {current.reflection_note && (
                        <div className="mb-3">
                          <div className="text-xs font-medium text-emerald-600 mb-1">Reflection</div>
                          <div className="text-sm text-slate-700 bg-white rounded-lg p-3 border border-emerald-200">
                            {current.reflection_note}
                          </div>
                        </div>
                      )}

                      {current.completion_photo && (
                        <div>
                          <div className="text-xs font-medium text-emerald-600 mb-1">Photo</div>
                          <div className="bg-white rounded-lg border border-emerald-200 p-2">
                            <img
                              src={current.completion_photo}
                              alt="Completion photo"
                              className="w-full max-h-64 object-contain rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
            </div>
          </motion.section>
        </main>

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">You're Cool! 🎉</h3>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <p className="text-slate-600 mb-4">Great job completing your habit today!</p>
                  </div>

                  {/* Reflection Question */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {current.reflection_question || "How did it go today?"}
                    </label>
                    <textarea
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full p-3 border border-slate-300 rounded-lg resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload a photo (optional)
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-emerald-400 cursor-pointer transition-colors">
                        <div className="text-center">
                          <Camera className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                          <span className="text-sm text-slate-600">Click to upload</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>

                      {uploadedImage && (
                        <div className="relative bg-slate-50 rounded-lg p-2">
                          <img
                            src={uploadedImage}
                            alt="Uploaded"
                            className="w-full max-h-48 object-contain rounded-lg"
                          />
                          <button
                            onClick={() => setUploadedImage(null)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-slate-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleModalSubmit}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Complete Day
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
  );
}
