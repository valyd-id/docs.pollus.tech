#!/usr/bin/env node
// Docs corpus generator — environment-parameterized.
//
// WHY: the agent-readable corpus (`llms.txt`, `llms-full.txt`, `sitemap.xml`,
// `robots.txt`, and the `docs/`+`verify/` Markdown) had service hostnames baked
// in as flat text. Switching environments meant a ~660-occurrence find/replace
// across 24 files — error-prone and easy to forget (see plan/DOCS-GENERATOR-PLAN.md).
//
// WHAT: the curated corpus lives in `docs-content/` with hostnames replaced by
// `{{TOKEN}}` placeholders. This script injects the real hosts from config and
// writes the served files into `public/`. A host change is now ONE env var.
//
// The prose is NOT regenerated from React components (the audit's instruction is
// "do not rewrite this content"); only hostnames are templated.
//
// SOURCE OF TRUTH: the same `VITE_*` env vars the React app reads via
// src/lib/api-config.ts + src/lib/verify-config.ts. A single `.env` drives both
// the app build and this generator, so they can never disagree on hosts.
//
// Usage:
//   node scripts/docs-gen/generate.mjs        # uses .env / defaults
//   DOCS_BASE_URL=https://docs.valyd.id node scripts/docs-gen/generate.mjs
// Wired into the build via the `prebuild` script, so `vite build` always
// regenerates the corpus first.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const SRC_DIR = path.join(ROOT, "docs-content");
const OUT_DIR = path.join(ROOT, "public");

// ---------------------------------------------------------------------------
// 1. Load .env (if present) the way Vite does, WITHOUT clobbering real env vars.
// ---------------------------------------------------------------------------
async function loadDotEnv(env) {
  try {
    const raw = await fs.readFile(path.join(ROOT, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m || line.trim().startsWith("#")) continue;
      const key = m[1];
      let val = m[2].trim().replace(/^['"]|['"]$/g, "");
      if (!(key in env)) env[key] = val; // real process.env wins
    }
  } catch {
    /* no .env — fall back to defaults */
  }
  return env;
}

// Reduce a configured URL to the bare host the corpus templates expect
// (`https://idp.valyd.id/x` -> `idp.valyd.id`). Tokens replace bare hosts; the
// surrounding `https://` and path suffixes stay literal in the source.
const bareHost = (url) => url.replace(/^[a-z]+:\/\//i, "").replace(/\/.*$/, "").replace(/\/+$/, "");

// Resolve one host: explicit bare var (CLI override) > VITE_ var (shared .env) > default.
const pick = (env, name, def) => env[name] ?? env[`VITE_${name}`] ?? def;

async function main() {
  const env = await loadDotEnv({ ...process.env });

  // Defaults = the current production-facing corpus. Verify is MERGED INTO THE IDP, so
  // VERIFY_BASE_URL is an idp.* host — the old verify.* hosts are retired (a 301 on a POST
  // can drop the body, so they must never be advertised).
  const TOKENS = {
    DOCS_BASE_URL: bareHost(pick(env, "DOCS_BASE_URL", "https://docs.valyd.id")),
    VERIFY_BASE_URL: bareHost(pick(env, "VERIFY_BASE_URL", "https://idp.valyd.id")),
    IDP_BASE_URL: bareHost(pick(env, "IDP_BASE_URL", "https://idp.valyd.id")),
    DEV_PORTAL_URL: bareHost(pick(env, "DEV_PORTAL_URL", "https://dev.valyd.id")),
  };

  const files = await walk(SRC_DIR);
  if (files.length === 0) throw new Error(`No source files found in ${SRC_DIR}`);

  let written = 0;
  for (const abs of files) {
    const rel = path.relative(SRC_DIR, abs);
    let text = await fs.readFile(abs, "utf8");

    // Inject hosts.
    for (const [token, host] of Object.entries(TOKENS)) {
      text = text.split(`{{${token}}}`).join(host);
    }

    // Fail loudly on any unresolved placeholder — a typo'd token must not ship.
    const leftover = text.match(/\{\{[A-Z_]+\}\}/g);
    if (leftover) {
      throw new Error(`Unresolved token(s) in ${rel}: ${[...new Set(leftover)].join(", ")}`);
    }

    const dest = path.join(OUT_DIR, rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, text);
    written++;
  }

  // Guardrail: no OTHER environment's hosts may leak into the output. Every host must come from
  // the tokens above, so a build for one env can never ship another env's URLs.
  //
  // `pollus.online` used to be asserted absent unconditionally, on the belief it was a dead domain.
  // It is not — it is STAGING (dev = *.pollus.tech, staging = *.pollus.online, prod = *.valyd.id).
  // So a staging build injected its own correct hosts and then failed its own check. Compare
  // against what this build actually targets rather than hardcoding one domain as dead.
  const targeted = Object.values(TOKENS);
  for (const domain of ["pollus.tech", "pollus.online", "valyd.id", "valyd.work"]) {
    const isThisEnv = targeted.some((h) => String(h).endsWith(domain));
    if (!isThisEnv) await assertAbsent(domain);
  }

  // Guardrail: the retired standalone Verify host + its dashboard must never reappear.
  // Verify runs on the IdP, and the dev portal is the one console.
  // NOTE: this asserts the RETIRED host is absent. It must never be rewritten to the
  // current host by a domain migration — that inverts the check into "the host we
  // actually target must not appear", which fails every build.
  await assertAbsent("verify.pollus.tech");
  await assertAbsent("verify.valyd.work");
  await assertAbsent("/verify/dashboard");

  console.log(`docs-gen: wrote ${written} files to public/`);
  console.log("docs-gen: hosts ->");
  for (const [k, v] of Object.entries(TOKENS)) console.log(`  ${k.padEnd(16)} ${v}`);
}

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(abs)));
    else out.push(abs);
  }
  return out;
}

async function assertAbsent(needle) {
  const files = await walk(SRC_DIR);
  for (const abs of files) {
    const rel = path.relative(SRC_DIR, abs);
    const dest = path.join(OUT_DIR, rel);
    const text = await fs.readFile(dest, "utf8");
    if (text.includes(needle)) {
      throw new Error(`Output ${rel} still contains "${needle}" — check your env config`);
    }
  }
}

main().catch((err) => {
  console.error(`docs-gen FAILED: ${err.message}`);
  process.exit(1);
});
