// Resume.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download, GraduationCap, Briefcase } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface RecordEntry {
  period: string;
  title: string;
  org: string;
  desc: string;
}

const EDUCATION: RecordEntry[] = [
  {
    period: "2022—Present",
    title: "MasterMind Series (Full-Stack Development)",
    org: "National Institution Of Information Technology (NIIT)",
    desc: "Specialized in Front-End Development.",
  },
];

const EXPERIENCE: RecordEntry[] = [
  {
    period: "2022—Present",
    title: "Front-End Developer",
    org: "Freelance",
    desc: "Developed a secure digital wallet using React.js, built and maintained a responsive portfolio website, integrated third-party APIs, and recreated the Netflix interface using React Native and Expo.",
  },
  {
    period: "2021—2022",
    title: "Junior Web Developer",
    org: "Personal Projects",
    desc: "Built several web projects during high school focused on HTML, CSS, and JavaScript. Explored modern frameworks and began working with React to create interactive interfaces.",
  },
];

function RecordRow({
  entry,
  isLast,
  rowRef,
}: {
  entry: RecordEntry;
  isLast: boolean;
  rowRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={rowRef}
      data-row
      className={`relative z-10 grid grid-cols-[88px_1fr] sm:grid-cols-[130px_1fr] gap-4 sm:gap-8 px-6 sm:px-8 py-7 ${
        !isLast ? "border-b border-[var(--color-border)]" : ""
      }`}
    >
      <span className="font-satoshi text-sm sm:text-base font-semibold tabular-nums text-[var(--color-accent-bright)] pt-1">
        {entry.period}
      </span>
      <div>
        <h4 className="font-satoshi text-lg font-bold text-[var(--color-text)]">
          {entry.title}
        </h4>
        <p className="font-inter text-sm font-medium text-[var(--color-text-muted)] mt-1">
          {entry.org}
        </p>
        <p className="font-inter text-sm leading-relaxed text-[var(--color-text-faint)] mt-3">
          {entry.desc}
        </p>
      </div>
    </div>
  );
}

function RecordGroup({
  icon,
  label,
  entries,
  groupRef,
  headerRef,
  addRowRef,
}: {
  icon: React.ReactNode;
  label: string;
  entries: RecordEntry[];
  groupRef: (el: HTMLDivElement | null) => void;
  headerRef: (el: HTMLDivElement | null) => void;
  addRowRef: (el: HTMLDivElement | null) => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);
  const quickH = useRef<gsap.QuickToFunc | null>(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !highlightRef.current) return;

    quickY.current = gsap.quickTo(highlightRef.current, "y", {
      duration: 0.45,
      ease: "power3.out",
    });
    quickH.current = gsap.quickTo(highlightRef.current, "height", {
      duration: 0.35,
      ease: "power3.out",
    });
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !highlightRef.current || !quickY.current || !quickH.current) return;

    const row = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
    if (!row) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const relativeTop = rowRect.top - cardRect.top;

    quickY.current(relativeTop);
    quickH.current(rowRect.height);
    gsap.to(highlightRef.current, { opacity: 1, duration: 0.25, ease: "power2.out" });
  };

  const handleLeave = () => {
    if (!highlightRef.current) return;
    gsap.to(highlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
  };

  return (
    <div className="mb-14 last:mb-0">
      <div ref={headerRef} className="flex items-center gap-3 mb-2">
        <span className="text-[var(--color-accent-bright)]">{icon}</span>
        <h3 className="font-satoshi text-xl font-bold text-[var(--color-text)]">{label}</h3>
      </div>
      <div
        ref={(el) => {
          cardRef.current = el;
          groupRef(el);
        }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-0 overflow-hidden"
      >
        {/* cursor-tracking highlight */}
        <div
          ref={highlightRef}
          className="pointer-events-none absolute left-0 right-0 z-0 opacity-0"
          style={{
            background:
              "linear-gradient(90deg, var(--color-accent-soft) 0%, transparent 70%)",
            borderLeft: "2px solid var(--color-accent-bright)",
          }}
        />
        <div className="px-6 sm:px-8">
          {entries.map((entry, i) => (
            <RecordRow
              key={entry.title}
              entry={entry}
              isLast={i === entries.length - 1}
              rowRef={addRowRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Resume() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const downloadCardRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLAnchorElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const groupHeaderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const groupCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerEase(
      "premiumOut",
      (p: number) => 1 - Math.pow(1 - p, 3.2) * Math.cos(p * Math.PI * 0.08)
    );

    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        defaults: { ease: "premiumOut" },
      });

      introTl
        .fromTo(eyebrowRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(
          headingRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.1 },
          "-=0.3"
        )
        .fromTo(subRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.6");

      gsap.fromTo(
        downloadCardRef.current,
        { opacity: 0, y: 24, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "premiumOut",
          scrollTrigger: { trigger: downloadCardRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "premiumOut",
          transformOrigin: "left center",
          scrollTrigger: { trigger: downloadCardRef.current, start: "top 70%" },
        }
      );

      groupCardRefs.current.forEach((card, i) => {
        gsap.fromTo(
          groupHeaderRefs.current[i],
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "premiumOut",
            scrollTrigger: { trigger: card, start: "top 82%" },
          }
        );

        gsap.fromTo(
          card,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "premiumOut",
            scrollTrigger: { trigger: card, start: "top 78%" },
          }
        );
      });

      gsap.fromTo(
        rowRefs.current,
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "premiumOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
        }
      );

      // magnetic download button
      if (buttonRef.current) {
        const btn = buttonRef.current;
        const quickX = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
        const quickY = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

        const onMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const relX = e.clientX - (rect.left + rect.width / 2);
          const relY = e.clientY - (rect.top + rect.height / 2);
          quickX(relX * 0.25);
          quickY(relY * 0.35);
        };
        const onLeave = () => {
          quickX(0);
          quickY(0);
        };

        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);

        return () => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="resume"
      className="relative py-28 md:py-36 bg-[var(--color-bg)] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />
      <div
        className="pointer-events-none absolute -bottom-40 left-0 w-[520px] h-[520px] rounded-full blur-[140px]"
        style={{ background: "var(--color-accent-soft)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div>
            <span
              ref={eyebrowRef}
              className="inline-block font-satoshi text-xs tracking-[0.3em] uppercase text-[var(--color-accent-bright)]"
            >
              Background
            </span>
            <h2
              ref={headingRef}
              className="font-satoshi text-4xl md:text-5xl font-bold text-[var(--color-text)] mt-3"
            >
              My Resume
            </h2>
          </div>
          <p
            ref={subRef}
            className="font-inter text-sm text-[var(--color-text-faint)] max-w-xs md:text-right"
          >
            Where I&apos;ve studied, what I&apos;ve built, and who I&apos;ve
            built it for.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <div
              ref={downloadCardRef}
              className="lg:sticky lg:top-28 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8"
            >
              <h3 className="font-satoshi text-2xl font-bold text-[var(--color-text)] mb-4">
                Download My Resume
              </h3>
              <p className="font-inter text-sm leading-relaxed text-[var(--color-text-muted)] mb-7">
                Get a comprehensive overview of my skills, experience, and
                education by downloading my resume.
              </p>
              <Link
                ref={buttonRef}
                href="/RESUME.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-lg font-satoshi font-semibold text-white will-change-transform"
                style={{ background: "var(--gradient-accent)" }}
              >
                <Download size={18} />
                Download Resume
              </Link>

              <div
                ref={dividerRef}
                className="h-px w-full mt-8 origin-left"
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-accent) 0%, transparent 100%)",
                }}
              />
              <p className="font-inter text-xs text-[var(--color-text-faint)] mt-4 tracking-wide">
                PDF · Updated 2026
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <RecordGroup
              icon={<GraduationCap size={22} />}
              label="Education"
              entries={EDUCATION}
              groupRef={(el) => {
                groupCardRefs.current[0] = el;
              }}
              headerRef={(el) => {
                groupHeaderRefs.current[0] = el;
              }}
              addRowRef={(el) => {
                if (el && !rowRefs.current.includes(el))
                  rowRefs.current.push(el);
              }}
            />
            <RecordGroup
              icon={<Briefcase size={22} />}
              label="Experience"
              entries={EXPERIENCE}
              groupRef={(el) => {
                groupCardRefs.current[1] = el;
              }}
              headerRef={(el) => {
                groupHeaderRefs.current[1] = el;
              }}
              addRowRef={(el) => {
                if (el && !rowRefs.current.includes(el))
                  rowRefs.current.push(el);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}