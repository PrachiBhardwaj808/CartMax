"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  ScanLine,
  FileSearch,
  Archive,
  Check,
  Plus,
  Minus,
  Fingerprint,
  Clock3,
  Scale,
} from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
import { currency, coverage } from "@/lib/utils";
import { ProductArt } from "@/components/visualizers/ProductArt";
import { RiskRadar } from "@/components/visualizers/RiskRadar";
import { backendConfigured } from "@/lib/backend";
import "./landing.css";

function Counter({ value, money = false }: { value: number; money?: boolean }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let frame = 0;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplay(value);
        return;
      }
      const start = performance.now();
      const tick = (time: number) => {
        const progress = Math.min(1, (time - start) / 900);
        setDisplay(
          progress === 1
            ? value
            : Math.round(value * (1 - Math.pow(1 - progress, 3))),
        );
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return (
    <span ref={ref}>
      {money ? currency(display) : String(display).padStart(2, "0")}
    </span>
  );
}

const questions = [
  {
    title: "What can I do with Hackops-CR today?",
    answer:
      "Explore the workspace, create resolution cases, organize purchases and receipts, screen pasted terms with keyword rules, and export draft notices. Data is saved in your browser by default; you can connect the FastAPI service for backend sync. The first visit includes fictional sample records you can replace from workspace settings.",
  },
  {
    title: "Will Hackops send a notice on my behalf?",
    answer:
      "You stay in control. This version creates a draft for you to review and send yourself. After sending it, record the notice in the command center to begin tracking your requested response window.",
  },
  {
    title: "Where are my receipts and purchase details stored?",
    answer:
      "Workspace details and document copies stay in this browser by default. With the optional API configured, cases, warranty records, and evidence also sync to a private bearer-token workspace. Keep your originals; this is not an account or recovery service.",
  },
  {
    title: "Are the product and contract results verified?",
    answer:
      "The scanner validates barcode checksums and can query public product and recall sources through the optional API. Contract screening uses keyword rules, and the chat retrieves exact sentences from your text. A missing result does not prove product safety, and neither feature determines legal eligibility or enforceability.",
  },
];

export default function LandingPage() {
  const { data } = useWorkspace();
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const active = data.cases.filter((item) => item.status !== "Resolved");
  const purchases = data.warranties.filter((item) => coverage(item).days > 0);
  const demo =
    data.warranties.some((item) => item.sample) ||
    data.cases.some((item) => item.sample);
  return (
    <div className="landing-page">
      <section className="landing-hero" id="home">
        <div className="landing-geometry" aria-hidden="true">
          <div className="geometry-quarter" />
          <div className="geometry-ring">
            <span />
          </div>
          <div className="geometry-pill" />
          <div className="geometry-small-circle" />
          <div className="geometry-petal" />
          <div className="geometry-orb">
            <ShieldCheck size={66} strokeWidth={1.1} />
            <span>CR</span>
          </div>
        </div>
        <div className="landing-hero-inner">
          <div className="landing-hero-kicker">
            <span /> CONSUMER RIGHTS · YOUR PURCHASES, PROTECTED
          </div>
          <div className="landing-wordmark">
            <h1 aria-label="Hackops consumer rights workspace">
              <span className="brand-wordmark-main">Hackops</span>
            </h1>
            <span className="wordmark-tag">
              YOUR RIGHTS.
              <br />
              YOUR ADVANTAGE.
            </span>
          </div>
          <div className="hero-side-pill">
            <span /> Intelligence on your side
          </div>
          <div className="landing-hero-bottom">
            <div className="landing-intro-copy">
              <h2>
                Small print.
                <br />
                Meet <span>your match.</span>
              </h2>
              <p>
                Bring your purchases, proof, and next steps together in one place.
                <br />
                Make the next move with a clearer view of your rights.
              </p>
              <div className="landing-hero-ctas">
                <Link className="landing-primary" href="/command-center">
                  Open your workspace <ArrowUpRight size={19} />
                </Link>
                <a href="#features" className="landing-secondary">
                  Explore the toolkit <ArrowRight size={18} />
                </a>
              </div>
            </div>
            <a href="#about" className="scroll-cue">
              <span>
                <ArrowDown size={14} />
              </span>{" "}
              SCROLL TO EXPLORE
            </a>
          </div>
        </div>
      </section>
      <div className="landing-marquee" aria-hidden="true">
        <div>
          {[0, 1].map((index) => (
            <span key={index}>
              Consumer redress <i>✦</i> Product intelligence <i>✦</i> Fine
              print, decoded <i>✦</i> Warranty protection <i>✦</i> Your rights,
              organized <i>✦</i>
            </span>
          ))}
        </div>
      </div>
      <section className="landing-section landing-about" id="about">
        <SectionIndex number="01" label="THE HUMAN SIDE OF CONSUMER RIGHTS" />
        <div className="landing-about-grid">
          <div>
            <h2>
              Serious about your rights.
              <br />
              <span>Even more about you.</span>
            </h2>
            <p>
              A receipt shouldn’t disappear when you need it. A warranty
              shouldn’t be a guessing game. And a page of fine print shouldn’t
              stand between you and an informed decision.
            </p>
            <p>
              Hackops brings the details together, so a frustrating purchase can
              become a clear next step.
            </p>
            <Link href="/dashboard" className="landing-text-link">
              Step inside the workspace <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="about-art" aria-hidden="true">
            <div className="about-art-label">
              <span className="status-dot" /> YOUR CONSUMER COMMAND CENTER
            </div>
            <div className="about-mini-heading">
              <ShieldCheck size={24} />
              <span>Everything, in your corner.</span>
              <span>↗</span>
            </div>
            <div className="about-mini-metrics">
              <div>
                <strong>{String(active.length).padStart(2, "0")}</strong>
                <span>Open cases</span>
              </div>
              <div>
                <strong>{String(purchases.length).padStart(2, "0")}</strong>
                <span>Protected purchases</span>
              </div>
              <div>
                <strong>4</strong>
                <span>Defense pillars</span>
              </div>
            </div>
            <div className="about-mini-row">
              <span className="about-mini-icon">
                <Archive size={18} />
              </span>
              <div>
                <strong>Your purchases. Your proof.</strong>
                <small>A place for the important details.</small>
              </div>
              <Check size={17} />
            </div>
            <div className="about-mini-row">
              <span className="about-mini-icon">
                <FileSearch size={18} />
              </span>
              <div>
                <strong>The fine print, in focus.</strong>
                <small>Find the text behind your questions.</small>
              </div>
              <ArrowUpRight size={17} />
            </div>
            <div className="about-art-footer">
              <Fingerprint size={15} /> A workspace built around you.
            </div>
          </div>
        </div>
        <div className="landing-stats-label">
          {demo
            ? "A LOOK INSIDE THE FICTIONAL DEMO WORKSPACE"
            : "YOUR WORKSPACE, AT A GLANCE"}
        </div>
        <div className="landing-stats">
          <div>
            <strong>
              <Counter
                value={active.reduce((sum, item) => sum + item.claimAmount, 0)}
                money
              />
            </strong>
            <span>
              Value of open requests
              <br />
              in your workspace
            </span>
          </div>
          <div>
            <strong>
              <Counter value={purchases.length} />
            </strong>
            <span>
              Purchases with recorded
              <br />
              warranty coverage
            </span>
          </div>
          <div>
            <strong>
              <Counter value={data.cases.length} />
            </strong>
            <span>
              Resolution cases
              <br />
              organized in one place
            </span>
          </div>
          <div>
            <strong>
              <Counter
                value={data.warranties.reduce(
                  (sum, item) => sum + item.documents.length,
                  0,
                )}
              />
            </strong>
            <span>
              Supporting documents
              <br />
              kept in your vault
            </span>
          </div>
        </div>
      </section>
      <section className="landing-features-wrap" id="features">
        <div className="landing-section">
          <SectionIndex number="02" label="LESS GUESSWORK. MORE CONTROL." />
          <div className="landing-section-heading">
            <h2>
              Find your kind
              <br />
              of <span>consumer power.</span>
            </h2>
            <p>
              Four connected tools. One stronger position.
              <br />
              Start with what you need. Keep the rest in your corner.
            </p>
          </div>
          <div className="landing-bento">
            <Link
              href="/command-center"
              className="landing-feature feature-command"
            >
              <div className="feature-card-top">
                <span>01 / CONSUMER REDRESS</span>
                <ShieldCheck size={24} />
              </div>
              <div className="feature-card-copy">
                <h3>
                  A problem.
                  <br />
                  <span>A plan of action.</span>
                </h3>
                <p>
                  Organize the facts, gather your evidence, and prepare a
                  resolution request you can review.
                </p>
                <span className="feature-link">
                  Open command center <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="feature-ledger" aria-hidden="true">
                <div>
                  <span>CASE LEDGER</span>
                  <span>STATUS</span>
                </div>
                <div>
                  <span>Headphone repair</span>
                  <small className="ledger-amber">Awaiting response</small>
                </div>
                <div>
                  <span>Warranty request</span>
                  <small>Draft notice</small>
                </div>
                <div>
                  <span>Keyboard refund</span>
                  <small className="ledger-green">Resolved</small>
                </div>
                <div className="ledger-countdown">
                  <Clock3 size={13} /> Your next step, on your radar.
                  <div>
                    <span />
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/scan" className="landing-feature feature-scan">
              <div className="feature-card-top">
                <span>02 / PRODUCT INTELLIGENCE</span>
                <ScanLine size={24} />
              </div>
              <div className="feature-barcode" aria-hidden="true">
                <div className="barcode-corner a" />
                <div className="barcode-corner b" />
                <div className="barcode-corner c" />
                <div className="barcode-corner d" />
                <div className="feature-barcode-lines" />
                <div className="feature-scan-line" />
              </div>
              <div className="feature-card-copy">
                <h3>Beyond the barcode.</h3>
                <p>
                  A clearer view of what you buy. Explore the scanner and the
                  planned product scorecard.
                </p>
                <span className="feature-link">
                  Try product scanner <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
            <Link href="/lexibot" className="landing-feature feature-terms">
              <div className="feature-card-top">
                <span>03 / CONTRACT INTELLIGENCE</span>
                <FileSearch size={24} />
              </div>
              <div className="feature-radar" aria-hidden="true">
                <RiskRadar values={[45, 75, 52, 65, 82]} />
              </div>
              <div className="feature-card-copy">
                <h3>Fine print. Clearer picture.</h3>
                <p>
                  Find clauses worth a closer look. Ask a question and go
                  straight to the source text.
                </p>
                <span className="feature-link">
                  Meet the terms agent <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
            <Link
              href="/warranty-vault"
              className="landing-feature feature-vault"
            >
              <div className="feature-card-top">
                <span>04 / PURCHASE PROTECTION</span>
                <Archive size={24} />
              </div>
              <div className="feature-card-copy">
                <h3>
                  Keep your proof.
                  <br />
                  <span>Lose the worry.</span>
                </h3>
                <p>
                  Your receipts, serial numbers, and coverage dates. A product
                  passport for what you own.
                </p>
                <span className="feature-link">
                  Explore warranty vault <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="feature-passport" aria-hidden="true">
                <div>
                  <span>PRODUCT PASSPORT</span>
                  <ShieldCheck size={17} />
                </div>
                <ProductArt category="Audio" />
                <strong>Studio Headphones Pro</strong>
                <span className="passport-sample">ILLUSTRATIVE PREVIEW</span>
                <div className="passport-coverage">
                  <span />
                  Recorded coverage
                </div>
                <div className="passport-progress">
                  <span />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <section className="landing-section landing-process" id="how-it-works">
        <SectionIndex number="03" label="A CLEARER PATH FORWARD" />
        <div className="landing-section-heading">
          <h2>
            From “what now?”
            <br />
            to <span>“I’ve got this.”</span>
          </h2>
          <p>
            A little preparation today.
            <br />A lot less searching when it matters.
          </p>
        </div>
        <div className="process-grid">
          {[
            {
              n: "01",
              icon: Archive,
              title: "Keep the essentials.",
              text: "Save a purchase, its warranty dates, and the receipt. Make the details easy to find.",
            },
            {
              n: "02",
              icon: FileSearch,
              title: "Understand your position.",
              text: "Read the important terms, find relevant passages, and check the original sources.",
            },
            {
              n: "03",
              icon: ShieldCheck,
              title: "Take your next step.",
              text: "Draft a clear request, review it, and track your follow-up after contacting the merchant.",
            },
          ].map(({ n, icon: Icon, title, text }) => (
            <div className="process-step" key={n}>
              <div>
                <span>{n}</span>
                <Icon size={27} strokeWidth={1.4} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="landing-research">
        <div className="landing-section">
          <SectionIndex number="04" label="BUILT ON IDEAS WORTH READING" />
          <div className="research-callout">
            <Scale size={57} strokeWidth={1} />
            <div>
              <h2>
                Better information.
                <br />
                <span>A stronger starting point.</span>
              </h2>
              <p>
                Explore the academic research, official guidance, and statutory
                sources that inform the project.
              </p>
            </div>
            <Link href="/research" className="landing-primary">
              Explore the library <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="research-topics">
            <span>CONSUMER REMEDIES</span>
            <span>WARRANTY LAW</span>
            <span>CONTRACT ANALYSIS</span>
            <span>PRODUCT TRANSPARENCY</span>
          </div>
        </div>
      </section>
      <section className="landing-section landing-faq" id="faq">
        <div>
          <SectionIndex number="05" label="GOOD QUESTIONS. CLEAR ANSWERS." />
          <h2>
            Before you
            <br />
            <span>make your move.</span>
          </h2>
          <p>
            A few things to know about
            <br />
            this workspace.
          </p>
        </div>
        <div className="faq-items">
          {questions.map((item, index) => (
            <div
              className={`faq-item ${openQuestion === index ? "faq-open" : ""}`}
              key={item.title}
            >
              <h3>
                <button
                  aria-expanded={openQuestion === index}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() =>
                    setOpenQuestion(openQuestion === index ? null : index)
                  }
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.title}
                  {openQuestion === index ? (
                    <Minus size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                </button>
              </h3>
              <div id={`faq-answer-${index}`} hidden={openQuestion !== index}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="landing-final-cta">
        <div className="landing-section">
          <span className="final-star" aria-hidden="true">
            ✦
          </span>
          <SectionIndex
            number="06"
            label="A LITTLE MORE POWER, IN YOUR HANDS"
          />
          <h2>
            Your purchases.
            <br />
            Your proof. <span>Your move.</span>
          </h2>
          <p>
            Start with one purchase. We’ll help you keep the details together.
          </p>
          <div className="landing-final-actions">
            <Link className="landing-primary" href="/dashboard">
              Open your workspace <ArrowUpRight size={19} />
            </Link>
            <Link href="/warranty-vault?new=1" className="landing-secondary">
              Protect a purchase <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="landing-preview-note">
            <span className="status-dot" /> Local-first · Optional backend ·
            No account required
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionIndex({ number, label }: { number: string; label: string }) {
  return (
    <div className="landing-section-index">
      <span>{number}</span>
      {label}
    </div>
  );
}
