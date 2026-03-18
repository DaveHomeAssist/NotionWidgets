# NotionWidgets Audit Report

Date: 2026-03-18

## Executive Summary

`NotionWidgets` is in better shape than it was on March 14.

The repo now has:

- the four shipped widgets
- the March 18 UX/UI audit in [docs/UX_AUDIT_2026-03-18.md](docs/UX_AUDIT_2026-03-18.md)
- a hardening pass shipped in commit `7e60074`

That hardening pass closed the most immediate reliability and safety issues:

- duplicate submit protection in `client-approval.html`
- stale `nodeMap` guards in `notion-workspace-map.html`
- sanitization for computed map colors, dash arrays, and external links
- improved ARIA state for approval actions, map controls, and project phase progress
- explicit CSP/CDN fallback messaging for blocked D3/Dagre loads
- finite numeric parsing for Quest Log XP fields

The repo is now safer and more internally consistent, but it is not "done." The biggest remaining gap is still product-level contract clarity: three widgets are truly self-contained single-file embeds, while the workspace map is a larger interactive application with runtime dataset loads and CDN-backed rendering dependencies.

## Current Status

- Total issues: 3
- Critical: 0
- High: 1
- Medium: 2
- Estimated total hours: 8-12

## Closed Since March 14

### 1. Client Approval duplicate submission

- Status: Fixed
- File:
  - `client-approval.html`

The submit action now uses an in-flight guard in addition to the disabled button state, which closes the rapid-click duplicate `postMessage` window.

### 2. Workspace Map stale node crashes

- Status: Fixed
- File:
  - `notion-workspace-map.html`

Stale `selectedId`, `focusNode`, and path targets are now normalized through guard helpers before render and URL restore paths use safe lookups.

### 3. Workspace Map attribute sanitization gaps

- Status: Fixed
- File:
  - `notion-workspace-map.html`

Computed colors, dash arrays, and outbound links are now sanitized before they reach SVG/HTML attributes.

### 4. Accessibility semantics on interactive controls

- Status: Fixed
- Files:
  - `client-approval.html`
  - `notion-workspace-map.html`
  - `project-status.html`

Approval buttons now expose `aria-pressed`, the error bar is a live region, map toggles expose pressed state, and project phases now expose progress semantics.

### 5. Quest Log malformed XP handling

- Status: Fixed
- File:
  - `quest-log.html`

The widget now uses explicit finite-number parsing instead of relying on loose `parseInt(...) || fallback` behavior.

## Remaining Findings

### 1. Workspace Map still breaks the repo's clean "single-file, no external dependencies" story

- Category: Architecture
- Severity: High
- Affected path:
  - `notion-workspace-map.html`

The new fallback message is the correct defensive move, but it does not solve the underlying contract mismatch. The graph explorer still loads D3 and Dagre from CDN and fetches external JSON map packs at runtime. That is acceptable technically, but it is not the same deployment model as the other three widgets.

Recommended action:

- Decide one of these explicitly:
  - keep the workspace map in this repo, but document it as an exception
  - move the map into a clearly separate "interactive explorer" category
  - localize dependencies and remove the exception entirely

### 2. Reduced-motion support is still missing across the smaller widgets

- Category: Accessibility
- Severity: Medium
- Affected paths:
  - `project-status.html`
  - `quest-log.html`
  - `client-approval.html`

The widgets still animate count-ups, shimmer, particles, badge pulses, and staged reveals without a `prefers-reduced-motion` escape hatch.

Recommended action:

- add `prefers-reduced-motion` CSS
- skip timer/count-up effects in JS when reduced motion is requested
- render final values immediately

### 3. The product still lacks a non-technical embed configurator

- Category: Usability
- Severity: Medium
- Affected paths:
  - `index.html`
  - `README.md`

The widgets are still configured by hand-built query strings. That is fine for the author and hostile for everyone else.

Recommended action:

- build a small URL generator surface
- keep it static and local, no backend needed
- output validated embed URLs for each widget

## Quick Wins

- Add reduced-motion handling to the three smaller widgets.
- Clarify the workspace-map exception in `README.md`.
- Add a simple widget URL builder to `index.html` or as a separate helper page.

## Notes

This report supersedes the older March 14 status summary.

For the blunt file-by-file read, use:

- [docs/UX_AUDIT_2026-03-18.md](docs/UX_AUDIT_2026-03-18.md)

For the shipped hardening baseline, use:

- commit `7e60074` `Harden widgets and add UX audit`
