// components/ProjectDetail.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/lib/Project-Data";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetail({
  project,
  nextProject,
}: {
  project: Project;
  nextProject: Project;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroImageRef = useRef<HTMLImageElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // scroll to top on mount — this is a fresh "page", not a continuation
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!gsap.parseEase("premiumOut")) {
      gsap.registerEase(
        "premiumOut",
        (p: number) => 1 - Math.pow(1 - p, 3.2) * Math.cos(p * Math.PI * 0.08)
      );
    }

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // entrance
      const tl = gsap.timeline({ defaults: { ease: "premiumOut" } });
      tl.fromTo(heroImageRef.current, { scale: 1.25, opacity: 0 }, { scale: 1.1, opacity: 1, duration: 1.1 })
        .fromTo(
          titleRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.9 },
          "-=0.6"
        )
        .fromTo(metaRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");

      // hero parallax
      gsap.to(heroImageRef.current, {
        yPercent: 12,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: heroImageRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // reading progress bar
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });

      // content reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "premiumOut",
            scrollTrigger: { trigger: el, start: "top 82%" },
          }
        );
      });

      gsap.fromTo(
        "[data-stack-pill]",
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: "premiumOut",
          scrollTrigger: { trigger: "[data-stack-pill]", start: "top 85%" },
        }
      );

      gsap.fromTo(
        "[data-feature-row]",
        { opacity: 0, x: -14 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "premiumOut",
          scrollTrigger: { trigger: "[data-feature-row]", start: "top 85%" },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen"
    >
      {/* reading progress */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left scale-x-0"
        style={{ background: "var(--gradient-accent)" }}
      />

      {/* hero */}
      <div className="relative w-full h-[60vh] md:h-[72vh] overflow-hidden">
        <img
          ref={heroImageRef}
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover will-change-transform"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,7,16,0.15) 0%, rgba(10,7,16,0.55) 65%, var(--color-bg) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-inter text-sm font-medium text-white/80 mb-6"
          >
            <ArrowLeft size={15} />
            Back to Projects
          </Link>

          <span className="font-satoshi text-xs tracking-[0.3em] uppercase text-[var(--color-accent-bright)]">
            {project.category}
          </span>
          <h1
            ref={titleRef}
            className="font-satoshi text-3xl md:text-5xl font-bold text-white mt-3 max-w-3xl"
          >
            {project.title}
          </h1>

          <div
            ref={metaRef}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5"
          >
            {project.role && (
              <span className="font-inter text-sm text-white/70">
                {project.role}
              </span>
            )}
            {project.year && (
              <span className="font-inter text-sm text-white/70">
                {project.year}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* left — narrative */}
          <div className="lg:col-span-7 space-y-14">
            <div data-reveal>
              <h2 className="font-satoshi text-2xl font-bold text-[var(--color-text)] mb-2">
                Project Overview
              </h2>
              <div
                className="h-0.5 w-10 mb-6 rounded-full"
                style={{ background: "var(--gradient-accent)" }}
              />
              <p className="font-inter text-[15px] leading-relaxed text-[var(--color-text-muted)]">
                {project.overview}
              </p>
            </div>

            <div data-reveal>
              <h2 className="font-satoshi text-2xl font-bold text-[var(--color-text)] mb-2">
                Challenges &amp; Solutions
              </h2>
              <div
                className="h-0.5 w-10 mb-6 rounded-full"
                style={{ background: "var(--gradient-accent)" }}
              />
              <p className="font-inter text-[15px] leading-relaxed text-[var(--color-text-muted)]">
                {project.challenges}
              </p>
            </div>

            {/* bottom actions */}
            <div
              data-reveal
              className="flex flex-wrap gap-4 pt-8 border-t border-[var(--color-border)]"
            >
              <Link
                href="/#projects"
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[var(--color-border-strong)] font-satoshi text-sm font-semibold text-[var(--color-text)]"
              >
                <ArrowLeft size={16} />
                Back to Projects
              </Link>

              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[var(--color-border-strong)] font-satoshi text-sm font-semibold text-[var(--color-text)]"
              >
                <Github size={16} />
                View Code
              </Link>

              <Link
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-satoshi text-sm font-semibold text-white"
                style={{ background: "var(--gradient-accent)" }}
              >
                <ExternalLink size={16} />
                Live Demo
              </Link>
            </div>
          </div>

          {/* right — sticky sidebar, same pattern as Resume/Contact */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-8">
              <div
                data-reveal
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7"
              >
                <h3 className="font-satoshi text-lg font-bold text-[var(--color-text)] mb-4">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      data-stack-pill
                      className="font-inter text-xs px-3 py-1.5 rounded-full border border-[var(--color-border-strong)] text-[var(--color-text-muted)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div
                data-reveal
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7"
              >
                <h3 className="font-satoshi text-lg font-bold text-[var(--color-text)] mb-4">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      data-feature-row
                      className="flex items-start gap-3 font-inter text-sm text-[var(--color-text-muted)]"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: "var(--gradient-accent)" }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* next project teaser */}
        <div
          data-reveal
          className="mt-24 pt-12 border-t border-[var(--color-border)]"
        >
          <span className="font-satoshi text-xs tracking-[0.3em] uppercase text-[var(--color-accent-bright)]">
            Next Up
          </span>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group flex items-center justify-between mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 md:p-8"
          >
            <div>
              <h3 className="font-satoshi text-xl md:text-2xl font-bold text-[var(--color-text)]">
                {nextProject.title}
              </h3>
              <p className="font-inter text-sm text-[var(--color-text-faint)] mt-2 max-w-md">
                {nextProject.description}
              </p>
            </div>
            <ArrowUpRight
              size={22}
              className="text-[var(--color-accent-bright)] flex-shrink-0"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}