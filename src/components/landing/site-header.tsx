"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { Close, LogoMark, Menu } from "@/components/ui/icons";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-ink" aria-label="Pulse home">
          <LogoMark />
          <span className="text-lg font-semibold tracking-tight">Pulse</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-muted transition-colors hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/dashboard" className="text-sm font-medium text-ink hover:text-accent">
            Live demo
          </Link>
          <a
            href="#pricing"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform hover:-translate-y-px"
          >
            Start free
          </a>
        </div>

        <button
          type="button"
          className="-mr-2 grid size-10 place-items-center rounded-full text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="h-[calc(100dvh-4rem)] border-t border-line bg-bg px-4 pt-4 md:hidden"
        >
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-4 font-display text-3xl text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <Link href="/dashboard" className="rounded-full border border-line py-3 text-center font-medium">
              Open live demo
            </Link>
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="rounded-full bg-accent py-3 text-center font-medium text-accent-ink"
            >
              Start free trial
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
