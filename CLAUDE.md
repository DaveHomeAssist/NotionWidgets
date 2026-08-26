# CLAUDE.md

Inherits root rules from `/Users/daverobertson/Desktop/Code/AGENTS.md`.

## Project Overview

Collection of embeddable Notion widgets and workspace visualization tools. Includes a client approval widget, workspace map, project status board, quest log, and prompt library. Each widget is a self-contained HTML file designed for Notion embed blocks or standalone use.

## Stack

- Static HTML + inline CSS + inline JS per widget
- Engine directory for shared logic modules
- No build step, no bundler, no framework

## Key Decisions

- One HTML file per widget for isolated embedding
- Engine directory contains shared logic modules
- Maps directory contains visualization tools
- Each widget is fully self-contained and independently deployable

## Documentation Maintenance

- **Issues**: Track in the issue tracker table below
- **Session log**: Append to `/Users/daverobertson/Desktop/Code/95-docs-personal/today.csv` after each meaningful change

## Issue Tracker

| ID | Severity | Status | Title | Notes |
|----|----------|--------|-------|-------|
| 001 | P1 | closed | Client approval submit button allows duplicate submissions | Fixed: disable button immediately on click |
| 002 | P1 | closed | Workspace map nodeMap lookups crash on broken dataset refs | Fixed: null guards on all nodeMap lookups |
| 003 | P2 | closed | Workspace map innerHTML not fully sanitized | Fixed: sanitized SVG attributes |
| 004 | P2 | closed | All widgets missing aria-label on interactive elements | Fixed: added aria-labels to buttons, checkboxes, phase bars |
| 005 | P2 | closed | Workspace map external CDN scripts fail silently in CSP iframes | Fixed: added CDN load guards with error message fallback |
| 006 | P2 | closed | Quest log displays NaN if xp values are malformed | Fixed: Number.isFinite guard before rendering |
| 007 | P1 | closed | index.html links to notion-workspace-map.html but file is v2 | Fixed: corrected filename |
| 008 | P1 | closed | index.html emoji icons lack alt/aria-labels | Fixed: added role="img" and aria-label |
| 009 | P2 | closed | index.html section titles use div instead of h2 | Fixed: changed to semantic h2 |
| 010 | P2 | closed | index.html typo: "approve" should be "approvals" | Fixed |
| 011 | P2 | closed | index.html missing OG image and twitter image meta tags | Fixed |
| 012 | P1 | closed | project-status.html null deref in normalizeHexColor regex | Fixed: added null guard |
| 013 | P1 | closed | client-approval origin validation falls back to document.referrer | Fixed: require explicit targetOrigin param |
| 014 | P0 | closed | quest-log avatar param not length-validated | Fixed: slice to 2 chars |
| 015 | P1 | closed | quest-log streak chip null deref on getBoundingClientRect | Fixed: added null guard |
| 016 | P2 | closed | All widgets use 100vh which overflows in Notion iframes | Fixed: changed to min-height auto/100% |
| 017 | P2 | closed | Focus outlines use hardcoded colors instead of CSS variables | Fixed: changed to var(--accent) |
| 018 | P2 | closed | project-status.html missing dashboard landmark role | Fixed: added role="main" |
| 019 | P2 | closed | system-map innerHTML color injection in legend dots | Fixed: use style property instead of innerHTML |
| 020 | P1 | closed | Workspace map dagre.layout() crashes if CDN blocked | Fixed: added window.dagre guard |
| 021 | P2 | closed | parseInt calls missing radix parameter | Fixed: added base-10 radix |
| 022 | P2 | closed | client-approval config.round not sanitized | Fixed: parseInt + clamp |
| 023 | P1 | closed | pen-probe scroll verdict auto-passes cross-origin (fake green in Notion) | Fixed: gate verdict on canMeasureScroll (same-origin/top-level only), else neutral manual-judgment state |
| 024 | P2 | closed | pen-probe "sample rate" counts pointermove events, undercounts Pencil Hz | Fixed: sum getCoalescedEvents() samples over the 1s window |
| 025 | P2 | closed | pen-probe a11y: user-scalable=no, no live region, unlabeled canvas | Fixed: removed zoom lock, added role=status/aria-live, canvas aria-label |
| 026 | P1 | closed | sketch-canvas touch-action:none defeats "finger scrolls" in input=auto | Fixed: relax to touch-action:pan-y in auto mode (pen still preventDefaults) |
| 027 | P1 | closed | sketch-canvas emit() posts strokes+PNG to '*' on every action, ignores save=0 | Fixed: opt-in on save=1 only, post to explicit targetOrigin param, never wildcard |
| 028 | P2 | closed | sketch-canvas iPad clipboard paste fails (async ClipboardItem loses activation) | Fixed: construct ClipboardItem synchronously in gesture with a Blob promise |
| 029 | P2 | closed | sketch-canvas a11y: user-scalable=no, icon-only buttons unlabeled, unlabeled canvas | Fixed: removed zoom lock, added aria-labels + aria-hidden on decorative bg canvas |
| 030 | P3 | closed | sketch-canvas SIZE_STEPS could exceed size max 24; getBoundingClientRect per coalesced sample | Fixed: clamped max step to 24, cache stage rect once per pointermove |
| 031 | P0 | closed | graph-explorer crashes on load: layers derived from nodes before initialization (TDZ) | Fixed: moved layer palette derivation below nodes/edges parse (audit H-1) |
| 032 | P1 | closed | client-approval success overlay claimed team notification despite one-way postMessage with no receiver | Fixed: honest overlay copy; decision saved to localStorage with reload recovery and Copy summary for manual delivery (audit H-2) |
| 033 | P1 | closed | index.html + graph-explorer copy claimed live Notion workspace graph but widget ships demo architecture data | Fixed: copy now states demo data with nodes/edges URL params (audit H-3) |
| 034 | P1 | closed | client-approval targetOrigin=* wildcard let any embedding origin capture decision payloads | Fixed: getSafeTargetOrigin rejects '*'; explicit origin required (audit M-1) |

## Session Log

[2026-03-18] [NotionWidgets] [docs] Add AGENTS baseline
[2026-03-31] [NotionWidgets] [audit] Full 6-file publish-readiness audit — 22 issues identified and fixed
[2026-07-28] [NotionWidgets] [feasibility] Add pen-probe.html + sketch-canvas.html for Apple Pencil iPad probe; fixed 8 review issues (023-030) incl. probe false-pass and auto-mode scroll suppression; not yet linked from index.html pending on-device verification
[2026-08-26] [NotionWidgets] [audit-fix] Fix 2026-08-24 audit findings H-1/H-2/H-3/M-1 (issues 031-034): graph-explorer TDZ crash, durable client-approval decision record with honest messaging, truthful graph-explorer copy, reject wildcard targetOrigin
