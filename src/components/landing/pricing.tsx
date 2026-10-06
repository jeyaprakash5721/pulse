"use client";

import { useState } from "react";
import { plans } from "@/lib/content";
import { Check } from "@/components/ui/icons";

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="scroll-mt-20 bg-surface-2/60 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">Pricing</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.02] tracking-tight sm:text-5xl">
              Simple plans that grow <em className="text-accent">with your revenue.</em>
            </h2>
          </div>

          <div
            role="radiogroup"
            aria-label="Billing period"
            className="flex rounded-full border border-line bg-surface p-1 text-sm"
          >
            {[
              { label: "Monthly", value: false },
              { label: "Yearly", value: true },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                role="radio"
                aria-checked={yearly === option.value}
                onClick={() => setYearly(option.value)}
                className={`rounded-full px-4 py-2 font-medium transition-colors ${
                  yearly === option.value ? "bg-ink text-bg" : "text-muted hover:text-ink"
                }`}
              >
                {option.label}
                {option.value && <span className="ml-1.5 text-xs text-accent">−20%</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const featured = "featured" in plan && plan.featured;
            const price = yearly ? plan.yearly : plan.monthly;
            return (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-7 sm:p-8 ${
                  featured ? "border-ink bg-ink text-bg lg:-my-4 lg:py-12" : "border-line bg-surface"
                }`}
              >
                {featured && (
                  <span className="absolute top-6 right-6 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-ink">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className={`mt-2 text-sm ${featured ? "text-bg/70" : "text-muted"}`}>{plan.blurb}</p>
                <p className="mt-8 flex items-baseline gap-1">
                  <span className="tabular font-display text-6xl">${price}</span>
                  <span className={`text-sm ${featured ? "text-bg/60" : "text-muted"}`}>/ month</span>
                </p>
                <p className={`mt-1 h-5 text-xs ${featured ? "text-bg/60" : "text-muted"}`}>
                  {yearly ? `Billed $${price * 12} yearly` : "Billed monthly"}
                </p>
                <a
                  href="#"
                  className={`mt-8 rounded-full py-3 text-center text-sm font-medium transition-transform hover:-translate-y-0.5 ${
                    featured ? "bg-accent text-accent-ink" : "bg-ink text-bg"
                  }`}
                >
                  {plan.cta}
                </a>
                <ul className="mt-8 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 shrink-0 text-accent" width={16} height={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
