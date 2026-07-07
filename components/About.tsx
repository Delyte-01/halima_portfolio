"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import "../components/index.css"
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, CustomEase, MorphSVGPlugin);

// Custom easing curves — the whole feel of the section rides on these,
// not on the defaults gsap ships with.
CustomEase.create("silk", "0.65, 0, 0.35, 1"); // smooth, even glide — for fades/paragraphs
CustomEase.create("premiumOut", "0.16, 1, 0.3, 1"); // sharp deceleration — for the big reveals
CustomEase.create("popBack", "0.34, 1.56, 0.64, 1"); // slight overshoot — for the pill

// Two organic blob outlines the ambient shape morphs between.
const BLOB_A =
  "M45.3,-59.1C58.3,-51.1,68.4,-36.7,72.6,-20.9C76.8,-5.1,75.1,12,68.5,26.6C61.9,41.2,50.4,53.3,36.4,61.5C22.4,69.7,5.9,74,-11.4,73.9C-28.7,73.8,-46.8,69.3,-58.5,58.4C-70.2,47.5,-75.5,30.2,-77.4,12.6C-79.3,-5,-77.8,-22.9,-69.6,-36.8C-61.4,-50.7,-46.5,-60.6,-31.5,-67.6C-16.5,-74.6,-1.4,-78.7,13.6,-76.7C28.6,-74.7,45.3,-66.6,45.3,-59.1Z";
const BLOB_B =
  "M39.5,-51.7C52.6,-42.9,65.4,-32.4,69.6,-18.9C73.9,-5.4,69.6,11.1,61.2,24.8C52.8,38.5,40.3,49.3,26.1,56.4C11.9,63.5,-4,66.9,-19.2,63.6C-34.4,60.3,-48.9,50.3,-58.6,36.8C-68.3,23.3,-73.2,6.3,-70.9,-9.7C-68.6,-25.7,-59.1,-40.7,-46.1,-49.7C-33.1,-58.7,-16.6,-61.7,-1.2,-60.2C14.2,-58.7,28.4,-52.7,39.5,-51.7Z";


interface SpecItem {
  label: string;
  value: string;
  href?: string;
}

// Shape of the boolean flags returned by gsap.matchMedia() for this
// component's queries. Declared explicitly so context.conditions is
// typed instead of falling back to `any`.
interface MatchMediaConditions {
  isMobile: boolean;
  finePointer: boolean;
  reduced: boolean;
}

const SPECS: SpecItem[] = [
  { label: "Name", value: "Shifatu Halimah" },
  {
    label: "Email",
    value: "shifatuhalimah20@gmail.com",
    href: "mailto:shifatuhalimah20@gmail.com",
  },
  {
    label: "Based in",
    value: "24,Rabiatu Thompson Crescent,Surulere,Lagos,Nigeria",
  },
  { label: "Status", value: "Freelance / part-time" },
];

export default function AboutSection(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<HTMLSpanElement[]>([]);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const monogramRef = useRef<HTMLSpanElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const paraRefs = useRef<HTMLParagraphElement[]>([]);
  const specRefs = useRef<HTMLDivElement[]>([]);
  const blobRef = useRef<SVGPathElement | null>(null);
  const photoWrapRef = useRef<HTMLDivElement | null>(null);

  // Reset the collector arrays on every render so callback refs don't
  // accumulate stale nodes across re-renders (e.g. after a HMR update).
  lineRefs.current = [];
  paraRefs.current = [];
  specRefs.current = [];

  const addLineRef = (el: HTMLSpanElement | null): void => {
    if (el) lineRefs.current.push(el);
  };
  const addParaRef = (el: HTMLParagraphElement | null): void => {
    if (el) paraRefs.current.push(el);
  };
  const addSpecRef = (el: HTMLDivElement | null): void => {
    if (el) specRefs.current.push(el);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          finePointer: "(pointer: fine)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, finePointer, reduced } =
            context.conditions as unknown as MatchMediaConditions;

          // Respect the OS-level setting — snap everything to its end state.
          if (reduced) {
            gsap.set(
              [
                eyebrowRef.current,
                ...lineRefs.current,
                frameRef.current,
                photoRef.current,
                monogramRef.current,
                pillRef.current,
                ...paraRefs.current,
                ...specRefs.current,
              ].filter((el): el is HTMLElement => el instanceof HTMLElement),
              {
                clearProps: "all",
                opacity: 1,
              }
            );
            return;
          }

          const dur = isMobile ? 0.55 : 0.85;
          const stagger = isMobile ? 0.05 : 0.09;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current as Element,
              start: "top 78%",
              once: true,
            },
          });

          tl.fromTo(
            eyebrowRef.current,
            { opacity: 0, x: -16 },
            { opacity: 1, x: 0, duration: dur * 0.6, ease: "silk" }
          )
            .fromTo(
              lineRefs.current,
              { yPercent: 110 },
              { yPercent: 0, duration: dur, ease: "premiumOut", stagger: 0.12 },
              "-=0.15"
            )
            .fromTo(
              frameRef.current,
              { opacity: 0, scale: 0.92, rotate: -3 },
              { opacity: 0.9, scale: 1, rotate: 0, duration: dur, ease: "premiumOut" },
              "-=0.55"
            )
            .fromTo(
              photoRef.current,
              { opacity: 0, scale: 1.08 },
              { opacity: 1, scale: 1, duration: dur * 1.15, ease: "premiumOut" },
              "-=0.7"
            )
            .fromTo(
              monogramRef.current,
              { opacity: 0, scale: 0.85 },
              { opacity: 1, scale: 1, duration: dur, ease: "premiumOut" },
              "-=0.8"
            )
            .fromTo(
              paraRefs.current,
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: dur * 0.8, ease: "silk", stagger: 0.1 },
              "-=0.45"
            )
            .fromTo(
              specRefs.current,
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: dur * 0.7, ease: "silk", stagger },
              "-=0.35"
            )
            .fromTo(
              pillRef.current,
              { opacity: 0, scale: 0.6, y: 10 },
              { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "popBack" },
              "-=0.25"
            );

          // Ambient morphing shape behind the photo. Desktop only —
          // slow, low-amplitude, so it reads as atmosphere, not a distraction.
          if (!isMobile && blobRef.current) {
            gsap.timeline({ repeat: -1, yoyo: true }).to(blobRef.current, {
              morphSVG: BLOB_B,
              duration: 7,
              ease: "sine.inOut",
            });
          }

          // Subtle magnetic tilt on the photo, desktop + mouse only.
          if (!isMobile && finePointer && photoWrapRef.current) {
            const el = photoWrapRef.current;
            const rotateX = gsap.quickTo(el, "rotateX", { duration: 0.6, ease: "power3" });
            const rotateY = gsap.quickTo(el, "rotateY", { duration: 0.6, ease: "power3" });

            const onMove = (e: MouseEvent): void => {
              const rect = el.getBoundingClientRect();
              const px = (e.clientX - rect.left) / rect.width - 0.5;
              const py = (e.clientY - rect.top) / rect.height - 0.5;
              rotateY(px * 8);
              rotateX(py * -8);
            };
            const onLeave = (): void => {
              rotateX(0);
              rotateY(0);
            };

          el.style.transform = "perspective(800px)";
            el.addEventListener("mousemove", onMove);
            el.addEventListener("mouseleave", onLeave);

            return (): void => {
              el.removeEventListener("mousemove", onMove);
              el.removeEventListener("mouseleave", onLeave);
            };
          }

          return undefined;
        }
      );

      return (): void => mm.revert();
    }, sectionRef);

    return (): void => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="about-halimah relative overflow-hidden py-28"
      style={{ background: "var(--color-bg)" }}
    >
      {/* ambient texture */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-[0.35]" />
      <div
        className="pointer-events-none absolute -left-24 top-24 h-[420px] w-[420px] rounded-full blur-[110px]"
        style={{ background: "var(--color-accent-soft)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        {/* eyebrow — a real coordinate, not decoration: About is section 2 of 7 in the nav */}
        <div
          ref={eyebrowRef}
          className="mb-16 flex items-center gap-3 opacity-0"
        >
          <span
            className="h-[6px] w-[6px] rounded-full"
            style={{ background: "var(--color-accent-bright)" }}
          />
          <span
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "var(--color-text-faint)" }}
          >
            Section 02 / 07 — About
          </span>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          {/* ── Photo column ── */}
          <div className="lg:col-span-5">
            <div
              ref={photoWrapRef}
              className="relative mx-auto max-w-[360px] lg:mx-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* ambient morphing blob, sitting well behind everything else */}
              <svg
                className="pointer-events-none absolute -left-16 -top-10 -z-10 h-[300px] w-[300px] opacity-40 blur-2xl"
                viewBox="0 0 200 200"
                aria-hidden="true"
              >
                <g transform="translate(100,100)">
                  <path ref={blobRef} d={BLOB_A} fill="var(--color-accent)" />
                </g>
              </svg>

              {/* oversized monogram, the signature mark */}
              <span
                ref={monogramRef}
                className="monogram absolute -left-4 -top-16 select-none text-[180px] leading-none opacity-0 sm:text-[220px]"
                aria-hidden="true"
              >
                SH
              </span>

              {/* offset gradient frame, sitting behind the photo */}
              <div
                ref={frameRef}
                className="absolute -bottom-3 -right-3 h-full w-full rounded-[20px] opacity-0"
                style={{ background: "var(--gradient-accent)" }}
              />

              <div
                ref={photoRef}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] border opacity-0"
                style={{
                  borderColor: "var(--color-border-strong)",
                  background: "var(--color-surface)",
                }}
              >
                <Image
                  src="https://res.cloudinary.com/dk5mfu099/image/upload/v1783361743/Img-CC6LYDLM_kbnapw.jpg"
                  alt="Shifatu Halimah"
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* availability pill, overlapping the frame edge */}
              <div
                ref={pillRef}
                className="absolute -bottom-6 left-6 flex items-center gap-2 rounded-full border px-4 py-2 opacity-0 shadow-lg"
                style={{
                  background: "var(--color-bg-elevated)",
                  borderColor: "var(--color-border-strong)",
                }}
              >
                <span
                  className="h-[7px] w-[7px] rounded-full"
                  style={{ background: "var(--color-success)" }}
                />
                <span
                  className="text-[11px] tracking-wide"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Open to freelance work
                </span>
              </div>
            </div>
          </div>

          {/* ── Content column ── */}
          <div className="lg:col-span-7">
            <h2
              className="mb-8 text-[34px] font-bold leading-[1.15] sm:text-[42px] md:text-5xl"
              style={{ color: "var(--color-text)" }}
            >
              <span className="line-mask">
                <span ref={addLineRef} className="inline-block">
                  The person behind
                </span>
              </span>
              <span className="line-mask">
                <span ref={addLineRef} className="inline-block">
                  the <span className="gradient-text">front-end.</span>
                </span>
              </span>
            </h2>

            <div className="max-w-[58ch] space-y-5">
              <p
                ref={addParaRef}
                className="text-[15px] leading-[1.8] opacity-0 sm:text-base"
                style={{ color: "var(--color-text-muted)" }}
              >
                I&apos;m a passionate front-end developer with a strong
                foundation in modern web technologies. With over 2 years of
                experience in the industry, I&apos;ve worked on projects that
                have refined my skills in creating responsive, user-friendly,
                and visually appealing interfaces. While my expertise lies in
                front-end development, I&apos;m also dabbling in back-end
                technologies, particularly Spring Boot, to broaden my
                understanding of full-stack development.
              </p>
              <p
                ref={addParaRef}
                className="text-[15px] leading-[1.8] opacity-0 sm:text-base"
                style={{ color: "var(--color-text-muted)" }}
              >
                My journey in web development began during my high school years,
                and since then, I&apos;ve been continuously learning and
                adapting to new technologies. I believe in creating clean,
                efficient, and user-friendly websites that provide exceptional
                user experiences.
              </p>
            </div>

            {/* spec list — a masthead credit block, not icon cards */}
            <div
              className="mt-12 border-t"
              style={{ borderColor: "var(--color-border)" }}
            >
              {SPECS.map((item) => (
                <div
                  ref={addSpecRef}
                  className="spec-row opacity-0"
                  key={item.label}
                >
                  <span
                    className="text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: "var(--color-text-faint)" }}
                  >
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="email-link text-[15px] sm:text-base"
                      style={{ color: "var(--color-accent-bright)" }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span
                      className="text-[15px] sm:text-base"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}