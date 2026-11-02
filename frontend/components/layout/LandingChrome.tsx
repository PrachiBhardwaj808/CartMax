"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ShieldCheck, Menu, X } from "lucide-react";

const landingSections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "features", label: "The toolkit" },
  { id: "how-it-works", label: "How it works" },
  { id: "faq", label: "Questions" },
];

export function LandingChrome({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sections = [...landingSections]
      .reverse()
      .map(({ id }) => document.getElementById(id));
    let frame: number | null = null;
    const updateSection = () => {
      frame = null;
      const current = sections.find(
        (section) => section && section.getBoundingClientRect().top <= 140,
      );
      setActiveSection(current?.id ?? "home");
    };
    const scheduleUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(updateSection);
    };
    updateSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menu) return;
    headerRef.current
      ?.querySelector<HTMLAnchorElement>("#landing-navigation a")
      ?.focus();
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuButtonRef.current?.focus();
      }
    };
    const dismissOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenu(false);
    };
    const dismissOnBlur = (event: FocusEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenu(false);
    };
    document.addEventListener("keydown", dismissOnEscape);
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOnBlur);
    return () => {
      document.removeEventListener("keydown", dismissOnEscape);
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOnBlur);
    };
  }, [menu]);
  return (
    <div className="landing-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="landing-nav" ref={headerRef}>
        <Link className="landing-brand" href="/" aria-label="Hackops home">
          <span className="brand-mark-circle">
            <ShieldCheck size={20} strokeWidth={2.2} />
          </span>
          <span className="brand-text">
            Hack<strong>ops</strong>
          </span>
        </Link>
        <nav
          id="landing-navigation"
          aria-label="Landing page navigation"
          className={menu ? "landing-nav-links is-open" : "landing-nav-links"}
        >
          {landingSections.map(({ id, label }) => (
            <a
              key={id}
              className={activeSection === id ? "is-active" : undefined}
              aria-current={activeSection === id ? "location" : undefined}
              href={`#${id}`}
              onClick={() => setMenu(false)}
            >
              {label}
            </a>
          ))}
          <Link href="/research" onClick={() => setMenu(false)}>
            Research
          </Link>
          <Link
            className="mobile-menu-cta"
            href="/dashboard"
            onClick={() => setMenu(false)}
          >
            Open workspace <ArrowUpRight size={15} />
          </Link>
        </nav>
        <div className="landing-nav-actions">
          <Link className="landing-nav-cta" href="/dashboard">
            Open workspace <ArrowUpRight size={15} />
          </Link>
          <button
            ref={menuButtonRef}
            className="landing-menu-button"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            aria-controls="landing-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      <main className="landing-main" id="main-content">
        {children}
      </main>
      <footer className="landing-footer">
        <div className="landing-footer-top">
          <div className="footer-brand-col">
            <Link className="landing-brand" href="/">
              <span className="brand-mark-circle">
                <ShieldCheck size={20} strokeWidth={2.2} />
              </span>
              <span className="brand-text">
                Hack<strong>ops</strong>
              </span>
            </Link>
            <p>
              Consumer intelligence made simple. Effortless purchase tracking,
              smart warranty vaults, and dispute resolution for everyone.
            </p>
          </div>
          <div className="footer-link-group">
            <span>THE WORKSPACE</span>
            <Link href="/command-center">Command center</Link>
            <Link href="/scan">Product scanner</Link>
            <Link href="/lexibot">Terms agent</Link>
            <Link href="/warranty-vault">Warranty vault</Link>
          </div>
          <div className="footer-link-group">
            <span>EXPLORE</span>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/research">Research library</Link>
            <a href="#faq">Common questions</a>
            <a href="#features">Explore the toolkit</a>
          </div>
          <div className="landing-footer-note">
            <span className="status-dot" /> PRIVATE &amp; SECURE
            <p>
              Everything is saved securely in your browser. No unwanted tracking.
            </p>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <span>© 2026 Hackops · All Rights Reserved</span>
          <span>Designed with care for everyday shoppers &amp; families.</span>
          <span>Local-first · Optional backend · USD</span>
        </div>
      </footer>
    </div>
  );
}
