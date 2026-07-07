"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  registerMotion,
  BLOB_A,
  BLOB_B,
  BLOB_C,
  LOADER_TIMING as T,
  LOADER_COVER_EVENT,
  LOADER_DONE_EVENT,
} from "@/lib/motion";
import { useLoading } from "@/hooks/Context/LoadingContext";

registerMotion();

export default function Loader(): React.JSX.Element | null {
  const { setLoading } = useLoading();
  const [mounted, setMounted] = useState(true);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const blobWrapRef = useRef<HTMLDivElement | null>(null);
  const blobRef = useRef<SVGPathElement | null>(null);
  const digitsRef = useRef<HTMLSpanElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const progress = useRef({ value: 0 });

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const finishInstantly = (): void => {
      document.body.style.overflow = "";
      setLoading(false);
      setMounted(false);
      // still let the hero know it's clear to animate, just with no ceremony
      window.dispatchEvent(new CustomEvent(LOADER_COVER_EVENT));
      window.dispatchEvent(new CustomEvent(LOADER_DONE_EVENT));
    };

    if (reduced) {
      finishInstantly();
      return () => {
        document.body.style.overflow = "";
      };
    }

    const ctx = gsap.context(() => {
      let ambientLoop: gsap.core.Timeline | null = null;

      if (!isMobile && blobRef.current) {
        ambientLoop = gsap
          .timeline({ repeat: -1, yoyo: true })
          .to(blobRef.current, {
            morphSVG: BLOB_B,
            duration: 1.8,
            ease: "sine.inOut",
          });
      } else if (blobWrapRef.current) {
        ambientLoop = gsap
          .timeline({ repeat: -1, yoyo: true })
          .to(blobWrapRef.current, {
            scale: 1.06,
            duration: 1,
            ease: "sine.inOut",
          });
      }

      const updateDigits = (): void => {
        if (digitsRef.current) {
          digitsRef.current.textContent = String(
            Math.floor(progress.current.value)
          );
        }
      };

      const tl = gsap.timeline();
      tl.to(progress.current, {
        value: 90,
        duration: T.countTo90,
        ease: "countUp",
        onUpdate: updateDigits,
      });

      const runExit = (): void => {
        // Scale needed for the blob to cover the full viewport regardless
        // of aspect ratio — computed live instead of a guessed constant.
        const wrapEl = blobWrapRef.current;
        const wrapSize = wrapEl?.getBoundingClientRect().width ?? 280;
        const viewportDiag = Math.hypot(window.innerWidth, window.innerHeight);
        const coverScale = (viewportDiag / wrapSize) * 1.15;

        const exitTl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = "";
            setLoading(false);
            setMounted(false);
            window.dispatchEvent(new CustomEvent(LOADER_DONE_EVENT));
          },
        });

        exitTl
          .to(
            [labelRef.current, digitsRef.current?.parentElement],
            { opacity: 0, y: -8, duration: T.labelExit, ease: "silk" },
            0
          )
          .to(
            blobRef.current,
            { morphSVG: BLOB_C, duration: T.morphToCircle, ease: "silk" },
            0
          )
          .to(
            blobWrapRef.current,
            { scale: coverScale, duration: T.coverScale, ease: "flow" },
            0.1
          )
          .addLabel("covered")
          .call(
            () => window.dispatchEvent(new CustomEvent(LOADER_COVER_EVENT)),
            [],
            "covered"
          )
          // brief hold at full coverage — this beat is what makes the
          // reveal read as a deliberate sweep instead of a jump cut
          .to({}, { duration: T.coverHold }, "covered")
          .to(
            overlayRef.current,
            { opacity: 0, duration: T.fadeReveal, ease: "premiumOut" },
            `covered+=${T.coverHold}`
          );
      };

      const goToHundred = (): void => {
        tl.to(progress.current, {
          value: 100,
          duration: T.countTo100,
          ease: "popBack",
          onUpdate: updateDigits,
          onComplete: () => {
            ambientLoop?.kill();
            runExit();
          },
        });
      };

      if (document.readyState === "complete") {
        goToHundred();
      } else {
        window.addEventListener("load", goToHundred, { once: true });
      }
    }, overlayRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
      style={{ background: "#0a0710" }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div
        ref={blobWrapRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 sm:h-[280px] sm:w-[280px]"
      >
        <svg
          viewBox="-100 -100 200 200"
          className="h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="loaderGradient"
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
          <path ref={blobRef} d={BLOB_A} fill="url(#loaderGradient)" />
        </svg>
      </div>

      <div className="relative flex flex-col items-center gap-3">
        <div className="flex items-baseline gap-1 font-mono">
          <span
            className="text-[15vw] font-semibold leading-none text-[#f6f4fb] sm:text-[64px]"
            ref={digitsRef}
          >
            0
          </span>
          <span className="text-2xl text-[#a79fc2] sm:text-3xl">%</span>
        </div>
        <span
          ref={labelRef}
          className="text-[11px] uppercase tracking-[0.3em] text-[#a79fc2]"
        >
          Loading
        </span>
      </div>
    </div>
  );
}
