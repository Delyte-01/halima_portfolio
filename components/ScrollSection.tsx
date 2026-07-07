"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  { title: "Project One", desc: "A short description of this project." },
  { title: "Project Two", desc: "A short description of this project." },
  { title: "Project Three", desc: "A short description of this project." },
];

export default function ScrollSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="mx-auto max-w-4xl px-6 py-32">
      <h2 className="mb-16 text-3xl font-semibold">Selected Work</h2>
      <div className="grid gap-8 sm:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.title}
            className="project-card rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            <h3 className="mb-2 text-xl font-medium">{project.title}</h3>
            <p className="text-muted-foreground">{project.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
