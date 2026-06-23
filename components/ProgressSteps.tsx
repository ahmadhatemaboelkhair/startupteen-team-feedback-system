"use client";

import { Check } from "lucide-react";

type Props = {
  steps: string[];
  current: number;
};

export function ProgressSteps({ steps, current }: Props) {
  return (
    <div className="surface p-3 sm:p-4">
      <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-1 lg:overflow-visible lg:pb-0">
        {steps.map((step, index) => {
          const active = index === current;
          const complete = index < current;

          return (
            <div
              key={step}
              className={[
                "flex min-w-[104px] items-center gap-2 rounded-2xl p-2 transition lg:min-w-0",
                active ? "bg-brand-sky ring-1 ring-blue-100" : "hover:bg-slate-50"
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black transition",
                  complete
                    ? "bg-emerald-500 text-white shadow-sm"
                    : active
                      ? "bg-brand-primary text-white shadow-brand"
                      : "bg-slate-100 text-slate-500"
                ].join(" ")}
              >
                {complete ? <Check size={17} /> : index + 1}
              </span>
              <span className={["text-xs font-black leading-tight", active ? "text-brand-ink" : "text-slate-500"].join(" ")}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
