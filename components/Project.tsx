// ProjectsSection.tsx
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Project, ProjectCategory, PROJECTS } from "@/lib/Project-Data";

gsap.registerPlugin(ScrollTrigger);


const PROJECT_FILTERS: ProjectCategory[] = [
  "All",
  "Web",
  "Mobile",
  "Full-Stack",
  "Database",
];



// ── helpers ──────────────────────────────────────────────

function CaseNumber({ index }: { index: number }) {
  return (
    <span className="font-inter text-xs tabular-nums tracking-[0.15em] text-[var(--color-text-faint)]">
      NO. {String(index + 1).padStart(2, "0")}
    </span>
  );
}

function StackPills({ stack }: { stack?: string[] }) {
  if (!stack || stack.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {stack.map((tech) => (
        <span
          key={tech}
          className="font-inter text-[11px] px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

function SpotlightCard({
  project,
  index,
  imageRef,
}: {
  project: Project;
  index: number;
  imageRef: (el: HTMLImageElement | null) => void;
}) {
  return (
    <div
      data-project-card
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 h-72 lg:h-full overflow-hidden">
          <div data-card-image-wrap className="w-full h-full overflow-hidden">
            <img
              ref={imageRef}
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover object-top will-change-transform"
              style={{ transform: "scale(1.15)" }}
            />
          </div>
        </div>
        <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-center">
          <div data-card-content>
            <CaseNumber index={index} />
            <h3 className="font-satoshi text-2xl md:text-3xl font-bold text-[var(--color-text)] mt-3">
              {project.title}
            </h3>
            <p className="font-inter text-sm leading-relaxed text-[var(--color-text-muted)] mt-4">
              {project.description}
            </p>
            <StackPills stack={project.stack} />

            <div
              className="h-px w-full mt-7 mb-6"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-accent) 0%, transparent 100%)",
              }}
            />

            <div className="flex gap-3">
              <Link
                href={`/projects/${project.slug}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[var(--color-border-strong)] font-satoshi text-sm font-semibold text-[var(--color-text)]"
              >
                View More
                <ArrowUpRight size={15} />
              </Link>

              <a
                href={project.demoLink}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-satoshi text-sm font-semibold text-white"
                style={{ background: "var(--gradient-accent)" }}
              >
                Live Demo
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const quickRotX = useRef<gsap.QuickToFunc | null>(null);
  const quickRotY = useRef<gsap.QuickToFunc | null>(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !cardRef.current) return;

    quickRotX.current = gsap.quickTo(cardRef.current, "rotationX", {
      duration: 0.5,
      ease: "power3.out",
    });
    quickRotY.current = gsap.quickTo(cardRef.current, "rotationY", {
      duration: 0.5,
      ease: "power3.out",
    });
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !quickRotX.current || !quickRotY.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    quickRotX.current(relY * -6);
    quickRotY.current(relX * 6);
  };

  const handleLeave = () => {
    quickRotX.current?.(0);
    quickRotY.current?.(0);
  };

  return (
    <div style={{ perspective: 900 }}>
      <div
        ref={cardRef}
        data-project-card
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden flex flex-col will-change-transform"
      >
        <div className="h-44 overflow-hidden">
          <div data-card-image-wrap className="w-full h-full overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
        <div data-card-content className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-satoshi text-lg font-bold text-[var(--color-text)]">
              {project.title}
            </h4>
            <CaseNumber index={index} />
          </div>
          <p className="font-inter text-sm leading-relaxed text-[var(--color-text-faint)] mb-5 flex-1">
            {project.description}
          </p>
          <div className="flex items-center gap-5 pt-4 border-t border-[var(--color-border)]">
            <Link
              href={`/projects/${project.slug}`}
              className="flex items-center gap-1.5 font-inter text-xs font-semibold text-[var(--color-text-muted)]"
            >
              View More <ArrowUpRight size={13} />
            </Link>

            <a
              href={project.demoLink}
              className="flex items-center gap-1.5 font-inter text-xs font-semibold text-[var(--color-accent-bright)]"
            >
              Live Demo <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── main section ─────────────────────────────────────────

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("All");
  const [displayFilter, setDisplayFilter] = useState<ProjectCategory>("All"); // what's actually rendered

  const filtered =
    displayFilter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === displayFilter);
  const [featured, ...rest] = filtered;

  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const buttonMap = useRef<Map<ProjectCategory, HTMLButtonElement>>(new Map());
  const contentRef = useRef<HTMLDivElement | null>(null);
  const blobARef = useRef<HTMLDivElement | null>(null);
  const blobBRef = useRef<HTMLDivElement | null>(null);
  const spotlightImageRef = useRef<HTMLImageElement | null>(null);

  const isFirstFilterRun = useRef(true);
  const isTransitioning = useRef(false);

  const registerButton = (filter: ProjectCategory) => (el: HTMLButtonElement | null) => {
    if (el) buttonMap.current.set(filter, el);
  };

  const moveIndicatorTo = (filter: ProjectCategory, animate: boolean) => {
    const btn = buttonMap.current.get(filter);
    const bar = filterBarRef.current;
    const indicator = indicatorRef.current;
    if (!btn || !bar || !indicator) return;

    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const x = btnRect.left - barRect.left;
    const width = btnRect.width;

    if (animate) {
      gsap.to(indicator, { x, width, duration: 0.55, ease: "premiumOut" });
    } else {
      gsap.set(indicator, { x, width });
    }
  };

  // Reveal animation applied to a fresh batch of cards — shared between the
  // initial scroll-triggered mount and every subsequent filter swap so both
  // moments feel like the same choreography, just triggered differently.
  const playCardsIn = (stagger = 0.09, delay = 0) => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");
    if (cards.length === 0) return;

    cards.forEach((card) => {
      const imgWrap = card.querySelector("[data-card-image-wrap]");
      const content = card.querySelector("[data-card-content]");
      if (imgWrap) gsap.set(imgWrap, { clipPath: "inset(0 0 100% 0)" });
      if (content) gsap.set(content, { opacity: 0, y: 16 });
    });

    // Distribute the stagger from the center outward rather than strictly
    // left-to-right — reads as a deliberate settle rather than a simple wipe.
    const tl = gsap.timeline({ delay });

    tl.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "premiumOut",
        stagger: { each: stagger, from: "start", grid: "auto" },
      }
    );

    cards.forEach((card, i) => {
      const imgWrap = card.querySelector("[data-card-image-wrap]");
      const content = card.querySelector("[data-card-content]");
      const cardDelay = i * stagger;

      if (imgWrap) {
        tl.to(
          imgWrap,
          { clipPath: "inset(0 0 0% 0)", duration: 0.75, ease: "premiumOut" },
          cardDelay
        );
      }
      if (content) {
        tl.to(
          content,
          { opacity: 1, y: 0, duration: 0.5, ease: "premiumOut" },
          cardDelay + 0.2
        );
      }
    });
  };

  // Mount: entrance choreography + infinite background morph
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!gsap.parseEase("premiumOut")) {
      gsap.registerEase(
        "premiumOut",
        (p: number) => 1 - Math.pow(1 - p, 3.2) * Math.cos(p * Math.PI * 0.08)
      );
    }

    if (prefersReducedMotion) {
      moveIndicatorTo(activeFilter, false);
      return;
    }

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
        .fromTo(subRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.6")
        .fromTo(filterBarRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4");

      ScrollTrigger.create({
        trigger: contentRef.current,
        start: "top 78%",
        once: true,
        onEnter: () => playCardsIn(0.1),
      });

      // infinite ambient blob morphing — border-radius shape tween,
      // no MorphSVG plugin needed since the value "shape" matches on both ends
      if (blobARef.current) {
        gsap.to(blobARef.current, {
          borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%",
          x: 40,
          y: -30,
          duration: 9,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
      if (blobBRef.current) {
        gsap.to(blobBRef.current, {
          borderRadius: "63% 37% 41% 59% / 59% 55% 45% 41%",
          x: -50,
          y: 35,
          duration: 11,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      moveIndicatorTo(activeFilter, false);
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter change: slide the indicator immediately, but sequence the grid
  // swap as out → swap data → in, instead of just fading the new set in
  // over the old one (which is what caused the flash-cut feel).
  useLayoutEffect(() => {
    moveIndicatorTo(activeFilter, !isFirstFilterRun.current);

    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false;
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayFilter(activeFilter);
      return;
    }

    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const outCards = gsap.utils.toArray<HTMLElement>("[data-project-card]");

    gsap.to(outCards, {
      opacity: 0,
      y: -14,
      scale: 0.97,
      duration: 0.3,
      stagger: 0.04,
      ease: "power2.in",
      onComplete: () => {
        setDisplayFilter(activeFilter);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  // Once React has actually swapped in the new filtered cards, play the
  // reveal-in sequence and release the transition lock.
  useLayoutEffect(() => {
    if (isFirstFilterRun.current) return; // handled by the mount effect
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    // wait a frame so the new DOM nodes are laid out before measuring/animating
    requestAnimationFrame(() => {
      playCardsIn(0.07);
      isTransitioning.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayFilter]);

  // Spotlight image parallax — recreated whenever the featured project changes
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !spotlightImageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(spotlightImageRef.current, {
        yPercent: 8,
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: spotlightImageRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    });

    return () => ctx.revert();
  }, [featured?.title]);

  const handleFilterClick = (filter: ProjectCategory) => {
    if (filter === activeFilter || isTransitioning.current) return;
    setActiveFilter(filter);
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-28 md:py-36 bg-[var(--color-bg)] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />

      {/* infinite morphing ambient blobs */}
      <div
        ref={blobARef}
        className="pointer-events-none absolute -top-32 right-[-120px] w-[480px] h-[480px] blur-[120px] opacity-60"
        style={{ background: "var(--color-accent-soft)", borderRadius: "62% 38% 37% 63% / 59% 41% 59% 41%" }}
      />
      <div
        ref={blobBRef}
        className="pointer-events-none absolute bottom-[-140px] left-[-100px] w-[420px] h-[420px] blur-[120px] opacity-50"
        style={{ background: "var(--color-accent-soft)", borderRadius: "41% 59% 59% 41% / 38% 62% 38% 62%" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span
              ref={eyebrowRef}
              className="inline-block font-satoshi text-xs tracking-[0.3em] uppercase text-[var(--color-accent-bright)]"
            >
              Selected Work
            </span>
            <h2
              ref={headingRef}
              className="font-satoshi text-4xl md:text-5xl font-bold text-[var(--color-text)] mt-3"
            >
              My Projects
            </h2>
          </div>
          <p
            ref={subRef}
            className="font-inter text-sm text-[var(--color-text-faint)] max-w-xs md:text-right"
          >
            A few things I&apos;ve designed, built, and shipped end to end.
          </p>
        </div>

        {/* filter bar — segmented control with a sliding indicator */}
        <div
          ref={filterBarRef}
          className="relative inline-flex flex-wrap gap-1 mb-16 p-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
        >
          <div
            ref={indicatorRef}
            className="absolute top-1 bottom-1 left-0 rounded-full pointer-events-none"
            style={{ background: "var(--gradient-accent)" }}
          />
          {PROJECT_FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                ref={registerButton(filter)}
                onClick={() => handleFilterClick(filter)}
                className={`relative z-10 px-5 py-2 rounded-full font-satoshi text-sm font-semibold ${
                  isActive ? "text-white" : "text-[var(--color-text-muted)]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* content */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-20 text-center">
            <p className="font-inter text-sm text-[var(--color-text-faint)]">
              Nothing filed under this category yet.
            </p>
          </div>
        ) : (
          <div ref={contentRef} className="space-y-6">
            <SpotlightCard
              project={featured}
              index={PROJECTS.indexOf(featured)}
              imageRef={(el) => {
                spotlightImageRef.current = el;
              }}
            />

            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {rest.map((project) => (
                  <CompactCard
                    key={project.title}
                    project={project}
                    index={PROJECTS.indexOf(project)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}