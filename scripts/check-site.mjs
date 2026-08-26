#!/usr/bin/env node
// Static site checks for NotionWidgets. No dependencies; run with: node scripts/check-site.mjs
//
// Gates (audit M-3): every deploy must pass before Pages publishes.
//   1. Every JSON file under maps/ parses.
//   2. maps/manifest.json ids each have dataset.json + presentation.json on disk.
//   3. Public-data guard (audit M-2): no live Notion page URLs in published datasets.
//   4. Every root widget HTML has a doctype, a <title>, and a closing </html>.
//   5. Every local href/src referenced by root HTML files resolves to a real file.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// 1 + 3. Maps JSON must parse and must not leak private Notion identifiers.
const mapsDir = join(root, "maps");
const mapJsonFiles = existsSync(mapsDir)
  ? walk(mapsDir).filter((f) => f.endsWith(".json"))
  : [];
if (mapJsonFiles.length === 0) errors.push("maps/: no JSON datasets found");
for (const file of mapJsonFiles) {
  const rel = file.slice(root.length + 1);
  let raw;
  try {
    raw = readFileSync(file, "utf8");
    JSON.parse(raw);
  } catch (err) {
    errors.push(`${rel}: invalid JSON (${err.message})`);
    continue;
  }
  if (/notion\.so\//i.test(raw) || /notion\.site\//i.test(raw)) {
    errors.push(`${rel}: contains a Notion page URL — published datasets must not carry live workspace identifiers`);
  }
}

// 2. Manifest ids must map to complete dataset directories.
const manifestPath = join(mapsDir, "manifest.json");
if (existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    for (const map of manifest.maps || []) {
      for (const required of ["dataset.json", "presentation.json"]) {
        if (!existsSync(join(mapsDir, map.id, required))) {
          errors.push(`maps/manifest.json: id "${map.id}" is missing maps/${map.id}/${required}`);
        }
      }
    }
  } catch {
    /* parse failure already reported above */
  }
} else {
  errors.push("maps/manifest.json: file missing");
}

// 4 + 5. Root widget HTML sanity and internal link integrity.
const htmlFiles = readdirSync(root).filter((f) => f.endsWith(".html"));
if (htmlFiles.length === 0) errors.push("no root HTML widgets found");
for (const file of htmlFiles) {
  const html = readFileSync(join(root, file), "utf8");
  if (!/^\s*<!doctype html/i.test(html)) errors.push(`${file}: missing <!DOCTYPE html>`);
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${file}: missing <title>`);
  if (!/<\/html>\s*$/i.test(html)) errors.push(`${file}: missing closing </html>`);

  for (const match of html.matchAll(/(?:href|src)\s*=\s*"([^"]+)"/g)) {
    const target = match[1];
    if (/^(https?:|\/\/|#|mailto:|data:|javascript:|tel:)/i.test(target)) continue;
    if (target.includes("${")) continue; // dynamic reference inside inline JS — not statically checkable
    const localPath = target.split("#")[0].split("?")[0];
    if (!localPath) continue;
    if (!existsSync(join(root, localPath))) {
      errors.push(`${file}: local reference "${target}" does not resolve to a file`);
    }
  }
}

if (errors.length > 0) {
  console.error(`check-site: ${errors.length} problem(s) found\n`);
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}
console.log(`check-site: OK — ${htmlFiles.length} HTML pages, ${mapJsonFiles.length} map JSON files, links and datasets clean`);
