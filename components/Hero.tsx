"use client";

import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import Image from "next/image";
import { registerMotion, LOADER_COVER_EVENT } from "@/lib/motion";
import { useLoading } from "@/hooks/Context/LoadingContext";

gsap.registerPlugin(useGSAP, SplitText, CustomEase);

registerMotion();

// ── Custom eases ──────────────────────────────────────────────
// premiumOut: confident, no-overshoot deceleration (Apple/Linear-style)
// softSpring: gentle overshoot for pops, badges, and buttons
CustomEase.create("premiumOut", "0.16, 1, 0.3, 1");
CustomEase.create("softSpring", "0.34, 1.56, 0.64, 1");

const TECH = ["React", "Javascript", "MongoDB", "React Native"];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useLoading();

  // ── Entrance timeline ──────────────────────────────────────
  // Runs once on mount. It does NOT wait for isLoading to flip false —
  // by the time that happens the loader overlay has already fully faded,
  // which is too late. Instead it builds fully hidden, then plays the
  // instant the loader's blob covers the whole screen (the one frame
  // nothing behind it is visible), so the reveal shows motion already
  // in progress instead of a static hero snapping into place.
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const allTargets = [
        ".status-pill",
        ".eyebrow",
        ".hero-headline",
        ".subhead",
        ".terminal-line",
        ".cta-buttons > *",
        ".tech-chip",
        ".editor-window",
        ".floating-badge",
        ".scroll-indicator",
      ];

      if (prefersReducedMotion) {
        gsap.set(allTargets, { opacity: 1, clearProps: "all" });
        return;
      }

      let split: SplitText | null = null;
      if (headlineRef.current) {
        split = SplitText.create(headlineRef.current, { type: "words" });
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "premiumOut" },
      });

      tl.from(".bg-layer", { opacity: 0, duration: 1.4 }, 0)
        .from(
          ".status-pill",
          { y: -16, opacity: 0, scale: 0.9, duration: 0.6 },
          0.1
        )
        .from(".eyebrow", { y: 12, opacity: 0, duration: 0.5 }, 0.3)
        .from(
          split?.words || [],
          { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.03 },
          0.35
        )
        .from(".subhead", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(
          ".terminal-line > *",
          { y: 10, opacity: 0, duration: 0.5, stagger: 0.06 },
          "-=0.45"
        )
        .from(
          ".cta-buttons > *",
          {
            y: 16,
            opacity: 0,
            scale: 0.9,
            duration: 0.6,
            stagger: 0.12,
            ease: "softSpring",
          },
          "-=0.3"
        )
        .from(
          ".tech-chip",
          { y: 10, opacity: 0, duration: 0.4, stagger: 0.05 },
          "-=0.35"
        )
        .from(
          ".editor-window",
          {
            opacity: 0,
            y: 50,
            rotateX: 14,
            transformOrigin: "center bottom",
            duration: 1.1,
          },
          0.45
        )
        .from(
          ".floating-badge",
          {
            opacity: 0,
            scale: 0.5,
            y: 12,
            duration: 0.6,
            stagger: 0.15,
            ease: "softSpring",
          },
          "-=0.35"
        )
        .from(
          ".scroll-indicator",
          { opacity: 0, y: -8, duration: 0.5 },
          "-=0.1"
        );

      // force-render the hidden "from" state right now, without playing —
      // this is what prevents the flash-of-visible-hero bug
      tl.pause(0);

      let played = false;
      const play = (): void => {
        if (played) return;
        played = true;
        tl.play();
      };

      if (!isLoading) {
        // loader had already finished before Hero mounted this time
        // (e.g. a client-side route change back to the home page)
        play();
      } else {
        window.addEventListener(LOADER_COVER_EVENT, play, { once: true });
      }

      return () => {
        window.removeEventListener(LOADER_COVER_EVENT, play);
        split?.revert();
      };
    },
    { scope: container }
  );

  // ── Micro-interaction: magnetic buttons ─────────────────────
  useGSAP(
    () => {
      const buttons = gsap.utils.toArray<HTMLElement>(".magnetic-btn");
      const teardown: Array<() => void> = [];

      buttons.forEach((btn) => {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });

        const onMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const relX = e.clientX - (rect.left + rect.width / 2);
          const relY = e.clientY - (rect.top + rect.height / 2);
          xTo(relX * 0.3);
          yTo(relY * 0.3);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        teardown.push(() => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => teardown.forEach((fn) => fn());
    },
    { scope: container }
  );

  // ── Micro-interaction: tilt on the editor window ────────────
  useGSAP(
    () => {
      const card = editorRef.current;
      if (!card) return;

      const rotateX = gsap.quickTo(card, "rotateX", {
        duration: 0.6,
        ease: "power3",
      });
      const rotateY = gsap.quickTo(card, "rotateY", {
        duration: 0.6,
        ease: "power3",
      });

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotateY(px * 10);
        rotateX(py * -10);
      };
      const onLeave = () => {
        rotateX(0);
        rotateY(0);
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);

      return () => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      id="home"
      className="relative flex min-h-screen pb-20 items-center overflow-hidden pt-24 sm:pt-28"
    >
      {/* ── Ambient background: dotted grid + violet glows + grain ── */}
      <div className="bg-layer pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_40%,transparent_100%)]" />
      <div className="bg-layer pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[var(--color-accent-soft)] blur-[100px]" />
      <div className="bg-layer pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[var(--color-accent-bright)]/10 blur-[100px]" />
      <div className="bg-layer bg-grain pointer-events-none absolute inset-0 opacity-[0.06]" />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* ── Text column ── */}
          <div>
            {/* Status pill */}
            <div className="status-pill inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-[var(--color-text-muted)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
              </span>
              Available for new projects
            </div>

            {/* Eyebrow */}
            <p className="eyebrow mt-6 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
              {/* front-end developer */}
            </p>

            {/* Headline */}
            <h1 className="hero-headline mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-[var(--color-text)] sm:text-6xl lg:text-7xl">
              <span ref={headlineRef}>Hi, I&apos;m</span>{" "}
              <span className="gradient-name">Shifatu Halimah</span>
            </h1>

            {/* Subhead */}
            <p className="subhead mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-text-muted)]">
              I design and build interfaces that feel as good as they look —
              turning tangled problems into clean, fast, accessible experiences.
            </p>

            {/* Terminal-style role line */}
            <div className="terminal-line mt-6 flex flex-wrap items-center gap-3 font-mono text-sm text-[var(--color-text-muted)]">
              <span className="text-[var(--color-accent-bright)]">{">"}</span>
              <span>Front-End Developer</span>
              <span className="h-4 w-px bg-[var(--color-border-strong)]" />
              <span>Problem Solver</span>
              <span className="inline-block h-4 w-[2px] animate-pulse bg-[var(--color-accent-bright)]" />
            </div>

            {/* CTAs */}
            <div className="cta-buttons mt-10 flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => scrollToId("projects")}
                className="magnetic-btn rounded-full px-8 text-white shadow-lg shadow-purple-900/40"
                style={{ backgroundImage: "var(--gradient-accent)" }}
              >
                View My Work
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToId("contact")}
                className="magnetic-btn rounded-full border-[var(--color-border-strong)] bg-transparent px-8 text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-bright)] "
              >
                Contact Me
              </Button>
            </div>

            {/* Tech chips */}
            <div className="mt-10 flex flex-wrap gap-2">
              {TECH.map((tech) => (
                <span
                  key={tech}
                  className="tech-chip rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-xs text-[var(--color-text-faint)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* ── Photo column: styled as a code editor window ── */}
          <div
            className="relative mx-auto w-full max-w-sm"
            style={{ perspective: 1000 }}
          >
            {/* Ambient glow behind the card */}
            <div
              className="absolute inset-4 -z-10 rounded-[2rem] opacity-40 blur-2xl"
              style={{ backgroundImage: "var(--gradient-accent)" }}
            />

            {/* Editor window — tilts toward the cursor */}
            <div
              ref={editorRef}
              className="editor-window relative overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-2xl shadow-black/60"
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
            >
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-3 font-mono text-[11px] text-[var(--color-text-faint)]">
                  shifatu.tsx
                </span>
              </div>

              {/* Photo */}
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="https://res.cloudinary.com/dk5mfu099/image/upload/v1783361743/Img-CC6LYDLM_kbnapw.jpg"
                  alt="Shifatu Halimah"
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Fake code strip */}
              <div className="space-y-1 border-t border-[var(--color-border)] px-4 py-3 font-mono text-[11px] leading-relaxed text-[var(--color-text-faint)]">
                <p>
                  <span className="text-[var(--color-accent-bright)]">
                    const
                  </span>{" "}
                  dev = {"{"}
                </p>
                <p className="pl-3">
                  role:{" "}
                  <span className="text-[var(--color-text-muted)]">
                    &quot;Front-End Developer&quot;
                  </span>
                  ,
                </p>
                <p className="pl-3">
                  stack:{" "}
                  <span className="text-[var(--color-text-muted)]">
                    [&quot;React&quot;, &quot;JS&quot;, &quot;SpringBoot&quot;]
                  </span>
                </p>
                <p>{"}"}</p>
              </div>
            </div>

            {/* Floating badges */}
            <div className="floating-badge absolute -right-4 -top-4 -rotate-3 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 py-2 font-mono text-xs text-[var(--color-text)] shadow-lg sm:-right-8">
              ⚡ 2+ yrs building UI
            </div>
            <div className="floating-badge absolute -bottom-4 -left-4 rotate-2 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 py-2 font-mono text-xs text-[var(--color-text)] shadow-lg sm:-left-8">
              🎯 Problem Solver
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToId("about")}
        aria-label="Scroll to About section"
        className="scroll-indicator absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-accent-bright)]"
      >
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-current pt-2">
          <div className="h-2 w-1 animate-bounce rounded-full bg-current" />
        </div>
        <ChevronDown size={16} />
      </button>
    </section>
  );
}
