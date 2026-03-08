import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onNavigate: (view: "register" | "admin") => void;
  isAdmin: boolean;
}

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Submit Application",
    description:
      "Fill out the form and upload your resume in minutes. Simple, fast, no account required.",
  },
  {
    number: "02",
    icon: Users,
    title: "Expert Review",
    description:
      "Our team personally reviews every application. No automated filters — real humans evaluate your fit.",
  },
  {
    number: "03",
    icon: Zap,
    title: "Fast Response",
    description:
      "Receive a decision within 5–7 business days. We respect your time and always reply.",
  },
];

const highlights = [
  "No registration account needed",
  "PDF resume upload supported",
  "Direct human review process",
  "Response within 5–7 business days",
  "Secure document handling",
  "Transparent status tracking",
];

const roles = [
  {
    title: "Software Engineer",
    dept: "Engineering",
    type: "Full-time",
    location: "Remote",
  },
  {
    title: "Product Designer",
    dept: "Design",
    type: "Full-time",
    location: "Hybrid",
  },
  {
    title: "Data Analyst",
    dept: "Analytics",
    type: "Contract",
    location: "On-site",
  },
  {
    title: "Marketing Lead",
    dept: "Growth",
    type: "Full-time",
    location: "Remote",
  },
];

export function LandingPage({ onNavigate, isAdmin }: LandingPageProps) {
  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative hero-mesh overflow-hidden border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 border border-accent/40 text-accent-foreground text-xs font-semibold tracking-wider uppercase mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-vivid step-pulse" />
                  Now Hiring — Open Positions Available
                </div>

                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[0.95] tracking-tight mb-6">
                  One Step to
                  <br />
                  <span className="text-accent-vivid">Your Career</span>
                </h1>

                <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed mb-8 max-w-md">
                  Apply for your dream role in minutes. Upload your resume, tell
                  us about yourself, and our team will take it from there.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    data-ocid="landing.apply_button"
                    size="lg"
                    onClick={() => onNavigate("register")}
                    className="gap-2 font-bold text-base px-7 cta-glow transition-all duration-300"
                  >
                    Apply for Jobs
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  {isAdmin && (
                    <Button
                      data-ocid="landing.admin_link"
                      variant="outline"
                      size="lg"
                      onClick={() => onNavigate("admin")}
                      className="gap-2 font-semibold text-base"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Button>
                  )}
                </div>

                {/* Social proof strip */}
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border">
                  <div className="flex -space-x-2">
                    {["SK", "MR", "AT", "JL"].map((initials) => (
                      <div
                        key={initials}
                        className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ring-2 ring-card"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 mb-0.5">
                      {(["s1", "s2", "s3", "s4", "s5"] as const).map((k) => (
                        <Star
                          key={k}
                          className="w-3 h-3"
                          style={{
                            color: "oklch(var(--status-pending))",
                            fill: "oklch(var(--status-pending))",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">200+</strong>{" "}
                      candidates placed this year
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right illustration */}
            <motion.div
              initial={{ opacity: 0, x: 32, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 rounded-3xl blur-3xl scale-110" />
                <img
                  src="/assets/generated/onestep-hero.dim_800x500.png"
                  alt="OneStep Jobs — Career pathway illustration"
                  className="relative rounded-2xl shadow-2xl w-full max-w-lg object-cover border border-border/50"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="absolute right-0 bottom-0 w-64 h-64 dot-pattern opacity-30 hidden lg:block" />
      </section>

      {/* ── Open Roles ───────────────────────────────────────────────── */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-accent-vivid text-sm font-bold tracking-widest uppercase mb-3">
              Open Positions
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Find your next opportunity
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {roles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <button
                  type="button"
                  className="group flex w-full items-center justify-between p-5 rounded-xl border border-border bg-card hover:border-accent/60 hover:shadow-md transition-all duration-200 cursor-pointer text-left"
                  onClick={() => onNavigate("register")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      onNavigate("register");
                  }}
                >
                  <div>
                    <p className="font-display font-bold text-foreground group-hover:text-accent-vivid transition-colors">
                      {role.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {role.dept} · {role.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border">
                      {role.type}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-vivid group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate("register")}
              className="gap-2 font-semibold"
            >
              Apply to Any Role
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="py-20 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-accent-vivid text-sm font-bold tracking-widest uppercase mb-3">
              The Process
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Three steps to your next role
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[-50%] h-px bg-border" />
                )}

                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-display text-4xl font-black text-accent/30 leading-none select-none">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-accent-vivid" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why OneStep ──────────────────────────────────────────────── */}
      <section className="py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-accent-vivid text-sm font-bold tracking-widest uppercase mb-3">
                Why OneStep
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-5">
                Built for candidates,
                <br />
                not for bureaucracy
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Traditional job portals make you create accounts, navigate
                confusing dashboards, and wait weeks for automated rejections.
                OneStep is different — submit once, we handle the rest.
              </p>

              <Button
                data-ocid="landing.apply_button"
                onClick={() => onNavigate("register")}
                className="gap-2 font-semibold cta-glow transition-all duration-300"
              >
                Start Your Application
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border"
                  >
                    <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-vivid" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="bg-primary px-8 sm:px-12 py-16 text-center relative">
              {/* Background texture */}
              <div className="absolute inset-0 grid-texture opacity-20" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl translate-x-8 -translate-y-8" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/15 rounded-full blur-2xl -translate-x-4 translate-y-4" />

              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-5">
                  <Clock className="w-5 h-5 text-accent-vivid" />
                  <span className="text-sm font-semibold text-accent-vivid tracking-wide">
                    Takes less than 5 minutes
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary-foreground tracking-tight mb-4">
                  Ready to take the first step?
                </h2>
                <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
                  Join hundreds of candidates who've found their next
                  opportunity through OneStep Jobs.
                </p>
                <Button
                  data-ocid="landing.apply_button"
                  size="lg"
                  onClick={() => onNavigate("register")}
                  className="gap-2 font-bold text-base px-8 bg-accent-vivid text-white hover:bg-accent-vivid/90 border-0 cta-glow transition-all duration-300"
                  style={{ backgroundColor: "oklch(var(--accent-vivid))" }}
                >
                  Apply Now — It's Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
