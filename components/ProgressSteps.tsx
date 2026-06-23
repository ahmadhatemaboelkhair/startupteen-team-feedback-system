"use client";

import { Check } from "lucide-react";

type Props = {
  steps: string[];
  current: number;
};

export function ProgressSteps({ steps, current }: Props) {
  return (
    <div className="surface min-w-0 overflow-hidden p-2 sm:p-4">
      <div className="flex max-w-full gap-2 overflow-x-auto pb-1 sm:gap-3 lg:grid lg:grid-cols-1 lg:overflow-visible lg:pb-0">
        {steps.map((step, index) => {
          const active = index === current;
          const complete = index < current;

          return (
            <div
              key={step}
              className={[
                "flex min-w-[84px] items-center gap-2 rounded-2xl p-2 transition sm:min-w-[104px] lg:min-w-0",
                active ? "bg-brand-sky ring-1 ring-blue-100" : "hover:bg-slate-50"
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black transition sm:h-9 sm:w-9 sm:text-sm",
                  complete
                    ? "bg-emerald-500 text-white shadow-sm"
                    : active
                      ? "bg-brand-primary text-white shadow-brand"
                      : "bg-slate-100 text-slate-500"
                ].join(" ")}
              >
                {complete ? <Check size={17} /> : index + 1}
              </span>
              <span className={["text-[11px] font-black leading-tight sm:text-xs", active ? "text-brand-ink" : "text-slate-500"].join(" ")}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
