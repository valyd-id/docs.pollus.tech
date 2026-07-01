import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Fingerprint, ShieldCheck, Stethoscope } from "lucide-react";
import { GlobalNav } from "@/components/GlobalNav";
import { TryApisContent } from "@/components/docs/sandbox/TryApisContent";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 26 } },
};

const JOBS = [
  {
    key: "id",
    icon: Fingerprint,
    eyebrow: "Valyd ID",
    title: "Sign in with Valyd",
    description:
      "Add SSO with verified identities to your app. OAuth 2.0 and OIDC, with license and credential scopes built in.",
    href: "/docs",
    cta: "Read the ID docs",
    accent: "from-primary/10 to-transparent border-primary/20 hover:border-primary/50",
    iconBg: "bg-primary/10 text-primary",
    available: true,
  },
  {
    key: "verify",
    icon: ShieldCheck,
    eyebrow: "Valyd Verify",
    title: "Verify your users",
    description:
      "KYC, document checks, and liveness detection. Hosted flows or standalone API calls — your integration, your UX.",
    href: "/verify",
    cta: "Read the Verify docs",
    accent: "from-emerald-50 to-transparent border-emerald-200/60 hover:border-emerald-400/60",
    iconBg: "bg-emerald-100 text-emerald-700",
    available: true,
  },
  {
    key: "evv",
    icon: Stethoscope,
    eyebrow: "Valyd Verify · EVV",
    title: "Electronic Visit Verification",
    description:
      "Prove the right clinician reached the right home — identity, live license, face match, and geolocation. Hosted or Core APIs, with a live demo.",
    href: "/evv",
    cta: "EVV quickstart + live demo",
    accent: "from-sky-50 to-transparent border-sky-200/60 hover:border-sky-400/60",
    iconBg: "bg-sky-100 text-sky-700",
    available: true,
  },
] as const;

const Landing = () => (
  <div className="min-h-screen bg-background">
    <GlobalNav product="home" />

    {/* Hero + job tiles */}
    <section className="max-w-5xl mx-auto px-6 pt-16 pb-14 sm:pt-20 sm:pb-16">
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="max-w-2xl"
      >
        <motion.p
          variants={itemVariants}
          className="text-xs font-semibold uppercase tracking-widest text-primary mb-3"
        >
          Valyd Developer Docs
        </motion.p>
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground"
        >
          Build identity into your product
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl"
        >
          Two APIs. One developer experience. Pick what your app needs and start building in minutes.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="mt-10 grid gap-4 sm:grid-cols-3"
      >
        {JOBS.map((job) => {
          const Icon = job.icon;
          const inner = (
            <motion.div
              variants={itemVariants}
              className={cn(
                "group relative flex flex-col rounded-2xl border bg-gradient-to-br p-6 transition-all",
                job.accent,
                job.available
                  ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                  : "opacity-70 cursor-default"
              )}
            >
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-4", job.iconBg)}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                {job.eyebrow}
              </p>
              <h2 className="text-lg font-semibold text-foreground">{job.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                {job.description}
              </p>
              <div
                className={cn(
                  "mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-all",
                  job.available
                    ? "text-primary group-hover:gap-2.5"
                    : "text-muted-foreground"
                )}
              >
                {job.cta}
                <ArrowRight className="h-4 w-4" />
              </div>
            </motion.div>
          );

          return job.available ? (
            <Link key={job.key} to={job.href!} className="block">
              {inner}
            </Link>
          ) : (
            <div key={job.key}>{inner}</div>
          );
        })}
      </motion.div>
    </section>

    {/* Embedded API sandbox — same content as /sandbox but no standalone nav */}
    <TryApisContent />
  </div>
);

export default Landing;
