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

## Session Log

[2026-03-18] [NotionWidgets] [docs] Add AGENTS baseline
[2026-03-31] [NotionWidgets] [audit] Full 6-file publish-readiness audit — 22 issues identified and fixed
