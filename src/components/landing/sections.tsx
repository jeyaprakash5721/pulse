import Link from "next/link";
import { faqs, features, logos, steps, testimonials } from "@/lib/content";
import { Arrow, Bolt, LogoMark, Plus, Radar, Shield, Spark } from "@/components/ui/icons";
import { initials } from "@/lib/format";

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: React.ReactNode; body?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl leading-[1.02] tracking-tight text-ink sm:text-5xl">{title}</h2>
      {body && <p className="mt-4 text-base text-muted sm:text-lg">{body}</p>}
    </div>
  );
}

export function LogoStrip() {
  return (
    <section aria-label="Customers" className="border-y border-line py-8">
      <p className="mb-6 text-center text-xs tracking-[0.2em] text-muted uppercase">
        Trusted by 2,400+ teams who&apos;d rather know than guess
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <ul className="marquee flex w-max gap-14 pr-14">
          {[...logos, ...logos].map((name, i) => (
            <li
              key={i}
              aria-hidden={i >= logos.length}
              className="font-display text-2xl whitespace-nowrap text-muted/80 italic"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const featureIcons = { bolt: Bolt, radar: Radar, spark: Spark, shield: Shield };

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading
        eyebrow="Product"
        title={
          <>
            Everything you check ten times a day, <em className="text-accent">finally in one place.</em>
          </>
        }
        body="Pulse replaces the tab-juggling between Stripe, analytics and spreadsheets with a single, trustworthy view."
      />
      <div className="mt-14 grid gap-4 md:grid-cols-6">
        {features.map((feature, i) => {
          const Icon = featureIcons[feature.icon];
          const dark = i === 0;
          return (
            <article
              key={feature.title}
              className={`group flex flex-col justify-between rounded-3xl border p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${
                i === 0 || i === 3 ? "md:col-span-4" : "md:col-span-2"
              } ${dark ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink"}`}
            >
              <div>
                <span
                  className={`grid size-11 place-items-center rounded-2xl ${dark ? "bg-accent text-accent-ink" : "bg-accent-soft text-accent"}`}
                >
                  <Icon />
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{feature.title}</h3>
                <p className={`mt-2 max-w-md text-sm leading-relaxed ${dark ? "text-bg/70" : "text-muted"}`}>
                  {feature.body}
                </p>
              </div>
              <p className="mt-10 flex items-baseline gap-3">
                <span className={`font-display text-5xl ${dark ? "text-accent" : "text-ink"}`}>{feature.stat}</span>
                <span className={`text-sm ${dark ? "text-bg/60" : "text-muted"}`}>{feature.statLabel}</span>
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-surface-2/60 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="How it works" title="From scattered data to a steady heartbeat in three steps." />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden="true"
            className="absolute top-7 right-[16%] left-[16%] hidden border-t border-dashed border-chart-muted md:block"
          />
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="relative grid size-14 place-items-center rounded-full border border-line bg-bg font-display text-2xl text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              <p className="mt-4 inline-block rounded-full bg-surface px-3 py-1 font-mono text-xs text-ink">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading eyebrow="Customers" title={<span id="testimonials-title">Teams that stopped guessing.</span>} />
      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <figure
            key={t.name}
            className={`flex flex-col justify-between rounded-3xl border border-line bg-surface p-6 sm:p-8 ${
              i % 3 === 0 ? "md:translate-y-6" : ""
            }`}
          >
            <blockquote className="font-display text-2xl leading-snug text-ink sm:text-[1.7rem]">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <span className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-ink text-sm font-semibold text-bg">
                  {initials(t.name)}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t.name}</span>
                  <span className="block text-xs text-muted">{t.role}</span>
                </span>
              </span>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">{t.metric}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section
      id="faq"
      className="mx-auto grid max-w-6xl scroll-mt-20 gap-12 px-4 py-24 sm:px-6 sm:py-32 md:grid-cols-[1fr_1.4fr]"
    >
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered."
        body="Can't find what you're looking for? Our team replies in under two hours on weekdays."
      />
      <div className="divide-y divide-line border-y border-line">
        {faqs.map((item) => (
          <details key={item.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-lg font-medium text-ink">
              {item.q}
              <Plus className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <p className="mt-3 pr-10 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center text-bg sm:px-12 sm:py-24">
        <svg
          className="absolute inset-x-0 top-1/2 h-24 w-full -translate-y-1/2 text-accent opacity-25"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 60 H480 l14 -10 l10 10 h22 l12 -52 l16 100 l14 -66 l10 18 H1200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <h2 className="relative mx-auto max-w-3xl font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">
          Your business has a heartbeat. <em className="text-accent">Start listening.</em>
        </h2>
        <p className="relative mx-auto mt-5 max-w-lg text-bg/70">
          14 days free on any plan. Connect a source, and you&apos;ll see your first live chart before your coffee
          cools.
        </p>
        <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#pricing"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink sm:w-auto"
          >
            Start your free trial
            <Arrow className="transition-transform group-hover:translate-x-0.5" width={18} height={18} />
          </a>
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center rounded-full border border-bg/20 px-6 py-3.5 font-medium sm:w-auto"
          >
            See the dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

const footerLinks = [
  { title: "Product", links: ["Overview", "Integrations", "Alerts", "Changelog"] },
  { title: "Company", links: ["About", "Careers", "Customers", "Press"] },
  { title: "Resources", links: ["Docs", "API status", "Security", "Contact"] },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="flex items-center gap-2 text-ink">
            <LogoMark />
            <span className="text-lg font-semibold tracking-tight">Pulse</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted">
            The heartbeat of your business, live. Made for teams that would rather know than guess.
          </p>
        </div>
        {footerLinks.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-sm font-semibold">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted transition-colors hover:text-ink">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-line px-4 py-6 text-xs text-muted sm:flex-row sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Pulse Labs, Inc. A fictional product.</p>
        <p className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-positive" /> All systems operational
        </p>
      </div>
    </footer>
  );
}
