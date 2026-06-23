"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileUp,
  Loader2,
  Send,
  Sparkles
} from "lucide-react";
import { schools } from "@/config/schools";
import { sessionChecklists, sessions, type SessionNumber } from "@/config/checklists";
import { averageScore, initialScores, scoreLabels, validateFeedbackPayload } from "@/lib/submission";
import type { ChecklistResponse, FeedbackPayload, Scores } from "@/types/feedback";
import { ProgressSteps } from "@/components/ProgressSteps";

const steps = ["Tutor", "Team", "Session", "Checklist", "Scores", "Feedback", "Submit"];
const ischoolLogoUrl = "https://i.postimg.cc/Tw5kzBkT/655a7c231e772cae143dec27-i-School-Logo-colors.webp";

const inputBase = "field";
const labelBase = "label";
const stepThemes = [
  {
    name: "Blue",
    hero: "from-blue-50 via-white to-white",
    accent: "text-brand-primary",
    icon: "bg-brand-sky text-brand-primary ring-blue-100",
    bar: "bg-brand-primary",
    button: "bg-brand-primary hover:bg-brand-blueDark shadow-[0_18px_36px_rgba(5,111,236,0.24)]",
    panel: "border-blue-100 bg-brand-sky"
  },
  {
    name: "Orange",
    hero: "from-orange-50 via-white to-white",
    accent: "text-brand-orange",
    icon: "bg-brand-soft text-brand-orange ring-orange-100",
    bar: "bg-brand-orange",
    button: "bg-brand-orange hover:bg-brand-orangeDark shadow-brand",
    panel: "border-orange-100 bg-brand-soft"
  },
  {
    name: "Yellow",
    hero: "from-yellow-50 via-white to-white",
    accent: "text-brand-ink",
    icon: "bg-yellow-50 text-brand-ink ring-yellow-200",
    bar: "bg-brand-yellow",
    button: "bg-brand-ink hover:bg-brand-blueDark shadow-soft",
    panel: "border-yellow-200 bg-yellow-50"
  },
  {
    name: "Blue",
    hero: "from-blue-50 via-white to-white",
    accent: "text-brand-primary",
    icon: "bg-brand-sky text-brand-primary ring-blue-100",
    bar: "bg-brand-primary",
    button: "bg-brand-primary hover:bg-brand-blueDark shadow-[0_18px_36px_rgba(5,111,236,0.24)]",
    panel: "border-blue-100 bg-brand-sky"
  },
  {
    name: "Orange",
    hero: "from-orange-50 via-white to-white",
    accent: "text-brand-orange",
    icon: "bg-brand-soft text-brand-orange ring-orange-100",
    bar: "bg-brand-orange",
    button: "bg-brand-orange hover:bg-brand-orangeDark shadow-brand",
    panel: "border-orange-100 bg-brand-soft"
  },
  {
    name: "Blue",
    hero: "from-blue-50 via-white to-white",
    accent: "text-brand-primary",
    icon: "bg-brand-sky text-brand-primary ring-blue-100",
    bar: "bg-brand-primary",
    button: "bg-brand-primary hover:bg-brand-blueDark shadow-[0_18px_36px_rgba(5,111,236,0.24)]",
    panel: "border-blue-100 bg-brand-sky"
  },
  {
    name: "Yellow",
    hero: "from-yellow-50 via-white to-white",
    accent: "text-brand-ink",
    icon: "bg-yellow-50 text-brand-ink ring-yellow-200",
    bar: "bg-brand-yellow",
    button: "bg-brand-ink hover:bg-brand-blueDark shadow-soft",
    panel: "border-yellow-200 bg-yellow-50"
  }
];

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; submissionId: string }
  | { status: "error"; message: string };

const initialSession = sessions[0];

function buildChecklist(session: SessionNumber): ChecklistResponse[] {
  return sessionChecklists[session].map((item) => ({
    item,
    completed: "No",
    notes: ""
  }));
}

export function FeedbackWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [data, setData] = useState<FeedbackPayload>({
    tutorId: "",
    tutorName: "",
    school: schools[0] ?? "",
    groupId: "",
    teamName: "",
    membersCount: 1,
    sessionDate: new Date().toISOString().slice(0, 10),
    sessionNumber: initialSession,
    checklist: buildChecklist(initialSession),
    scores: initialScores,
    feedbackText: "",
    recommendation: "Good",
    additionalNotes: ""
  });

  const scoreAverage = useMemo(() => averageScore(data.scores), [data.scores]);
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);
  const theme = stepThemes[currentStep];

  function update<K extends keyof FeedbackPayload>(key: K, value: FeedbackPayload[K]) {
    setData((previous) => ({ ...previous, [key]: value }));
  }

  function updateScore(key: keyof Scores, value: number) {
    setData((previous) => ({
      ...previous,
      scores: { ...previous.scores, [key]: value }
    }));
  }

  function selectSession(sessionNumber: SessionNumber) {
    setData((previous) => ({
      ...previous,
      sessionNumber,
      checklist: buildChecklist(sessionNumber)
    }));
  }

  function canAdvance() {
    if (currentStep === 0) {
      return /^T-\d+$/.test(data.tutorId) && data.tutorName.trim() && data.school;
    }
    if (currentStep === 1) {
      return /^G-\d+$/.test(data.groupId) && data.teamName.trim() && data.membersCount > 0;
    }
    if (currentStep === 2) {
      return data.sessionDate && data.sessionNumber;
    }
    if (currentStep === 5) {
      return data.feedbackText.trim() || file;
    }
    return true;
  }

  function next() {
    if (!canAdvance()) {
      setSubmitState({ status: "error", message: "Please complete the required fields in this step." });
      return;
    }
    setSubmitState({ status: "idle" });
    setCurrentStep((value) => Math.min(value + 1, steps.length - 1));
  }

  function back() {
    setSubmitState({ status: "idle" });
    setCurrentStep((value) => Math.max(value - 1, 0));
  }

  async function submit() {
    const validationError = validateFeedbackPayload({
      ...data,
      feedbackText: data.feedbackText || (file ? "Uploaded feedback document" : "")
    });

    if (validationError) {
      setSubmitState({ status: "error", message: validationError });
      return;
    }

    setSubmitState({ status: "loading" });
    const formData = new FormData();
    formData.append("payload", JSON.stringify(data));
    if (file) {
      formData.append("file", file);
    }

    const response = await fetch("/api/submit", {
      method: "POST",
      body: formData
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      setSubmitState({ status: "error", message: result.error || "Submission failed." });
      return;
    }

    setSubmitState({ status: "success", submissionId: result.submissionId });
  }

  if (submitState.status === "success") {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-81px)] max-w-3xl place-items-center px-4 py-14">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface w-full p-8 text-center sm:p-12"
        >
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={42} />
          </div>
          <h1 className="text-3xl font-black text-brand-ink">Feedback Submitted Successfully</h1>
          <p className="mt-3 text-slate-600">Submission ID</p>
          <p className="mt-2 rounded-2xl bg-brand-sky px-5 py-4 font-mono text-lg font-bold text-brand-primary">
            {submitState.submissionId}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="primary-button mt-8"
          >
            Submit Another Feedback
          </button>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch">
        <div>
          <div
            className={[
              "surface flex min-h-[300px] items-center justify-center overflow-hidden p-8 bg-gradient-to-br",
              theme.hero
            ].join(" ")}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-[560px]"
            >
              <Image
                src={ischoolLogoUrl}
                alt="iSchool"
                width={620}
                height={190}
                className="h-auto w-full object-contain drop-shadow-[0_20px_35px_rgba(5,111,236,0.16)]"
                priority
              />
            </motion.div>
          </div>
        </div>
        <div className={["surface flex items-center p-6 bg-gradient-to-br", theme.hero].join(" ")}>
          <div className="w-full">
            <div className="mb-5">
              <p className={["text-sm font-black uppercase tracking-wide", theme.accent].join(" ")}>
                Session feedback
              </p>
              <p className="mt-1 text-xl font-black text-brand-ink">Step {currentStep + 1} of {steps.length}</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-slate-500">Form progress</span>
              <span className={["text-sm font-black", theme.accent].join(" ")}>{progressPercent}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={["h-full rounded-full transition-all duration-500", theme.bar].join(" ")}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ProgressSteps steps={steps} current={currentStep} />
        <div className="surface overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.section
              key={currentStep}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22 }}
              className="p-5 sm:p-8"
            >
              {currentStep === 0 && (
                <StepShell icon={<ClipboardList />} title="Tutor Information" theme={theme}>
                  <Field label="Tutor ID">
                    <input
                      className={inputBase}
                      required
                      placeholder="T-12345"
                      value={data.tutorId}
                      onChange={(event) => update("tutorId", event.target.value.toUpperCase())}
                      pattern="T-\d+"
                    />
                    <span className="mt-2 block text-xs font-semibold text-slate-500">
                      Use T- followed by numbers, for example T-1080.
                    </span>
                  </Field>
                  <Field label="Tutor Name">
                    <input
                      className={inputBase}
                      required
                      placeholder="Tutor full name"
                      value={data.tutorName}
                      onChange={(event) => update("tutorName", event.target.value)}
                    />
                  </Field>
                  <Field label="School">
                    <select
                      className={inputBase}
                      required
                      value={data.school}
                      onChange={(event) => update("school", event.target.value)}
                    >
                      {schools.map((school) => (
                        <option key={school}>{school}</option>
                      ))}
                    </select>
                  </Field>
                </StepShell>
              )}

              {currentStep === 1 && (
                <StepShell icon={<ClipboardList />} title="Team Information" theme={theme}>
                  <Field label="Group ID">
                    <input
                      className={inputBase}
                      required
                      placeholder="G-1234"
                      value={data.groupId}
                      onChange={(event) => update("groupId", event.target.value.toUpperCase())}
                      pattern="G-\d+"
                    />
                    <span className="mt-2 block text-xs font-semibold text-slate-500">
                      Use G- followed by numbers, for example G-1080.
                    </span>
                  </Field>
                  <Field label="Team Name">
                    <input
                      className={inputBase}
                      required
                      placeholder="Team name"
                      value={data.teamName}
                      onChange={(event) => update("teamName", event.target.value)}
                    />
                  </Field>
                  <Field label="Number of Team Members">
                    <input
                      className={inputBase}
                      required
                      min={1}
                      type="number"
                      value={data.membersCount}
                      onChange={(event) => update("membersCount", Number(event.target.value))}
                    />
                  </Field>
                </StepShell>
              )}

              {currentStep === 2 && (
                <StepShell icon={<CalendarDays />} title="Session Information" theme={theme}>
                  <Field label="Session Date">
                    <input
                      className={inputBase}
                      type="date"
                      required
                      value={data.sessionDate}
                      onChange={(event) => update("sessionDate", event.target.value)}
                    />
                  </Field>
                  <Field label="Session Number">
                    <select
                      className={inputBase}
                      value={data.sessionNumber}
                      onChange={(event) => selectSession(event.target.value as SessionNumber)}
                    >
                      {sessions.map((session) => (
                        <option key={session}>{session}</option>
                      ))}
                    </select>
                  </Field>
                  <div className={["rounded-3xl border p-5", theme.panel].join(" ")}>
                    <p className={["text-sm font-black", theme.accent].join(" ")}>Deliverables loaded</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {sessionChecklists[data.sessionNumber].join(", ")}
                    </p>
                  </div>
                </StepShell>
              )}

              {currentStep === 3 && (
                <StepShell icon={<ClipboardList />} title={`${data.sessionNumber} Checklist`} theme={theme}>
                  <div className="space-y-4">
                    {data.checklist.map((item, index) => (
                      <div key={item.item} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="font-black text-brand-ink">{item.item}</h3>
                          <div className="grid grid-cols-3 rounded-2xl bg-slate-50 p-1 shadow-sm ring-1 ring-slate-100">
                            {(["Yes", "Partially", "No"] as const).map((status) => (
                              <button
                                type="button"
                                key={status}
                                onClick={() =>
                                  setData((previous) => {
                                    const checklist = [...previous.checklist];
                                    checklist[index] = { ...checklist[index], completed: status };
                                    return { ...previous, checklist };
                                  })
                                }
                                className={[
                                  "rounded-xl px-3 py-2 text-xs font-black transition",
                                  item.completed === status
                                    ? "bg-brand-primary text-white shadow"
                                    : "text-slate-500 hover:text-brand-primary"
                                ].join(" ")}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          className="field mt-3 min-h-24"
                          placeholder="Optional notes"
                          value={item.notes}
                          onChange={(event) =>
                            setData((previous) => {
                              const checklist = [...previous.checklist];
                              checklist[index] = { ...checklist[index], notes: event.target.value };
                              return { ...previous, checklist };
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </StepShell>
              )}

              {currentStep === 4 && (
                <StepShell icon={<Sparkles />} title="Team Evaluation" theme={theme}>
                  <div className="rounded-3xl bg-brand-ink p-5 text-white shadow-soft">
                    <p className="text-sm font-bold text-blue-100">Live score summary</p>
                    <div className="mt-3 flex items-end gap-3">
                      <span className="text-5xl font-black">{scoreAverage.toFixed(1)}</span>
                      <span className="pb-2 text-sm font-semibold text-slate-300">/ 10 average</span>
                    </div>
                  </div>
                  <div className="space-y-5">
                    {scoreLabels.map((score) => (
                      <label key={score.key} className="block rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-bold text-slate-700">{score.label}</span>
                          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-sky font-black text-brand-primary">
                            {data.scores[score.key]}
                          </span>
                        </div>
                        <input
                          className="mt-4 h-2 w-full accent-brand-primary"
                          type="range"
                          min={1}
                          max={10}
                          value={data.scores[score.key]}
                          onChange={(event) => updateScore(score.key, Number(event.target.value))}
                        />
                      </label>
                    ))}
                  </div>
                </StepShell>
              )}

              {currentStep === 5 && (
                <StepShell icon={<FileUp />} title="Feedback" theme={theme}>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                      <p className="mb-3 text-sm font-black text-brand-primary">Option A</p>
                      <label className={labelBase}>Write feedback manually</label>
                      <textarea
                        className="field min-h-64"
                        placeholder="Write detailed feedback for the team..."
                        value={data.feedbackText}
                        onChange={(event) => update("feedbackText", event.target.value)}
                      />
                    </div>
                    <div className="rounded-3xl border border-dashed border-orange-200 bg-brand-soft p-4">
                      <p className="mb-3 text-sm font-black text-brand-orange">Option B</p>
                      <label className={labelBase}>Upload feedback document</label>
                      <input
                        className="field bg-white"
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                      />
                      {file && (
                        <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700">
                          Selected: {file.name}
                        </p>
                      )}
                    </div>
                  </div>
                </StepShell>
              )}

              {currentStep === 6 && (
                <StepShell icon={<Send />} title="Final Recommendation" theme={theme}>
                  <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-5">
                    <p className="text-sm font-black text-brand-ink">Ready for review</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      Nothing is submitted automatically on this step. Review the recommendation and
                      press the submit button when the feedback is ready to save.
                    </p>
                  </div>
                  <Field label="Recommendation">
                    <select
                      className={inputBase}
                      value={data.recommendation}
                      onChange={(event) =>
                        update("recommendation", event.target.value as FeedbackPayload["recommendation"])
                      }
                    >
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Needs Improvement</option>
                      <option>Critical Attention Needed</option>
                    </select>
                  </Field>
                  <Field label="Additional Notes">
                    <textarea
                      className="field min-h-40"
                      placeholder="Any final notes for admin review"
                      value={data.additionalNotes}
                      onChange={(event) => update("additionalNotes", event.target.value)}
                    />
                  </Field>
                </StepShell>
              )}
            </motion.section>
          </AnimatePresence>

          {submitState.status === "error" && (
          <div className="status-error mx-5 mb-5 sm:mx-8">
              {submitState.message}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <button
              type="button"
              onClick={back}
              disabled={currentStep === 0 || submitState.status === "loading"}
              className="secondary-button"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className={["primary-button", theme.button].join(" ")}
              >
                Continue
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitState.status === "loading"}
                className={["primary-button", theme.button].join(" ")}
              >
                {submitState.status === "loading" ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                Submit Feedback
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StepShell({
  icon,
  title,
  children,
  theme
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  theme: (typeof stepThemes)[number];
}) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className={["grid h-12 w-12 place-items-center rounded-2xl ring-1", theme.icon].join(" ")}>
          {icon}
        </span>
        <h2 className="text-2xl font-black text-brand-ink">{title}</h2>
      </div>
      <div className="grid gap-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelBase}>{label}</span>
      {children}
    </label>
  );
}
