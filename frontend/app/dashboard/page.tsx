"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Archive,
  FileSearch,
  ScanLine,
  Plus,
  Clock3,
  Check,
  ChevronRight,
  Sparkles,
  Fingerprint,
  Wallet,
  CircleCheck,
} from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
import { coverage, currency, daysUntil } from "@/lib/utils";
import { Badge, Loading, SectionHeading, EmptyState } from "@/components/ui";
import { ProductArt } from "@/components/visualizers/ProductArt";
import { backendConfigured } from "@/lib/backend";

export default function Overview() {
  const { data, ready } = useWorkspace();
  if (!ready) return <Loading />;
  const protectedItems = data.warranties.filter(
    (item) => coverage(item).days > 0,
  );
  const active = data.cases.filter((item) => item.status !== "Resolved");
  const expiring = data.warranties.filter(
    (item) => coverage(item).days > 0 && coverage(item).days <= 30,
  );
  const resolved = data.cases.filter((item) => item.status === "Resolved");
  const samples =
    data.cases.some((item) => item.sample) ||
    data.warranties.some((item) => item.sample);
  return (
    <div className="overview-page">
      <div className="overview-welcome">
        <div>
          <span className="eyebrow">Hackops CONSUMER PLATFORM</span>
          <h1>
            Your consumer command center.<span className="title-spark">✦</span>
          </h1>
          <p>Four pillars of protection. Everything you own, organized in one safe place.</p>
        </div>
        <Link href="/command-center?new=1" className="button button-primary">
          <Plus size={16} /> New case
        </Link>
      </div>
      <section className="hero-card">
        <div className="hero-copy">
          <div className="hero-pill">
            <span className="status-dot" /> CONSUMER INTELLIGENCE, ON YOUR SIDE
          </div>
          <h2>
            Equalizing consumer power through{" "}
            <em>autonomous legal intelligence.</em>
          </h2>
          <p>
            Build your case. Uncover product blind spots. Decode the fine print.{" "}
            <br />
            Protect every purchase with an intelligent warranty vault.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/command-center">
              Launch command center <ArrowUpRight size={17} />
            </Link>
            <a href="#defense-toolkit" className="button button-outline">
              Explore features <ArrowRight size={15} />
            </a>
          </div>
          <div className="hero-footnote">
            <Fingerprint size={15} /> Your workspace. {backendConfigured() ? "Backend sync configured." : "Saved in your browser."}
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <span className="orbit-star star-one">✦</span>
          <span className="orbit-star star-two">✦</span>
          <div className="floating-tag tag-top">
            <span className="tag-check">
              <Check size={12} />
            </span>{" "}
            Proof, all in one place
          </div>
          <div className="hero-shield">
            <ShieldCheck strokeWidth={0.9} />
          </div>
          <div className="floating-tag tag-bottom">
            <span className="status-dot" /> A little more protected.
          </div>
          <div className="hero-visual-label">KNOW IT. OWN IT. PROTECT IT.</div>
        </div>
      </section>
      <div className="metrics-grid">
        <Metric
          icon={<Archive size={18} />}
          label="Protected purchases"
          value={String(protectedItems.length).padStart(2, "0")}
          detail={`${currency(protectedItems.reduce((sum, item) => sum + item.purchasePrice, 0))} in your vault`}
        />
        <Metric
          icon={<ShieldCheck size={18} />}
          label="Active cases"
          value={String(active.length).padStart(2, "0")}
          detail={`${currency(active.reduce((sum, item) => sum + item.claimAmount, 0))} in requested refunds`}
        />
        <Metric
          icon={<Clock3 size={18} />}
          label="Expiring soon"
          value={String(expiring.length).padStart(2, "0")}
          detail={
            expiring.length
              ? "A little attention in the next 30 days"
              : "All clear for the next 30 days"
          }
          warm
        />
        <Metric
          icon={<Wallet size={18} />}
          label="Resolved case value"
          value={currency(
            resolved.reduce((sum, item) => sum + item.claimAmount, 0),
          )}
          detail={
            samples
              ? "Illustrative sample workspace"
              : `${resolved.length} cases marked resolved`
          }
        />
      </div>
      <section className="tools-section" id="defense-toolkit">
        <SectionHeading
          label="FOUR PILLARS. ONE STRONGER CONSUMER."
          title="Your consumer defense toolkit."
        />
        <div className="tool-grid">
          <Tool
            href="/command-center"
            icon={<ShieldCheck size={22} />}
            number="01"
            title="Command center"
            description="Turn a purchase problem into a clear, organized request for resolution."
            label="Command center"
            className="tool-amber"
          />
          <Tool
            href="/scan"
            icon={<ScanLine size={22} />}
            number="02"
            title="Barcode intelligence"
            description="Get a clearer picture of what’s behind the barcode before you buy."
            label="Product scanner"
            className="tool-green"
          />
          <Tool
            href="/lexibot"
            icon={<FileSearch size={22} />}
            number="03"
            title="Terms agent & LexiBot"
            description="Spot terms worth a second look. Ask questions, with the text to back it up."
            label="Terms agent"
            className="tool-purple"
          />
          <Tool
            href="/warranty-vault"
            icon={<Archive size={22} />}
            number="04"
            title="Digital warranty vault"
            description="Your purchases, receipts, and warranty dates. One less thing to keep in mind."
            label="Warranty vault"
            className="tool-neutral"
          />
        </div>
      </section>
      <div className="overview-lower">
        <section className="panel purchase-panel">
          <SectionHeading
            label="A HOME FOR WHAT YOU OWN"
            title="Your protected purchases"
            action={
              <Link className="text-link" href="/warranty-vault">
                View vault <ArrowUpRight size={15} />
              </Link>
            }
          />
          {data.warranties.length ? (
            <div className="purchase-list">
              {data.warranties.slice(0, 3).map((item) => {
                const state = coverage(item);
                return (
                  <Link
                    className="purchase-row"
                    key={item.id}
                    href={`/warranty-vault?item=${item.id}`}
                  >
                    <ProductArt category={item.category} />
                    <div className="purchase-info">
                      <strong>{item.name}</strong>
                      <span>
                        {item.brand} <span className="separator-dot">·</span>{" "}
                        {currency(item.purchasePrice)}
                      </span>
                    </div>
                    <div className="purchase-status">
                      <Badge
                        tone={
                          state.status === "Protected"
                            ? "green"
                            : state.status === "Expired"
                              ? "red"
                              : "amber"
                        }
                      >
                        {state.status}
                      </Badge>
                      <small>{state.days} days of coverage left</small>
                    </div>
                    <ChevronRight size={16} className="muted" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Your purchases belong here."
              description="Save your first product and keep the details close."
              action={
                <Link className="text-link" href="/warranty-vault">
                  Add a purchase <Plus size={15} />
                </Link>
              }
            />
          )}
        </section>
        <section className="panel activity-panel">
          <SectionHeading
            label="LITTLE UPDATES, BIGGER PICTURE"
            title="On your radar"
          />
          {data.activities.length ? (
            <div className="radar-list">
              {data.activities.slice(0, 3).map((item, index) => (
                <div className="radar-row" key={item.id}>
                  <span className={`radar-icon radar-${index}`}>
                    {item.kind === "warranty" ? (
                      <Clock3 size={17} />
                    ) : index === 2 ? (
                      <CircleCheck size={17} />
                    ) : (
                      <ShieldCheck size={17} />
                    )}
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                    <small>
                      {daysUntil(item.date) === 0
                        ? "Today"
                        : `${Math.abs(daysUntil(item.date))} days ago`}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="quiet-message">
              A quiet radar. Your updates will appear here.
            </p>
          )}
          <Link href="/research" className="radar-footer">
            <Sparkles size={16} />
            <span>A little knowledge goes a long way.</span>
            <ArrowRight size={15} />
          </Link>
        </section>
      </div>
      <div className="overview-bottom-note">
        <ShieldCheck size={15} />
        <span>
          {samples
            ? "You’re exploring a fictional sample workspace. Add your own purchases or start fresh from workspace settings."
            : backendConfigured()
              ? "Your workspace syncs to the configured backend. Review each source and keep your original evidence."
              : "Everything in this preview stays in your browser. Connect the optional backend to sync records and use public-source lookups."}
        </span>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  detail,
  warm,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  warm?: boolean;
}) {
  return (
    <div className={`metric-card ${warm ? "metric-warm" : ""}`}>
      <div className="metric-label">
        {label}
        <span>{icon}</span>
      </div>
      <div className="metric-value">
        {value}
        <span className="metric-tick">↗</span>
      </div>
      <p>
        {warm && <span className="small-amber-dot" />}
        {detail}
      </p>
    </div>
  );
}
function Tool({
  href,
  icon,
  number,
  title,
  description,
  label,
  className,
}: {
  href: string;
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
  label: string;
  className: string;
}) {
  return (
    <Link href={href} className={`tool-card ${className}`}>
      <div className="tool-top">
        <span className="tool-icon">{icon}</span>
        <span className="tool-number">/{number}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {number === "01" && (
        <div className="tool-preview case-mini">
          <div>
            <span>CASE LEDGER</span>
            <span>STATUS</span>
          </div>
          <div>
            <span>Headphone repair</span>
            <span className="mini-amber">Response active</span>
          </div>
          <div>
            <span>Coffee maker refund</span>
            <span>Draft ready</span>
          </div>
          <div>
            <span>Keyboard replacement</span>
            <span className="mini-green">Resolved</span>
          </div>
        </div>
      )}
      {number === "04" && (
        <div className="tool-preview vault-mini">
          <div>
            <Archive size={20} />
            <span>YOUR PRODUCT PASSPORT</span>
            <ShieldCheck size={17} />
          </div>
          <strong>Proof. Coverage. Peace of mind.</strong>
          <div className="mini-coverage">
            <span />
          </div>
          <small>Your records, organized for the next step.</small>
        </div>
      )}
      <div className="tool-bottom">
        {label}
        <span className="tool-arrow">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
