// BackToTop.tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUp } from "lucide-react";

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  const wrapperRef = useRef<HTMLButtonElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);
  const arrowUpRef = useRef<HTMLSpanElement | null>(null);
  const arrowDownRef = useRef<HTMLSpanElement | null>(null);

  const quickRingOffset = useRef<gsap.QuickToFunc | null>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);

  const prefersReducedMotion = useRef(false);

  // register the shared custom ease once (safe if already registered elsewhere)
  useLayoutEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!gsap.parseEase("premiumOut")) {
      gsap.registerEase(
        "premiumOut",
        (p: number) => 1 - Math.pow(1 - p, 3.2) * Math.cos(p * Math.PI * 0.08)
      );
    }
  }, []);

  // set up quickTo tweens once refs exist
  useLayoutEffect(() => {
    if (!ringRef.current || !wrapperRef.current) return;

    quickRingOffset.current = gsap.quickTo(
      ringRef.current,
      "strokeDashoffset",
      {
        duration: 0.15,
        ease: "power1.out",
      }
    );
    quickX.current = gsap.quickTo(wrapperRef.current, "x", {
      duration: 0.4,
      ease: "power3.out",
    });
    quickY.current = gsap.quickTo(wrapperRef.current, "y", {
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.set(ringRef.current, {
      strokeDasharray: CIRCUMFERENCE,
      strokeDashoffset: CIRCUMFERENCE,
    });
  }, []);

  // scroll: toggle visibility + drive the progress ring
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

      quickRingOffset.current?.(CIRCUMFERENCE * (1 - progress));
      setVisible(scrollTop > 360);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // appear / disappear choreography
  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    if (prefersReducedMotion.current) {
      gsap.set(wrapperRef.current, {
        opacity: visible ? 1 : 0,
        scale: 1,
        pointerEvents: visible ? "auto" : "none",
      });
      return;
    }

    if (visible) {
      gsap.to(wrapperRef.current, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.55,
        ease: "premiumOut",
        pointerEvents: "auto",
      });
    } else {
      gsap.to(wrapperRef.current, {
        opacity: 0,
        scale: 0.6,
        rotate: -15,
        duration: 0.35,
        ease: "power2.in",
        pointerEvents: "none",
      });
    }
  }, [visible]);

  // hover: shape morph (circle → squircle) + magnetic pull
  const handleMouseEnter = () => {
    if (prefersReducedMotion.current || !wrapperRef.current) return;
    gsap.to(wrapperRef.current, {
      borderRadius: "30%",
      duration: 0.4,
      ease: "premiumOut",
    });
  };

  const handleMouseLeave = () => {
    if (!wrapperRef.current) return;
    quickX.current?.(0);
    quickY.current?.(0);
    if (prefersReducedMotion.current) return;
    gsap.to(wrapperRef.current, {
      borderRadius: "50%",
      duration: 0.4,
      ease: "premiumOut",
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      prefersReducedMotion.current ||
      !wrapperRef.current ||
      !quickX.current ||
      !quickY.current
    )
      return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    quickX.current(relX * 0.25);
    quickY.current(relY * 0.25);
  };

  // click: launch sequence + smooth scroll
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (prefersReducedMotion.current) return;
    if (!arrowUpRef.current || !arrowDownRef.current) return;

    const tl = gsap.timeline();
    tl.to(arrowUpRef.current, {
      y: -18,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
    })
      .fromTo(
        arrowDownRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: "premiumOut" },
        "-=0.1"
      )
      .set(arrowUpRef.current, { y: 0, opacity: 1 })
      .set(arrowDownRef.current, { y: 18, opacity: 0 });

    gsap.fromTo(
      wrapperRef.current,
      { scale: 0.9 },
      { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" }
    );
  };

  return (
    <button
      ref={wrapperRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-14 h-14 rounded-full flex items-center justify-center opacity-0 scale-60 will-change-transform"
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border-strong)",
        boxShadow: "0 8px 30px rgba(147, 51, 234, 0.25)",
      }}
    >
      {/* progress ring */}
      <svg
        className="absolute inset-0 -rotate-90"
        width="56"
        height="56"
        viewBox="0 0 56 56"
      >
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="2"
        />
        <circle
          ref={ringRef}
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="url(#backToTopGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="backToTopGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="55%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#c026d3" />
          </linearGradient>
        </defs>
      </svg>

      {/* morphing arrow pair — only one visible at a time */}
      <span className="relative w-4 h-4 overflow-visible">
        <span
          ref={arrowUpRef}
          className="absolute inset-0 flex items-center justify-center text-[var(--color-text)]"
        >
          <ArrowUp size={18} />
        </span>
        <span
          ref={arrowDownRef}
          className="absolute inset-0 flex items-center justify-center opacity-0 text-[var(--color-text)]"
        >
          <ArrowUp size={18} />
        </span>
      </span>
    </button>
  );
}
