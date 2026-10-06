/** Marketing copy for the landing page — kept as data so sections stay presentational. */

export const nav = [
  { label: "Product", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const logos = [
  "Northwind",
  "Lumen Labs",
  "Brightfold",
  "Copperline",
  "Halcyon",
  "Kitebird",
  "Meridian",
  "Tidewell",
];

export const features = [
  {
    title: "Live revenue, not yesterday's CSV",
    body: "Stripe, Shopify and your warehouse stream into one ledger. Numbers update the second a charge settles.",
    stat: "< 2s",
    statLabel: "event to chart",
    icon: "bolt",
  },
  {
    title: "Anomalies flagged before standup",
    body: "Pulse learns your weekly rhythm and nudges you when refunds spike or a channel quietly stalls.",
    stat: "38%",
    statLabel: "faster incident response",
    icon: "radar",
  },
  {
    title: "Cohorts in plain language",
    body: "Ask “which March signups upgraded within 30 days?” and get a cohort you can pin, share or export.",
    stat: "0",
    statLabel: "SQL required",
    icon: "spark",
  },
  {
    title: "Built for the whole team",
    body: "Role-based views mean finance sees margin, growth sees funnels and nobody sees what they shouldn't.",
    stat: "SOC 2",
    statLabel: "Type II audited",
    icon: "shield",
  },
] as const;

export const steps = [
  {
    title: "Connect your sources",
    body: "One-click connectors for Stripe, Shopify, HubSpot, Postgres and 40+ more. No engineers on standby.",
    detail: "~4 minutes",
  },
  {
    title: "Pulse finds the signal",
    body: "We model your baseline — seasonality, cohorts, channel mix — and surface what actually moved.",
    detail: "Automatic",
  },
  {
    title: "Act while it matters",
    body: "Alerts land in Slack with context attached, so the fix starts in the thread, not a meeting.",
    detail: "Real-time",
  },
];

export const testimonials = [
  {
    quote:
      "We killed three dashboards and a weekly metrics meeting. Pulse is just open on everyone's second monitor now.",
    name: "Maya Lindqvist",
    role: "COO, Brightfold",
    metric: "−6 hrs/week of reporting",
  },
  {
    quote: "The refund-spike alert caught a broken checkout on a Saturday morning. That one ping paid for the year.",
    name: "Omar Haddad",
    role: "Head of Growth, Kitebird",
    metric: "$41k revenue saved",
  },
  {
    quote: "Finally a tool our board deck and our on-call engineers both trust. Same numbers, everywhere.",
    name: "Priya Iyer",
    role: "CFO, Halcyon",
    metric: "1 source of truth",
  },
  {
    quote:
      "Setup took less time than our onboarding call with the last vendor. The cohort builder is genuinely delightful.",
    name: "Theo Brennan",
    role: "Founder, Parcelpoint",
    metric: "Live in 11 minutes",
  },
];

export const plans = [
  {
    name: "Starter",
    blurb: "For founders who want the truth without the spreadsheet.",
    monthly: 29,
    yearly: 24,
    cta: "Start free trial",
    features: ["Up to $50k MRR tracked", "3 data sources", "Daily anomaly digest", "2 team seats"],
  },
  {
    name: "Growth",
    blurb: "For teams that run on metrics and want them in real time.",
    monthly: 99,
    yearly: 79,
    cta: "Start free trial",
    featured: true,
    features: [
      "Up to $1M MRR tracked",
      "Unlimited data sources",
      "Real-time Slack alerts",
      "Natural-language cohorts",
      "10 team seats",
    ],
  },
  {
    name: "Scale",
    blurb: "For finance and data teams with audits to pass.",
    monthly: 349,
    yearly: 279,
    cta: "Talk to sales",
    features: ["Unlimited MRR", "SSO & SCIM", "Role-based access", "Warehouse sync", "Dedicated analyst"],
  },
];

export const faqs = [
  {
    q: "How long does setup take?",
    a: "Most teams connect their first source and see live revenue in under 10 minutes. Historical backfill for two years of data usually completes within the hour.",
  },
  {
    q: "Is my data secure?",
    a: "Pulse is SOC 2 Type II audited, encrypts data at rest (AES-256) and in transit (TLS 1.3), and never sells or shares your data. Scale customers can keep data in their own warehouse.",
  },
  {
    q: "What happens after the free trial?",
    a: "You'll get a reminder three days before the 14-day trial ends. If you don't pick a plan, your workspace pauses — nothing is charged and nothing is deleted for 90 days.",
  },
  {
    q: "Can I change plans later?",
    a: "Anytime. Upgrades take effect immediately and are prorated; downgrades apply at the end of your billing cycle.",
  },
  {
    q: "Do you offer discounts for startups or non-profits?",
    a: "Yes — companies under two years old with less than $1M raised get 50% off Growth for the first year. Non-profits get 30% off any plan.",
  },
];
