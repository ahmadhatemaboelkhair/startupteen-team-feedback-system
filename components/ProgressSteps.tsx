"use client";

import { Check } from "lucide-react";

type Props = {
  steps: string[];
  current: number;
};

export function ProgressSteps({ steps, current }: Props) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-1 lg:overflow-visible lg:pb-0">
        {steps.map((step, index) => {
          const active = index === current;
          const complete = index < current;

          return (
            <div
              key={step}
              className="flex min-w-[92px] items-center gap-2 lg:min-w-0 lg:rounded-2xl lg:p-2"
            >
              <span
                className={[
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black transition",
                  complete
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-brand-orange text-white shadow-lg shadow-orange-200"
                      : "bg-slate-100 text-slate-500"
                ].join(" ")}
              >
                {complete ? <Check size={17} /> : index + 1}
              </span>
              <span className={["text-xs font-bold leading-tight", active ? "text-brand-ink" : "text-slate-500"].join(" ")}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
