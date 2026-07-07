// Navbar.tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  "Home",
  "About",
  "Skills",
  "Projects",
  "Resume",
  "Certificates",
  "Contact",
] as const;

type NavLink = (typeof NAV_LINKS)[number];

function toId(link: NavLink) {
  return link.toLowerCase();
}

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      {/* monogram badge */}
      <div className="relative w-10 h-10 shrink-0">
        {/* ambient glow */}
        <div
          className="absolute -inset-1.5 rounded-xl blur-md opacity-50 transition-opacity duration-300 group-hover:opacity-80"
          style={{ background: "var(--color-accent-soft)" }}
        />

        <div
          className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-[1.04]"
          style={{ background: "var(--gradient-accent)" }}
        >
          <span
            className="font-satoshi font-bold text-white leading-none select-none"
            style={{ fontSize: "15px", letterSpacing: "-0.03em" }}
          >
            HM
          </span>

          {/* thin inner highlight along the top edge for depth */}
          <div
            className="absolute inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* wordmark */}
      <span className="font-satoshi text-xl font-bold tracking-tight">
        <span className="text-[var(--color-text)]">Hali</span>
        <span className="gradient-name">Mah</span>
      </span>
    </div>
  );
}



export default function Navbar() {
  const [active, setActive] = useState<NavLink>("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement | null>(null);
  const linkBarRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Map<NavLink, HTMLButtonElement>>(new Map());

  const panelRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const menuTlRef = useRef<gsap.core.Timeline | null>(null);

 const scrollTo = (link: NavLink) => {
   setMenuOpen(false);

   const id = toId(link);

   if (pathname !== "/") {
     router.push(`/#${id}`);
     return;
   }

   document.getElementById(id)?.scrollIntoView({
     behavior: "smooth",
   });
 };

  // register custom ease once
  useLayoutEffect(() => {
    if (!gsap.parseEase("premiumOut")) {
      gsap.registerEase(
        "premiumOut",
        (p: number) => 1 - Math.pow(1 - p, 3.2) * Math.cos(p * Math.PI * 0.08)
      );
    }
  }, []);

  // Nav stays permanently pinned — the only scroll-driven change is a
  // visual "compact" state (shorter bar, stronger border/background).
  // No hide/show, no translateY, so there's nothing that can leave the
  // hamburger button off-screen.
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll while the mobile menu is open
  useLayoutEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // active-link sliding indicator
  const moveIndicator = (link: NavLink, animate: boolean) => {
    const btn = linkRefs.current.get(link);
    const bar = linkBarRef.current;
    const indicator = indicatorRef.current;
    if (!btn || !bar || !indicator) return;

    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const x = btnRect.left - barRect.left;
    const width = btnRect.width;

    if (animate) {
      gsap.to(indicator, { x, width, duration: 0.5, ease: "premiumOut" });
    } else {
      gsap.set(indicator, { x, width });
    }
  };

  useLayoutEffect(() => {
    moveIndicator(active, false);
    const onResize = () => moveIndicator(active, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    moveIndicator(active, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // section observer to set active link
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(toId(link))
    ).filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = NAV_LINKS.find(
              (link) => toId(link) === entry.target.id
            );
            if (match) setActive(match);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // mobile menu open/close timeline
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!panelRef.current || !backdropRef.current) return;

    if (prefersReducedMotion) {
      gsap.set(panelRef.current, { display: menuOpen ? "block" : "none" });
      gsap.set(backdropRef.current, { display: menuOpen ? "block" : "none" });
      return;
    }

    menuTlRef.current?.kill();

    const links = gsap.utils.toArray<HTMLElement>("[data-mobile-link]");

    if (menuOpen) {
      gsap.set(panelRef.current, { display: "block" });
      gsap.set(backdropRef.current, { display: "block" });

      const tl = gsap.timeline();
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        0
      )
        .fromTo(
          panelRef.current,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 0.55, ease: "premiumOut" },
          0
        )
        .fromTo(
          links,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: "premiumOut",
          },
          0.2
        );
      menuTlRef.current = tl;
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(panelRef.current, { display: "none" });
          gsap.set(backdropRef.current, { display: "none" });
        },
      });
      tl.to(
        links,
        { opacity: 0, y: 10, duration: 0.2, stagger: 0.03, ease: "power2.in" },
        0
      )
        .to(
          panelRef.current,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.4,
            ease: "power2.inOut",
          },
          0.05
        )
        .to(
          backdropRef.current,
          { opacity: 0, duration: 0.3, ease: "power2.in" },
          0.05
        );
      menuTlRef.current = tl;
    }
  }, [menuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] border-b"
        style={{
          background: scrolled
            ? "rgba(10, 7, 16, 0.85)"
            : "rgba(10, 7, 16, 0.55)",
          borderColor: scrolled ? "var(--color-border-strong)" : "transparent",
          backdropFilter: "blur(14px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center justify-between transition-[height]"
            style={{ height: scrolled ? "64px" : "80px" }}
          >
            <button onClick={() => scrollTo("Home")}>
              <LogoMark />
            </button>

            {/* Desktop nav — sliding pill indicator */}
            <div
              ref={linkBarRef}
              className="hidden md:flex items-center gap-1 relative rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-1 py-1"
            >
              <div
                ref={indicatorRef}
                className="absolute top-1 bottom-1 left-0 rounded-full pointer-events-none"
                style={{ background: "var(--gradient-accent)" }}
              />
              {NAV_LINKS.map((link) => {
                const isActive = active === link;
                return (
                  <button
                    key={link}
                    ref={(el) => {
                      if (el) linkRefs.current.set(link, el);
                    }}
                    onClick={() => scrollTo(link)}
                    className={`relative z-10 px-4 py-1.5 rounded-full font-inter text-sm font-medium ${
                      isActive ? "text-white" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {link}
                  </button>
                );
              })}
            </div>

            {/* Mobile menu button — always above panel/backdrop, z-[60] */}
            <button
              className="md:hidden relative z-[110] p-2 text-[var(--color-text)]"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X size={28} strokeWidth={2.5} />
              ) : (
                <Menu size={28} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      <div
        ref={backdropRef}
        onClick={() => setMenuOpen(false)}
        className="hidden fixed inset-0 z-40 md:hidden"
        style={{
          background: "rgba(10, 7, 16, 0.7)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Mobile panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 left-0 right-0 md:hidden
      ${menuOpen ? "block" : "hidden"}
      z-40 pt-24 pb-8 px-6 border-b border-[var(--color-border)]`}
        style={{
          background: "var(--color-bg)",
        }}
      >
        <div className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = active === link;
            return (
              <button
                key={link}
                data-mobile-link
                onClick={() => scrollTo(link)}
                className={`flex items-center justify-between py-3.5 border-b border-[var(--color-border)] last:border-0 font-satoshi text-base font-semibold ${
                  isActive
                    ? "text-[var(--color-accent-bright)]"
                    : "text-[var(--color-text)]"
                }`}
              >
                {link}
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--gradient-accent)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
