"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShieldCheck,
  ScanLine,
  FileText,
  Archive,
  BookOpen,
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
  Bell,
  Check,
  CircleHelp,
  RotateCcw,
  Sparkles,
  PanelLeftClose,
} from "lucide-react";
import { WorkspaceProvider, useWorkspace } from "@/lib/workspace";
import { backendConfigured } from "@/lib/backend";
import { Modal } from "@/components/ui";
import { LandingChrome } from "./LandingChrome";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/command-center", label: "Command center", icon: ShieldCheck },
  { href: "/scan", label: "Product scanner", icon: ScanLine },
  { href: "/lexibot", label: "Terms agent", icon: FileText },
  { href: "/warranty-vault", label: "Warranty vault", icon: Archive },
];

function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data, message, reset } = useWorkspace();
  const [mobile, setMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [panel, setPanel] = useState<
    "workspace" | "notifications" | "help" | null
  >(null);
  const active =
    navigation.find((item) => item.href === pathname)?.label ||
    "Research library";
  const samples =
    data.cases.some((item) => item.sample) ||
    data.warranties.some((item) => item.sample);
  if (pathname === "/") return <LandingChrome>{children}</LandingChrome>;
  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      {mobile && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "is-open" : ""}`}>
        <Link
          href="/"
          className="brand"
          aria-label="Hackops home"
          onClick={() => setMobile(false)}
        >
          <span className="brand-mark">
            <ShieldCheck size={22} strokeWidth={1.8} />
          </span>
          <span>
            Hackops
            <small>CONSUMER PROTECTION</small>
          </span>
        </Link>
        <button
          className="workspace-switch"
          onClick={() => setPanel("workspace")}
        >
          <span className="workspace-avatar">P</span>
          <span>
            Personal workspace
            <small>
              {samples ? "Demo data · fictional" : backendConfigured() ? "Backend sync configured" : "Saved in this browser"}
            </small>
          </span>
          <ChevronDown size={14} />
        </button>
        <div className="nav-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobile(false)}
              className={`nav-item ${pathname === href ? "active" : ""}`}
              aria-current={pathname === href ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={1.75} />
              <span>{label}</span>
              {href === "/command-center" &&
                data.cases.filter((item) => item.status !== "Resolved").length >
                  0 && (
                  <span className="nav-count">
                    {
                      data.cases.filter((item) => item.status !== "Resolved")
                        .length
                    }
                  </span>
                )}
            </Link>
          ))}
        </nav>
        <div className="nav-label resources-label">RESOURCES</div>
        <Link
          href="/research"
          className={`nav-item ${pathname === "/research" ? "active" : ""}`}
          onClick={() => setMobile(false)}
        >
          <BookOpen size={18} strokeWidth={1.75} />
          <span>Research library</span>
          <ArrowUpRight size={14} />
        </Link>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="mini-spark">
              <Sparkles size={16} />
            </span>
            <h3>
              Smart shopping.
              <br />Lasting confidence.
            </h3>
            <p>
              Know your rights.
              <br />
              Keep what you love covered.
            </p>
            <Link href="/research">
              Explore your rights <ArrowUpRight size={14} />
            </Link>
          </div>
          <button className="help-link" onClick={() => setPanel("help")}>
            <CircleHelp size={17} /> How Hackops helps you{" "}
            <ArrowUpRight size={13} />
          </button>
          <div className="sidebar-foot">
            <span className="status-dot" /> Built for everyday shoppers
          </div>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button desktop-collapse"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed(!collapsed)}
            >
              <PanelLeftClose size={18} />
            </button>
            <button
              className="icon-button mobile-toggle"
              aria-label={mobile ? "Close navigation" : "Open navigation"}
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span>Hackops</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{active}</strong>
          </div>
          <div className="topbar-actions">
            <span className="local-status">
              <span className="status-dot" /> {backendConfigured() ? "Backend synced" : "Secure browser storage"}
            </span>
            <span className="topbar-divider" />
            <button
              className="notification-button icon-button"
              aria-label="Open activity notifications"
              onClick={() => setPanel("notifications")}
            >
              <Bell size={18} />
              <span />
            </button>
            <button
              className="profile-pill"
              aria-label="Workspace settings"
              onClick={() => setPanel("workspace")}
            >
              <span className="user-avatar">AM</span>
              <span className="profile-info">
                <span className="profile-name">Alex Morgan</span>
                <span className="profile-sub">Personal Vault</span>
              </span>
              <ChevronDown size={14} className="profile-chevron" />
            </button>
          </div>
        </header>
        <main key={pathname}>{children}</main>
        <footer className="main-footer">
          <span>YOUR PURCHASES. YOUR PROOF. YOUR PEACE OF MIND.</span>
          <span>
            Hackops <span className="footer-dot">✦</span> Consumer Protection Platform · USD
          </span>
        </footer>
      </div>
      <div
        className={`toast ${message ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {message && (
          <>
            <Check size={17} />
            {message}
          </>
        )}
      </div>
      {panel === "workspace" && (
        <Modal
          title="Make yourself at home."
          description={backendConfigured()
            ? "Records sync to your private workspace. Sample records are fictional."
            : "Your records and receipts are saved locally in this browser for complete privacy."}
          onClose={() => setPanel(null)}
        >
          <div className="settings-options">
            <button
              className="settings-option"
              onClick={() => {
                reset(false);
                setPanel(null);
              }}
            >
              <Archive size={22} />
              <span>
                <strong>Start a fresh workspace</strong>
                <small>
                  Remove sample records and start fresh with your own purchases.
                </small>
              </span>
              <ArrowUpRight size={18} />
            </button>
            <button
              className="settings-option"
              onClick={() => {
                reset(true);
                setPanel(null);
              }}
            >
              <RotateCcw size={22} />
              <span>
                <strong>Restore sample records</strong>
                <small>Load helpful illustrative examples to explore features.</small>
              </span>
              <ArrowUpRight size={18} />
            </button>
          </div>
          <p className="form-note">
            Resetting replaces your workspace records. Attached documents remain in
            browser storage until you clear site data. {backendConfigured()
              ? "Connected records also update in the private backend workspace."
              : "No account creation or external cloud storage is required."}
          </p>
        </Modal>
      )}
      {panel === "notifications" && (
        <Modal
          title="Recent Activity"
          description="Updates and actions from your Hackops workspace."
          onClose={() => setPanel(null)}
        >
          <div className="activity-list">
            {data.activities.length ? (
              data.activities.map((item) => (
                <div className="activity-row" key={item.id}>
                  <span className="activity-icon">
                    <ShieldCheck size={17} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <small>{item.date}</small>
                </div>
              ))
            ) : (
              <p className="muted">
                All quiet for now. Your next purchase or dispute update will appear here.
              </p>
            )}
          </div>
        </Modal>
      )}
      {panel === "help" && (
        <Modal
          title="A Clear Guide to Hackops"
          description="How to get the most out of your consumer protection tools."
          onClose={() => setPanel(null)}
        >
          <div className="help-content">
            <h3>1. Store your purchases & proof</h3>
            <p>
              Add products to your warranty vault and attach receipts. Documents receive
              a cryptographic SHA-256 integrity seal for tamper-proof evidence{backendConfigured() ? " and sync with your backend" : ""}.
            </p>
            <h3>2. Take action on problems</h3>
            <p>
              Draft formal dispute notices in the command center. Export clean demand
              letters citing your statutory rights (UCC § 2-314 and federal warranty laws).
            </p>
            <h3>3. Understand the fine print</h3>
            <p>
              Paste contract text into the terms agent to quickly identify mandatory
              arbitration, warranty disclaimers, cancellation traps, and unilateral changes.
            </p>
          </div>
          <Link
            className="button button-primary"
            href="/research"
            onClick={() => setPanel(null)}
          >
            Visit the research library <ArrowUpRight size={16} />
          </Link>
        </Modal>
      )}
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <Chrome>{children}</Chrome>
    </WorkspaceProvider>
  );
}
