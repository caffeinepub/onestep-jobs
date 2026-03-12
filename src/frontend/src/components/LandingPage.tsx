import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  MapPin,
  Shield,
  Star,
  Tag,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Job, JobCategory } from "../backend.d";
import { useGetJobCategories } from "../hooks/useQueries";
import { HeroScene } from "./HeroScene";

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
      "Our team personally reviews every application. Real humans evaluate your fit — no automated filters.",
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

function CategoryJobCard({
  job,
  onApply,
}: {
  job: Job;
  onApply: () => void;
}) {
  return (
    <div className="group p-4 rounded-xl bg-background/60 border border-border hover:border-primary/50 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="font-display font-bold text-sm text-foreground group-hover:text-accent-vivid transition-colors">
          {job.title}
        </p>
        <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
          {job.jobType}
        </span>
      </div>
      {job.location && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <MapPin className="w-3 h-3" />
          {job.location}
        </div>
      )}
      {job.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {job.description}
        </p>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={onApply}
        className="text-xs gap-1.5 h-7 hover:bg-accent/20 hover:border-accent/60 hover:text-accent-foreground"
      >
        Apply Now
        <ArrowRight className="w-3 h-3" />
      </Button>
    </div>
  );
}

function CategoryCard({
  category,
  onApply,
}: {
  category: JobCategory;
  onApply: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors duration-200"
    >
      <button
        type="button"
        className="w-full p-5 flex items-center justify-between gap-3 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-xl shrink-0">
            {category.icon || "💼"}
          </div>
          <div>
            <p className="font-display font-bold text-foreground">
              {category.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {category.jobs.length} open position
              {category.jobs.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="secondary"
            className="text-xs font-bold bg-primary/20 text-primary border-primary/30"
          >
            {category.jobs.length}
          </Badge>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && category.jobs.length > 0 && (
          <motion.div
            key="jobs"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 grid gap-3">
              {category.jobs.map((job, i) => (
                <CategoryJobCard
                  key={`${category.name}-${i}`}
                  job={job}
                  onApply={onApply}
                />
              ))}
            </div>
          </motion.div>
        )}
        {expanded && category.jobs.length === 0 && (
          <motion.div
            key="empty"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm text-muted-foreground text-center py-4">
              No open positions right now. Check back soon!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function JobCategoriesSection({
  onApply,
}: {
  onApply: () => void;
}) {
  const { data: categories, isLoading } = useGetJobCategories();

  return (
    <section className="py-20 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-accent-vivid" />
            <p className="text-accent-vivid text-sm font-bold tracking-widest uppercase">
              Browse by Category
            </p>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Explore Opportunities by Category
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl">
            Click a category to see all open roles. Find the perfect match for
            your skills.
          </p>
        </motion.div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div>
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!categories || categories.length === 0) && (
          <div
            data-ocid="categories.empty_state"
            className="border-2 border-dashed border-border rounded-2xl py-16 text-center"
          >
            <BriefcaseBusiness className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">
              No categories yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Job categories will appear here once they're added.
            </p>
          </div>
        )}

        {!isLoading && categories && categories.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <CategoryCard category={cat} onApply={onApply} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function LandingPage({ onNavigate, isAdmin }: LandingPageProps) {
  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-screen flex items-center border-b border-border">
        {/* 3D Canvas background */}
        <div className="absolute inset-0 z-0">
          <div className="hero-mesh absolute inset-0" />
          <HeroScene />
        </div>

        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 z-[1] bg-background/40" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-semibold tracking-wider uppercase mb-8 text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-vivid step-pulse" />
                Now Hiring — Open Positions Available
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[0.95] tracking-tight mb-6">
                One Step to
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.78 0.22 165), oklch(0.62 0.22 270))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Your Career
                </span>
              </h1>

              <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed mb-10 max-w-md">
                Apply for your dream role in minutes. Upload your resume, tell
                us about yourself, and our team will take it from there.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  data-ocid="landing.apply_button"
                  size="lg"
                  onClick={() => onNavigate("register")}
                  className="gap-2 font-bold text-base px-8 cta-glow transition-all duration-300"
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
                    className="gap-2 font-semibold text-base glass-card border-border/60 hover:border-primary/60"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Button>
                )}
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4 mt-10 pt-8 border-t border-border/50">
                <div className="flex -space-x-2">
                  {["SK", "MR", "AT", "JL"].map((initials) => (
                    <div
                      key={initials}
                      className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ring-2 ring-background"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {([1, 2, 3, 4, 5] as const).map((k) => (
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
                    <strong className="text-foreground">200+</strong> candidates
                    placed this year
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground/60" />
        </motion.div>
      </section>

      {/* ── Job Categories ───────────────────────────────────────────── */}
      <JobCategoriesSection onApply={() => onNavigate("register")} />

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
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[-50%] h-px bg-border" />
                )}
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-display text-4xl font-black text-primary/25 leading-none select-none">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-primary" />
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
                data-ocid="landing.why_apply_button"
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
                    className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/40 transition-colors"
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
                  data-ocid="landing.cta_apply_button"
                  size="lg"
                  onClick={() => onNavigate("register")}
                  className="gap-2 font-bold text-base px-8 border-0 transition-all duration-300"
                  style={{
                    backgroundColor: "oklch(var(--accent-vivid))",
                    color: "oklch(var(--accent-foreground))",
                    boxShadow: "0 0 24px oklch(0.78 0.22 165 / 0.5)",
                  }}
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
