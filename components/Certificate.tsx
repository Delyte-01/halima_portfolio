// Certificates.tsx
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { Award, X, ZoomIn } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, Flip);

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
}

// Replace `image` paths with your actual certificate assets
// (e.g. imported from /public/certificates/*.jpg)
const CERTIFICATES: Certificate[] = [
  {
    id: "cert-participation",
    title: "Women in Technology Empowerment Certification",
    issuer: "W.Tec ",
    date: "2019",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783406849/W.Tec-DoRTB-eO_qljfqm.jpg",
  },
  {
    id: "cert-climate-reality",
    title: "Climate Reality Leadership Training",
    issuer: "The Climate Reality Project",
    date: "November 2023",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783406856/GlobalShapers-BsylfdZN_sexrjt.png",
  },
  {
    id: "cert-circular-exchange",
    title: "Circular Exchange — Reflect. Learn. Build.",
    issuer: "Volunteer Program, Lagos",
    date: "1 February 2024",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783406866/Circular-RYAAnQV__z61hov.png",
  },
  {
    id: "cert-hackathon",
    title: "Cavista's Hackathon",
    issuer: "Certificate of Participation",
    date: "23 February 2025",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783406880/Cavista-BHDa8HyH_hk9x9m.jpg",
  },
  {
    id: "cert-techsters",
    title: "Software Development Bootcamp",
    issuer: "Women Techsters Initiative",
    date: "26 May 2025",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783406892/Tech4Dev-DuFa5efl_fuye4f.png",
  },
  {
    id: "cert-flexisaf",
    title: "ALX SE Internship — Frontend Pathway",
    issuer: "Flexisaf",
    date: "August 2025",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783406975/Flexisaf-Ab0IjwvV_uh0d7y.jpg",
  },
];

// Alternating tilt for the "hung on a wall" feel — deliberately not
// randomized so it stays identical on every render/reload.
const TILTS = [-2.4, 1.8, -1.4, 2.2, -1.9, 1.5];

function CertificateCard({
  cert,
  index,
  onOpen,
  cardRef,
}: {
  cert: Certificate;
  index: number;
  onOpen: (cert: Certificate, el: HTMLDivElement) => void;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tilt = TILTS[index % TILTS.length];

  const handleEnter = () => {
    if (!wrapperRef.current) return;
    gsap.to(wrapperRef.current, {
      rotate: 0,
      y: -6,
      scale: 1.02,
      duration: 0.45,
      ease: "premiumOut",
    });
  };

  const handleLeave = () => {
    if (!wrapperRef.current) return;
    gsap.to(wrapperRef.current, {
      rotate: tilt,
      y: 0,
      scale: 1,
      duration: 0.45,
      ease: "premiumOut",
    });
  };

  return (
    <div
      ref={(el) => {
        wrapperRef.current = el;
        cardRef(el);
      }}
      data-cert-card
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={() => wrapperRef.current && onOpen(cert, wrapperRef.current)}
      style={{ transform: `rotate(${tilt}deg)` }}
      className="group relative cursor-pointer rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 pb-4 will-change-transform"
    >
      {/* mat/frame around the certificate image */}
      <div className="relative rounded-lg overflow-hidden border border-[var(--color-border-strong)]">
        <img
          data-flip-image
          src={cert.image}
          alt={cert.title}
          className="w-full h-56 object-cover"
        />

        {/* zoom affordance */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={15} />
        </div>

        {/* info overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="font-satoshi text-sm font-bold text-white leading-snug">
            {cert.title}
          </p>
          <p className="font-inter text-xs text-white/70 mt-1">
            {cert.issuer} · {cert.date}
          </p>
        </div>
      </div>

      {/* badge */}
      <div className="flex items-center gap-2 mt-3 px-1">
        <span
          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
          style={{
            background: "var(--color-accent-soft)",
            color: "var(--color-accent-bright)",
          }}
        >
          <Award size={13} />
        </span>
        <p className="font-inter text-xs font-medium text-[var(--color-text-muted)] truncate">
          {cert.title}
        </p>
      </div>
    </div>
  );
}

function Lightbox({
  cert,
  onClose,
}: {
  cert: Certificate | null;
  onClose: () => void;
}) {
  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!cert) return null;

  return (
    <div
      data-lightbox-root
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{
        background: "rgba(10, 7, 16, 0.85)",
        backdropFilter: "blur(10px)",
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white border border-[var(--color-border-strong)]"
        style={{ background: "var(--color-bg-elevated)" }}
      >
        <X size={18} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-3xl w-full rounded-2xl overflow-hidden border border-[var(--color-border-strong)]"
        style={{ background: "var(--color-bg-elevated)" }}
      >
        <img
          data-flip-image
          src={cert.image}
          alt={cert.title}
          className="w-full max-h-[70vh] object-contain bg-black"
        />
        <div className="p-6">
          <h3 className="font-satoshi text-xl font-bold text-[var(--color-text)]">
            {cert.title}
          </h3>
          <p className="font-inter text-sm text-[var(--color-text-muted)] mt-1">
            {cert.issuer} · {cert.date}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Certificates() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  useLayoutEffect(() => {
    if (!gsap.parseEase("premiumOut")) {
      gsap.registerEase(
        "premiumOut",
        (p: number) => 1 - Math.pow(1 - p, 3.2) * Math.cos(p * Math.PI * 0.08)
      );
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

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
        "[data-cert-card]",
        { opacity: 0, y: 34, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.09,
          ease: "premiumOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleOpen = (cert: Certificate, cardEl: HTMLDivElement) => {
    const img = cardEl.querySelector("[data-flip-image]");
    if (img) {
      flipStateRef.current = Flip.getState(img, { props: "borderRadius" });
    }
    setActiveCert(cert);
  };

  // once the lightbox mounts, Flip animates from the captured card state
  // to the lightbox image's actual layout position/size
  useLayoutEffect(() => {
    if (!activeCert || !flipStateRef.current) return;

    const lightboxImg = document.querySelector(
      "[data-lightbox-root] [data-flip-image]"
    );
    if (!lightboxImg) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    gsap.set("[data-lightbox-root]", { opacity: 0 });
    gsap.to("[data-lightbox-root]", {
      opacity: 1,
      duration: 0.25,
      ease: "power2.out",
    });

    Flip.from(flipStateRef.current, {
      targets: lightboxImg,
      duration: prefersReducedMotion ? 0 : 0.65,
      ease: "premiumOut",
      absolute: true,
    });

    flipStateRef.current = null;
  }, [activeCert]);

  const handleClose = () => {
    const activeEl = activeCert ? cardRefs.current.get(activeCert.id) : null;
    const lightboxImg = document.querySelector(
      "[data-lightbox-root] [data-flip-image]"
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (activeEl && lightboxImg && !prefersReducedMotion) {
      const cardImg = activeEl.querySelector("[data-flip-image]");
      if (cardImg) {
        const state = Flip.getState(lightboxImg);
        gsap.to("[data-lightbox-root]", {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => setActiveCert(null),
        });
        Flip.from(state, {
          targets: cardImg,
          duration: 0.5,
          ease: "power2.inOut",
          absolute: true,
        });
        return;
      }
    }

    setActiveCert(null);
  };

  return (
    <section
      ref={sectionRef}
      id="certificates"
      className="relative py-28 md:py-36 bg-[var(--color-bg)] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />
      <div
        className="pointer-events-none absolute -top-40 left-0 w-[520px] h-[520px] rounded-full blur-[140px]"
        style={{ background: "var(--color-accent-soft)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span
              ref={eyebrowRef}
              className="inline-block font-satoshi text-xs tracking-[0.3em] uppercase text-[var(--color-accent-bright)]"
            >
              Credentials
            </span>
            <h2
              ref={headingRef}
              className="font-satoshi text-4xl md:text-5xl font-bold text-[var(--color-text)] mt-3"
            >
              My Certificates
            </h2>
          </div>
          <p
            ref={subRef}
            className="font-inter text-sm text-[var(--color-text-faint)] max-w-xs md:text-right"
          >
            Training, workshops, and programs I&apos;ve completed along the way.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {CERTIFICATES.map((cert, i) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              index={i}
              onOpen={handleOpen}
              cardRef={(el) => {
                if (el) cardRefs.current.set(cert.id, el);
              }}
            />
          ))}
        </div>
      </div>

      <Lightbox cert={activeCert} onClose={handleClose} />
    </section>
  );
}
