// Skills.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  level: number;
}

interface SkillRowProps {
  skill: Skill;
  isLast: boolean;
  rowRef: (el: HTMLDivElement | null) => void;
  percentRef: (el: HTMLSpanElement | null) => void;
}

const SKILLS: Skill[] = [
  { name: "HTML and CSS", level: 90 },
  { name: "JavaScript", level: 70 },
  { name: "React", level: 90 },
  { name: "React Native", level: 50 },
  { name: "Java", level: 40 },
  { name: "Spring Boot", level: 65 },
  { name: "MongoDB", level: 50 },
];

const TOTAL_TICKS = 12;

function SkillRow({ skill, isLast, rowRef, percentRef }: SkillRowProps) {
  const filledTicks = Math.round((skill.level / 100) * TOTAL_TICKS);

  return (
    <div
      ref={rowRef}
      className={`flex items-center gap-4 sm:gap-6 px-5 sm:px-8 py-5 ${
        !isLast ? "border-b border-[var(--color-border)]" : ""
      }`}
    >
      <span className="font-satoshi text-[15px] font-medium text-[var(--color-text)] w-24 sm:w-36 md:w-44 shrink-0">
        {skill.name}
      </span>

      <div className="flex items-center gap-[3px] flex-1">
        {Array.from({ length: TOTAL_TICKS }).map((_, idx) => (
          <span
            key={idx}
            data-tick
            data-filled={idx < filledTicks ? "true" : "false"}
            className="h-6 flex-1 rounded-[2px] origin-left"
            style={{
              background:
                idx < filledTicks
                  ? "var(--gradient-accent)"
                  : "var(--color-border)",
              opacity: idx < filledTicks ? 1 : 0.55,
            }}
          />
        ))}
      </div>

      <span
        ref={percentRef}
        className="font-inter text-xs tabular-nums text-[var(--color-text-faint)] w-10 text-right shrink-0"
      >
        0%
      </span>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const ledgerRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const percentRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      percentRefs.current.forEach((el, i) => {
        if (el) el.textContent = `${SKILLS[i].level}%`;
      });
      return;
    }

    // Custom ease: quick arrival, then a faint cosine "settle" instead of a
    // hard stop — reads as hand-tuned rather than a stock power/expo curve.
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
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
        .fromTo(
          headingRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.1 },
          "-=0.3"
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.6"
        );

      gsap.fromTo(
        paraRefs.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "premiumOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
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
          scrollTrigger: { trigger: sectionRef.current, start: "top 55%" },
        }
      );

      gsap.fromTo(
        ledgerRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "premiumOut",
          scrollTrigger: { trigger: ledgerRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        rowRefs.current,
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.09,
          ease: "premiumOut",
          scrollTrigger: { trigger: ledgerRef.current, start: "top 70%" },
          onStart: () => {
            rowRefs.current.forEach((row, i) => {
              if (!row) return;
              const ticks =
                row.querySelectorAll<HTMLSpanElement>("[data-tick]");
              const filled = Array.from(ticks).filter(
                (t) => t.dataset.filled === "true"
              );

              gsap.fromTo(
                filled,
                { scaleX: 0 },
                {
                  scaleX: 1,
                  duration: 0.4,
                  stagger: 0.03,
                  ease: "power2.out",
                  delay: 0.15 + i * 0.09,
                }
              );

              const counter = { value: 0 };
              gsap.to(counter, {
                value: SKILLS[i].level,
                duration: 0.9,
                delay: 0.15 + i * 0.09,
                ease: "premiumOut",
                onUpdate: () => {
                  const el = percentRefs.current[i];
                  if (el) el.textContent = `${Math.round(counter.value)}%`;
                },
              });
            });
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-28 md:py-36 bg-[var(--color-bg)] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />
      <div
        className="pointer-events-none absolute -top-40 right-0 w-[520px] h-[520px] rounded-full blur-[140px]"
        style={{ background: "var(--color-accent-soft)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div>
            <span
              ref={eyebrowRef}
              className="inline-block font-satoshi text-xs tracking-[0.3em] uppercase text-[var(--color-accent-bright)]"
            >
              Capabilities
            </span>
            <h2
              ref={headingRef}
              className="font-satoshi text-4xl md:text-5xl font-bold text-[var(--color-text)] mt-3"
            >
              My Skills
            </h2>
          </div>
          <p
            ref={subRef}
            className="font-inter text-sm text-[var(--color-text-faint)] max-w-xs md:text-right"
          >
            A running log of the tools and languages I reach for most, and how
            deep that fluency goes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h3 className="font-satoshi text-2xl font-bold text-[var(--color-text)] mb-5">
                What I Bring to the Table
              </h3>
              <p
                ref={(el) => {
                  paraRefs.current[0] = el;
                }}
                className="font-inter text-[15px] leading-relaxed text-[var(--color-text-muted)] mb-4"
              >
                With a solid foundation in web development and a passion for
                crafting seamless user experiences, I specialize in front-end
                development while also exploring back-end technologies like
                Spring Boot. My skill set enables me to build responsive,
                scalable, and visually engaging web applications that deliver
                results.
              </p>
              <p
                ref={(el) => {
                  paraRefs.current[1] = el;
                }}
                className="font-inter text-[15px] leading-relaxed text-[var(--color-text-muted)] mb-8"
              >
                I&apos;m constantly learning and expanding my knowledge to stay
                current with the latest industry trends and technologies.
              </p>

              <div
                ref={dividerRef}
                className="h-px w-full origin-left"
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-accent) 0%, transparent 100%)",
                }}
              />
              <p className="font-inter text-xs text-[var(--color-text-faint)] mt-4 tracking-wide">
                Updated continuously as I ship.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div
              ref={ledgerRef}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden"
            >
              {SKILLS.map((skill, i) => (
                <SkillRow
                  key={skill.name}
                  skill={skill}
                  isLast={i === SKILLS.length - 1}
                  rowRef={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  percentRef={(el) => {
                    percentRefs.current[i] = el;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
