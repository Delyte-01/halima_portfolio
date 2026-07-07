// Contact.tsx
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Calendar, ArrowRight, Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface ContactInfo {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: <Mail size={20} />,
    label: "Email",
    value: "shifatuhalimah20@gmail.com",
  },
  {
    icon: <MapPin size={20} />,
    label: "Location",
    value: "Surulere, Lagos, Nigeria",
  },
  {
    icon: <Calendar size={20} />,
    label: "Availability",
    value: "Freelance / Part-time",
  },
];

type FormState = "idle" | "sending" | "sent";

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function FloatingField({
  id,
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  rows,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const labelRef = useRef<HTMLLabelElement | null>(null);
  const isFloated = focused || value.length > 0;

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!labelRef.current) return;

    if (prefersReducedMotion) {
      gsap.set(labelRef.current, {
        y: isFloated ? -26 : 0,
        scale: isFloated ? 0.82 : 1,
      });
      return;
    }

    gsap.to(labelRef.current, {
      y: isFloated ? -26 : 0,
      scale: isFloated ? 0.82 : 1,
      duration: 0.35,
      ease: "premiumOut",
    });
  }, [isFloated]);

  const sharedClasses =
    "w-full bg-[var(--color-bg-elevated)] border rounded-lg px-4 pt-6 pb-2.5 text-sm text-[var(--color-text)] outline-none";

  return (
    <div className="relative">
      <label
        ref={labelRef}
        htmlFor={id}
        className="absolute left-4 top-4 origin-left font-inter text-sm text-[var(--color-text-faint)] pointer-events-none"
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={rows ?? 5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${sharedClasses} resize-none`}
          style={{
            borderColor: focused
              ? "var(--color-accent)"
              : "var(--color-border)",
          }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={sharedClasses}
          style={{
            borderColor: focused
              ? "var(--color-accent)"
              : "var(--color-border)",
          }}
        />
      )}
    </div>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const infoHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const infoListRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);
  const quickH = useRef<gsap.QuickToFunc | null>(null);

  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formState, setFormState] = useState<FormState>("idle");

  const updateField = (key: keyof FormFields) => (value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    gsap.registerEase(
      "premiumOut",
      (p: number) => 1 - Math.pow(1 - p, 3.2) * Math.cos(p * Math.PI * 0.08)
    );

    if (prefersReducedMotion) return;

    if (highlightRef.current) {
      quickY.current = gsap.quickTo(highlightRef.current, "y", {
        duration: 0.45,
        ease: "power3.out",
      });
      quickH.current = gsap.quickTo(highlightRef.current, "height", {
        duration: 0.35,
        ease: "power3.out",
      });
    }

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
        infoHeadingRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "premiumOut",
          scrollTrigger: { trigger: infoListRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        "[data-info-row]",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: "premiumOut",
          scrollTrigger: { trigger: infoListRef.current, start: "top 75%" },
        }
      );

      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 28, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "premiumOut",
          scrollTrigger: { trigger: formRef.current, start: "top 78%" },
        }
      );

      // magnetic submit button
      if (buttonRef.current) {
        const btn = buttonRef.current;
        const bx = gsap.quickTo(btn, "x", {
          duration: 0.5,
          ease: "power3.out",
        });
        const by = gsap.quickTo(btn, "y", {
          duration: 0.5,
          ease: "power3.out",
        });

        const onMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          bx((e.clientX - (rect.left + rect.width / 2)) * 0.15);
          by((e.clientY - (rect.top + rect.height / 2)) * 0.3);
        };
        const onLeave = () => {
          bx(0);
          by(0);
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

  const handleInfoMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !infoListRef.current ||
      !highlightRef.current ||
      !quickY.current ||
      !quickH.current
    )
      return;
    const row = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-info-row]"
    );
    if (!row) return;

    const listRect = infoListRef.current.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    quickY.current(rowRect.top - listRect.top);
    quickH.current(rowRect.height);
    gsap.to(highlightRef.current, {
      opacity: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleInfoLeave = () => {
    if (!highlightRef.current) return;
    gsap.to(highlightRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState !== "idle") return;

    setFormState("sending");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (buttonRef.current && !prefersReducedMotion) {
      gsap.to(buttonRef.current, {
        scale: 0.97,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    }

    // Replace with your real submit call (API route, form service, etc.)
    window.setTimeout(() => {
      setFormState("sent");
      window.setTimeout(() => {
        setFormState("idle");
        setFields({ name: "", email: "", subject: "", message: "" });
      }, 2200);
    }, 1200);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-28 md:py-36 bg-[var(--color-bg)] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 w-[520px] h-[520px] rounded-full blur-[140px]"
        style={{ background: "var(--color-accent-soft)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div>
            <span
              ref={eyebrowRef}
              className="inline-block font-satoshi text-xs tracking-[0.3em] uppercase text-[var(--color-accent-bright)]"
            >
              Let&apos;s Talk
            </span>
            <h2
              ref={headingRef}
              className="font-satoshi text-4xl md:text-5xl font-bold text-[var(--color-text)] mt-3"
            >
              Contact Me
            </h2>
          </div>
          <p
            ref={subRef}
            className="font-inter text-sm text-[var(--color-text-faint)] max-w-xs md:text-right"
          >
            I&apos;m always open to new opportunities and collaborations. Feel free
            to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left — contact info ledger */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h3
                ref={infoHeadingRef}
                className="font-satoshi text-2xl font-bold text-[var(--color-text)] mb-5"
              >
                Get In Touch
              </h3>
              <div
                ref={infoListRef}
                onMouseMove={handleInfoMove}
                onMouseLeave={handleInfoLeave}
                className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 overflow-hidden"
              >
                <div
                  ref={highlightRef}
                  className="pointer-events-none absolute left-0 right-0 z-0 opacity-0"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-accent-soft) 0%, transparent 70%)",
                    borderLeft: "2px solid var(--color-accent-bright)",
                  }}
                />
                {CONTACT_INFO.map(({ icon, label, value }, i) => (
                  <div
                    key={label}
                    data-info-row
                    className={`relative z-10 flex items-start gap-4 py-6 ${
                      i < CONTACT_INFO.length - 1
                        ? "border-b border-[var(--color-border)]"
                        : ""
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "var(--color-accent-soft)",
                        border: "1px solid var(--color-border-strong)",
                        color: "var(--color-accent-bright)",
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <p className="font-inter text-xs text-[var(--color-text-faint)]">
                        {label}
                      </p>
                      <p className="font-satoshi text-sm font-medium text-[var(--color-text)] mt-0.5">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-8">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 md:p-10 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FloatingField
                  id="name"
                  label="Name"
                  value={fields.name}
                  onChange={updateField("name")}
                />
                <FloatingField
                  id="email"
                  label="Email"
                  type="email"
                  value={fields.email}
                  onChange={updateField("email")}
                />
              </div>
              <FloatingField
                id="subject"
                label="Subject"
                value={fields.subject}
                onChange={updateField("subject")}
              />
              <FloatingField
                id="message"
                label="Message"
                value={fields.message}
                onChange={updateField("message")}
                textarea
                rows={5}
              />

              <button
                ref={buttonRef}
                type="submit"
                disabled={formState !== "idle"}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-satoshi font-semibold text-white will-change-transform disabled:cursor-default"
                style={{
                  background:
                    formState === "sent"
                      ? "var(--color-success)"
                      : "var(--gradient-accent)",
                }}
              >
                {formState === "idle" && (
                  <>
                    Send Message
                    <ArrowRight size={16} />
                  </>
                )}
                {formState === "sending" && "Sending..."}
                {formState === "sent" && (
                  <>
                    Message Sent
                    <Check size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
