import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  PartyPopper,
  PencilLine,
  CalendarCheck2,
  Trophy,
  CheckCircle2,
  Brain,
  LineChart,
  Rocket,
  BookOpenText,
  Dumbbell,
  HeartPulse, Trash2, Loader2, Send,
} from "lucide-react";
import {useNavigate} from "react-router";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: 0.08 * i, duration: 0.6 } }),
};

const Section = ({ id, className = "", children }: any) => (
  <section id={id} className={`relative py-16 sm:py-24 ${className}`}>
    {children}
  </section>
);

const Container = ({ children, className = "" }: any) => (
  <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

// ------ Animated Orbit (static circle + moving green dot + captions) ------
function Orbit() {
  return (
    <div className="relative h-[360px] w-[360px] sm:h-[420px] sm:w-[420px]">
      {/* Outer static circle */}
      <div className="absolute inset-0 rounded-full border-2 border-slate-200" />

      {/* Moving dot around the circle */}
      <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
        <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.15)]" />
      </div>

      {/* Three captions anchored around the orbit */}
      <Caption label="Create Habit" left={'50%'} top={"1%"} />
      <Caption label="Make it Daily" left={'9%'} top={"81%"} />
      <Caption label="Celebrate" left={"90%"} top={"81%"} />

      {/* Subtle pulsing core */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-emerald-500/10 blur-md" />
          <div className="absolute inset-0 grid place-items-center">
            <Sparkles className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Caption({ label, left, top }: any) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: left, top: top }}
    >
      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 backdrop-blur">
        {label}
      </div>
    </div>
  );
}

// ------ Hero ------
function Hero() {
  const navigate = useNavigate();
  return (
    <Section className="overflow-hidden bg-gradient-to-b from-emerald-50 to-white">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            AI-powered habit builder
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Create a new habit in <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">21 days</span>
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-slate-600">
            Describe your goal → get a personalized 21-day plan → complete daily steps → celebrate your win with a beautiful certificate.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div
                style={{cursor: 'pointer'}}
              onClick={() => navigate('/habit-create')}
              className="group inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:translate-y-[-1px] hover:bg-emerald-500"
            >
              Try it now
              <Rocket className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
            </div>
          </div>
          {/* trust row */}
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Personalized plans</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Daily guidance</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Progress tracking</div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
          aria-hidden
        >
          <div className="pointer-events-none absolute -inset-20 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_60%)]" />
          <Orbit />
        </motion.div>
      </Container>
    </Section>
  );
}

// ------ How it works ------
function Steps() {
  const items = [
    { icon: PencilLine, title: "Describe your goal", text: "Tell the AI what habit you want. Be specific or start simple — both work." },
    { icon: CalendarCheck2, title: "Get a 21‑day plan", text: "Clear, daily steps tailored to your lifestyle and skill level." },
    { icon: PartyPopper, title: "Do & celebrate", text: "Track progress, stay motivated, and earn a shareable certificate." },
  ];
  return (
    <Section id="how" className="bg-slate-50">
      <Container>
        <motion.h2
          className="text-2xl font-semibold text-slate-900"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeUp}
        >
          How it works
        </motion.h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group rounded-2xl border border-slate-200 bg-white p-6 backdrop-blur transition hover:border-emerald-300"
            >
              <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <it.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{it.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{it.text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// ------ Why 21 days? ------
function Why21() {
  return (
    <Section id="why">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-semibold text-slate-900">Why 21 days?</h2>
          <p className="mt-4 text-slate-600">
            Short, focused challenges are easier to finish. Twenty‑one days is long enough to build momentum, but short enough to feel achievable. Our AI keeps the steps small, consistent, and rewarding.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />Small daily actions compound into lasting change.</li>
            <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />Adaptive difficulty keeps you in the "easy but meaningful" zone.</li>
            <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />Rewards and visual progress sustain motivation.</li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Days 1–7", text: "Setup & friction removal" },
              { label: "Days 8–14", text: "Consistency & confidence" },
              { label: "Days 15–21", text: "Lock‑in & celebration" },
            ].map((b) => (
              <div key={b.label} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-emerald-600">{b.label}</div>
                <div className="mt-1 text-xs text-slate-500">{b.text}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

// ------ Features ------
function Features() {
  const list = [
    { icon: Brain, title: "Personalized by AI", text: "Your plan adapts to your goal, time, and experience." },
    { icon: LineChart, title: "Daily guidance", text: "Clear steps, reminders, and progress visualization." },
    { icon: Trophy, title: "Rewarding finish", text: "A celebratory page and a shareable certificate." },
    { icon: HeartPulse, title: "Sustainable pace", text: "Small wins that fit real life, not burnout." },
  ];
  return (
    <Section id="features" className="bg-slate-50">
      <Container>
        <motion.h2 className="text-2xl font-semibold text-slate-900" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          What makes it work
        </motion.h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600"><f.icon className="h-6 w-6" /></div>
              <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// ------ Demo plans ------
function Demos() {
  const demos = [
    {
      icon: BookOpenText,
      title: "21 Days of English",
      desc: "10–15 minutes/day with micro‑tasks and spaced repetition.",
      bullets: ["Day 1: 15 words + 1 short dialog", "Day 7: Mini listening test", "Day 21: Record a 60s self‑intro"],
    },
    {
      icon: Dumbbell,
      title: "21 Days of Fitness",
      desc: "No‑equipment routine that scales with your level.",
      bullets: ["Day 1: 8‑minute mobility", "Day 10: 12‑minute circuit", "Day 21: Full‑body flow"],
    },
    {
      icon: Brain,
      title: "21 Days of Meditation",
      desc: "Start at 3 minutes and build up gradually.",
      bullets: ["Day 1: 3‑minute breath focus", "Day 14: 8‑minute body scan", "Day 21: 10‑minute gratitude sit"],
    },
  ];
  return (
    <Section id="demos">
      <Container>
        <motion.h2 className="text-2xl font-semibold text-slate-900" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          Demo plans
        </motion.h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demos.map((d, i) => (
            <motion.div
              key={d.title}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-emerald-300"
            >
              <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600"><d.icon className="h-6 w-6" /></div>
              <h3 className="text-lg font-semibold text-slate-900">{d.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{d.desc}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {d.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />{b}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// ------ Data-driven market block ------
function Market() {
  const stats = [
    { kpi: "92%", label: "don't keep New Year's resolutions" },
    { kpi: "21 days", label: "avg time to form a habit (many quit earlier)" },
    { kpi: "70%", label: "have tried & stopped building a habit" },
    { kpi: "60%", label: "Motivation drops after the first 7 days" },
    { kpi: "1.000.000+", label: "join 21-day challenges on TikTok and Instagram" },
  ];
  return (
    <Section id="market" className="bg-slate-50">
      <Container>
        <motion.h2 className="text-2xl font-semibold text-slate-900" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          The problem (in numbers)
        </motion.h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          People want change but struggle with consistency. Short, guided plans increase completion rates. These reference figures are widely reported across research and industry analyses.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center"
            >
              <div className="text-3xl font-bold text-slate-900">{s.kpi}</div>
              <div className="mt-1 text-xs text-slate-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// ------ CTA ------
function CTA() {
  const navigate = useNavigate()

  return (
    <Section id="cta" className="overflow-hidden">
      <Container className="relative isolate">
        <div className="pointer-events-none absolute -inset-x-20 -top-20 -z-10 h-64 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
              Create your first habit right now!
            </h1>
          </div>

          <div className="relative mb-3">
              <textarea
                  placeholder="I want to improve my mental health. Suggest a 21-day plan with small daily steps, focused on reducing stress, improving mood, and building mindfulness. Please include short exercises like breathing, journaling, gratitude practice, or meditation. Keep each task under 15 minutes so I can stick to it."
                  rows={8}
                  className="w-full resize-y rounded-xl border border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-200 outline-none bg-white p-4 leading-relaxed text-sm sm:text-base shadow-inner"
              />

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
              </div>
              <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => navigate('/habit')}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-white shadow hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Habit Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// ------ Feedback ------
function Feedback() {
  return (
    <Section className="bg-slate-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Help us improve!</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Your feedback helps us create better habit-building experiences. Share your thoughts, suggestions, or report any issues you encounter.
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfnD67OS4VvTMUhgh2Vux1oRa_5ytxNwOf2LG1zF2Vdzg66tw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:bg-slate-800"
          >
            <Send className="mr-2 h-4 w-4" />
            Leave Your Feedback
          </a>
        </motion.div>
      </Container>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="relative mt-10 border-t border-slate-200 py-10 text-sm text-slate-500">
      <Container className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="text-slate-900">21 Days Habit Creator</div>
          <div className="text-xs text-slate-400">Make change simple. One day at a time.</div>
        </div>
        <div className="flex gap-6">
          <a href="#how" className="hover:text-slate-700">How it works</a>
          <a href="#market" className="hover:text-slate-700">Numbers</a>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSfnD67OS4VvTMUhgh2Vux1oRa_5ytxNwOf2LG1zF2Vdzg66tw/viewform?usp=dialog" target={"_blank"} className="hover:text-slate-700">Leave your feedback</a>
        </div>
      </Container>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-svh bg-white text-slate-900">
      {/* Decorative background grid */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <Hero />
      <Steps />
      <Why21 />
      <Features />
      <Demos />
      <Market />
      <CTA />
      <Feedback />
      <Footer />
    </main>
  );
}
