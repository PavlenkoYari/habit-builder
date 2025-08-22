import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import {toPng} from "html-to-image";
import { Sparkles, Trophy, Flame, Clock, CheckCircle2, Quote, Camera, Share2, Download } from "lucide-react";

// Types
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

// Demo data (replace with your real array of 21 HabitDay entries)
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
;

function prettyMinutes(totalSeconds: number) {
  const m = Math.round(totalSeconds / 60);
  return `${m} min`;
}

// ---------------- Celebration Effects ----------------
function useCelebrationKey() {
  const [key, setKey] = useState(0);
  const replay = () => setKey((k) => k + 1);
  return { key, replay };
}

function ConfettiField({ playKey = 0 }: { playKey?: number }) {
  const pieces = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // vw%
      delay: Math.random() * 0.8,
      duration: 2.4 + Math.random() * 1.6,
      rotate: (Math.random() * 720 - 360) | 0,
      scale: 0.6 + Math.random() * 0.8,
      shape: ["square", "circle", "triangle"][Math.floor(Math.random() * 3)],
    }));
  }, [playKey]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={`${playKey}-${p.id}`}
          initial={{ y: -40, x: `${p.x}vw`, rotate: 0, opacity: 0 }}
          animate={{ y: "110vh", rotate: p.rotate, opacity: 1 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut", repeat: Infinity, repeatType: "loop" }}
          className="absolute"
          style={{
            width: 10 * p.scale,
            height: 10 * p.scale,
          }}
        >
          {p.shape === "square" && <div className="h-full w-full bg-emerald-500" />}
          {p.shape === "circle" && <div className="h-full w-full rounded-full bg-amber-400" />}
          {p.shape === "triangle" && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${5 * p.scale}px solid transparent`,
                borderRight: `${5 * p.scale}px solid transparent`,
                borderBottom: `${9 * p.scale}px solid rgb(244 63 94)`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function FireworkBursts({ playKey = 0 }: { playKey?: number }) {
  const centers = useMemo(() => [
    { top: "35%", left: "20%" },
    { top: "25%", left: "70%" },
    { top: "55%", left: "50%" },
  ], [playKey]);
  return (
    <div className="pointer-events-none absolute inset-0">
      {centers.map((c, idx) => (
        <motion.div
          key={`${playKey}-fw-${idx}`}
          className="absolute"
          style={{ top: c.top, left: c.left }}
          initial={{ scale: 0.1, opacity: 0.9 }}
          animate={{ scale: [0.1, 1.1, 1.4], opacity: [0.9, 0.7, 0] }}
          transition={{ duration: 1.4, delay: 0.2 * idx, ease: "easeOut", repeat: 1 }}
        >
          <div className="relative h-24 w-24">
            {[...Array(10)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 h-1 w-6 -translate-x-1/2 -translate-y-1/2 origin-left rounded-full bg-amber-400"
                style={{ rotate: `${(360 / 10) * i}` }}
                initial={{ scaleX: 0.1, opacity: 0.9 }}
                animate={{ scaleX: [0.1, 1, 0.6], opacity: [0.9, 1, 0] }}
                transition={{ duration: 1.4, delay: 0.2 * idx }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function FloatingEmojis({ playKey = 0 }: { playKey?: number }) {
  const items = useMemo(() => ["🎉", "✨", "🏆", "🔥", "💪", "🌟"].map((e, i) => ({ e, i, x: 10 + i * 15 })), [playKey]);
  return (
    <div className="pointer-events-none absolute inset-0">
      {items.map((it) => (
        <motion.div
          key={`${playKey}-emo-${it.i}`}
          className="absolute text-3xl"
          initial={{ y: "100%", x: `${it.x}%`, opacity: 0 }}
          animate={{ y: ["85%", "40%", "15%"], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, delay: 0.1 * it.i, ease: "easeOut" }}
        >
          {it.e}
        </motion.div>
      ))}
    </div>
  );
}

// ---------------- Certificate PDF ----------------
function mm(val: number) {
  // helper for mm to pt conversion if needed later; jsPDF uses pt by default for 'pt' units.
  return val;
}

function downloadCertificate(days: HabitDay[]) {
  try {
    const docElement = document.getElementById('doc');
    const hideElement = docElement?.querySelector('#hide-to-png') as HTMLElement;

    if (hideElement) {
      hideElement.style.display = 'none';
    }

    toPng(docElement as HTMLElement)
    .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'habit-certificate.png';
        link.href = dataUrl;
        link.click();

        // Restore visibility
        if (hideElement) {
          hideElement.style.display = 'flex';
        }
    })
    .catch((err) => {
        console.error('Failed to generate certificate:', err);
        // Restore visibility even on error
        if (hideElement) {
          hideElement.style.display = 'flex';
        }
    });

  } catch (e) {
    console.error('Certificate generation failed:', e);
  }
}

// ---------------- Page ----------------
export default function YouDidItPage({ days = demoDays }: { days?: HabitDay[] }) {
  const { key: playKey, replay } = useCelebrationKey();
  const [showShareModal, setShowShareModal] = useState(false);

  const stats = useMemo(() => {
    const totalDays = days.length;
    const done = days.filter((d) => d.status === "done").length;
    const totalSeconds = days.reduce((acc, d) => acc + (d.duration || 0), 0);
    const avgSeconds = totalSeconds / Math.max(done, 1);
    const diffCount = days.reduce(
      (acc, d) => ({ ...acc, [d.difficulty]: (acc as any)[d.difficulty] + 1 }),
      { easy: 0, normal: 0, hard: 0 } as Record<Difficulty, number>
    );
    const reflections = days.filter((d) => !!d.reflection_note).length;
    const photos = days.filter((d) => !!d.completion_photo).length;
    return {
      totalDays,
      done,
      completionRate: Math.round((done / Math.max(totalDays, 1)) * 100),
      totalSeconds,
      avgSeconds,
      diffCount,
      reflections,
      photos,
    };
  }, [days]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Celebration layers (absolute) */}
      <ConfettiField playKey={playKey} />
      <FireworkBursts playKey={playKey} />
      <FloatingEmojis playKey={playKey} />

      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">You Did It!</span>
          </div>
          <div className="flex items-center gap-2" style={{cursor: "pointer"}} onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSfnD67OS4VvTMUhgh2Vux1oRa_5ytxNwOf2LG1zF2Vdzg66tw/viewform?usp=dialog", "_target")}>
            <span className="font-semibold">Leave your feedback</span>
          </div>
        </div>
      </header>

      <main className="relative z-0 mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Celebration Hero */}
        <motion.section
            id='doc'
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm"
        >
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emerald-200/30 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-200/30 blur-2xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <motion.div initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 140 }}>
                <Trophy className="h-12 w-12 text-amber-500" />
              </motion.div>
              <div>
                <motion.h1
                  initial={{ letterSpacing: "0.02em" }}
                  animate={{ letterSpacing: ["0.02em", "0.08em", "0.02em"] }}
                  transition={{ duration: 1.2 }}
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                >
                  You Did It! 21 Days Done 🎉
                </motion.h1>
                <motion.p className="mt-1 text-slate-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  Consistency beats intensity — and you just proved it. Take a breath and admire the work you put in.
                </motion.p>
              </div>
            </div>

            {/* Compact Stats */}
            <motion.div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Completed" value={`21/${stats.totalDays}`} />
              <StatCard icon={<Clock className="h-4 w-4" />} label="Total Time" value={prettyMinutes(stats.totalSeconds)} />
              <StatCard icon={<Flame className="h-4 w-4" />} label="Streak" value={`21 days`} />
              <StatCard icon={<Trophy className="h-4 w-4" />} label="Completion" value={`100%`} />
            </motion.div>

            {/* Difficulty pills & extras */}
            <motion.div className="mt-4 flex flex-wrap items-center gap-2 text-sm" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <DiffPill color="emerald" label="Easy" count={stats.diffCount.easy} />
              <DiffPill color="amber" label="Normal" count={stats.diffCount.normal} />
              <DiffPill color="rose" label="Hard" count={stats.diffCount.hard} />
              <span className="text-slate-400">·</span>
              <span className="inline-flex items-center gap-1 text-slate-600"><Quote className="h-4 w-4" /> Reflections: 12</span>
              <span className="text-slate-400">·</span>
              <span className="inline-flex items-center gap-1 text-slate-600"><Camera className="h-4 w-4" /> Photos: 4</span>
            </motion.div>

            {/* CTA Row */}
            <motion.div className="mt-6 flex flex-wrap gap-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} id='hide-to-png'>
              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-700"
              >
                <Share2 className="h-4 w-4" /> Share
              </button>
              <button
                onClick={() => downloadCertificate(days)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 hover:bg-slate-50"
              >
                <Download className="h-4 w-4" /> Download certificate
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* Short Praise Block */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="p-5 sm:p-6">
            <p className="text-lg font-semibold">This wasn’t luck — it was showing up.</p>
            <p className="mt-1 text-slate-600">You just completed a full habit arc. Keep the momentum: either lock this in as a lifestyle or start a new 21‑day challenge.</p>
          </div>
        </motion.section>
      </main>


      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                <Share2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Share Your Achievement</h3>
              <p className="text-slate-600 mb-6">
                Sorry, but this is a demo! In production, you could share your amazing 21-day habit completion stats on social media and inspire others to start their own journey.
                <br /><br />
                Right now you can download your stats and post them on your social media to celebrate your success! 🎉
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Got it
                </button>
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    downloadCertificate(days);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Download instead
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div
      className="rounded-2xl border border-slate-200 bg-white p-3"
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 12 }}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-slate-500">{icon}</div>
      </div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </motion.div>
  );
}

function DiffPill({ color, label, count }: { color: "emerald" | "amber" | "rose"; label: string; count: number }) {
  const map: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${map[color]}`}>
      {label}: {count}
    </span>
  );
}
