// Footer.tsx

import { MapPin, Mail, Phone, Github, Linkedin, Twitter, ArrowUp, Instagram, Send } from "lucide-react";
import Link from "next/link";

const QUICK_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Resume", href: "/#resume" },
  { label: "Certificates", href: "/#certificates" },
  { label: "Contact", href: "/#contact" },
];

const CONTACT_INFO = [
  {
    icon: <MapPin size={16} />,
    value: "24, Rabiatu Thompson Crescent, Surulere, Lagos, Nigeria",
  },
  {
    icon: <Mail size={16} />,
    value: "shifatuhalimah20@gmail.com",
  },
  {
    icon: <Phone size={16} />,
    value: "+(234) 9070620245",
  },
];

const SOCIALS = [
  {
    icon: <Github size={17} />,
    href: "https://github.com/halimaarh",
    label: "GitHub",
  },
  {
    icon: <Linkedin size={17} />,
    href: "https://www.linkedin.com/in/halimah-shifatu-0139a0318/",
    label: "LinkedIn",
  },
  {
    icon: <Instagram size={17} />,
    href: "https://www.instagram.com/haly_mmah?igsh=MTlqeTRoYm04c3dyNQ%3D%3D",
    label: "Instagram",
  },
  {
    icon: <Send size={17} />,
    href: "https://t.me/Hahlee",
    label: "Telegram",
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-[var(--color-bg)] border-t border-[var(--color-border)] overflow-hidden">
      {/* ambient texture, consistent with rest of site */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[140px] opacity-40"
        style={{ background: "var(--color-accent-soft)" }}
      />

      {/* ghosted oversized wordmark — signature element */}
      <span
        aria-hidden
        className="gradient-name pointer-events-none select-none absolute -bottom-6 left-1/2 -translate-x-1/2 font-satoshi font-bold text-[18vw] leading-none whitespace-nowrap opacity-[0.05]"
      >
        HaliMah
      </span>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-14">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <h3 className="font-satoshi text-3xl font-bold text-[var(--color-text)]">
              Hali<span className="gradient-name">Mah</span>
            </h3>
            <p className="font-inter text-sm text-[var(--color-text-muted)] mt-2">
              Front-End Developer
            </p>
            <p className="font-inter text-sm leading-relaxed text-[var(--color-text-faint)] mt-5 max-w-sm">
              Building responsive, scalable interfaces with a close eye on
              detail — currently open to freelance and part-time work.
            </p>

            <div className="flex items-center gap-3 mt-7">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border border-[var(--color-border)] text-[var(--color-text-muted)]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3">
            <h4 className="font-satoshi text-lg font-bold text-[var(--color-text)] mb-2">
              Quick Links
            </h4>
            <div
              className="h-0.5 w-8 mb-6 rounded-full"
              style={{ background: "var(--gradient-accent)" }}
            />
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  
                  <Link href={link.href}
                    className="font-inter text-sm text-[var(--color-text-muted)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info — mini ledger card, matches Contact section */}
          <div className="lg:col-span-4">
            <h4 className="font-satoshi text-lg font-bold text-[var(--color-text)] mb-2">
              Contact Info
            </h4>
            <div
              className="h-0.5 w-8 mb-6 rounded-full"
              style={{ background: "var(--gradient-accent)" }}
            />
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5">
              {CONTACT_INFO.map((item, i) => (
                <div
                  key={item.value}
                  className={`flex items-start gap-3 py-4 ${
                    i < CONTACT_INFO.length - 1 ? "border-b border-[var(--color-border)]" : ""
                  }`}
                >
                  <span
                    className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "var(--color-accent-soft)",
                      color: "var(--color-accent-bright)",
                    }}
                  >
                    {item.icon}
                  </span>
                  <p className="font-inter text-sm text-[var(--color-text-muted)] leading-snug pt-1">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--color-border)]">
          <p className="font-inter text-xs text-[var(--color-text-faint)]">
            © {new Date().getFullYear()} Shifatu Halimah. All Rights Reserved.
          </p>


        </div>
      </div>
    </footer>
  );
}