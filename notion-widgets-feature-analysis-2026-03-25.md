# Notion Widgets -- Feature Analysis

**Date:** 2026-03-25
**Scope:** All HTML widgets, engine/, maps/, and prompt-library in notion-widgets

---

## Summary Table

| Feature | Status | Data Source / Persistence | Critical Gap |
|---|---|---|---|
| Landing page / widget gallery | Complete | Static HTML (index.html) | None |
| Client Approval widget | Complete | URL params + postMessage to parent | Duplicate submission possible (issue #001) |
| Quest Log widget | Complete | URL params (JSON or legacy delimited) | NaN display if xp malformed (issue #006) |
| Project Status Dashboard widget | Complete | URL params (JSON or legacy delimited) | None |
| Workspace Map v2 (D3/Dagre graph) | Complete | JSON dataset.json + presentation.json | nodeMap crash on broken refs (issue #002) |
| System Map (NotionWidgets topology) | Complete | Hardcoded SVG topology | None |
| Map pack manifest system | Complete | maps/manifest.json | Shared with graph-explorer codebase |
| Schema validation engine | Complete | engine/validate.js | Same validator as graph-explorer |
| URL parameter configuration | Complete | URLSearchParams parsing per widget | No parameter documentation in UI |
| Dark/light mode (auto) | Complete | prefers-color-scheme media query | No manual toggle |
| Responsive design | Complete | Flexbox layouts, overflow-y:auto | None |
| Accessibility (focus-visible) | Partial | focus-visible outlines on interactive elements | Missing aria-labels on action buttons (issue #004) |
| Staggered entry animations | Complete | CSS @keyframes with animation-delay | None |
| Notion embed compatibility | Complete | Self-contained HTML files | CDN scripts may be blocked by CSP (issue #005) |
| Prompt library | Complete | JSON prompt definitions | None |

---

## Detailed Feature Analysis

### 1. Client Approval Widget

**Problem solved:** Enable client stakeholders to review deliverables and submit approval decisions (Approve, Revisions, Restart) directly within a Notion embed, without leaving the workspace.

**Implementation:** `client-approval.html` is a self-contained widget (~500 lines) with three-button decision UI, optional feedback textarea, deliverable checklist, timeline history, and success overlay. Configuration is entirely via URL parameters: title, subtitle, round number, deliverables (JSON array), and timeline entries. On submit, the widget fires a `postMessage` to the parent frame with the decision, feedback text, and timestamp.

**Files:** `client-approval.html`

**Tradeoffs:** The postMessage approach is framework-agnostic and works in any iframe host. However, there is no submission confirmation from the parent -- the widget shows a success overlay immediately on click without waiting for acknowledgment. There is no debounce or mutex on the submit button, so rapid clicks can fire multiple postMessages (issue #001).

**Limitations:** No data persistence -- if the page reloads, the decision is lost. The widget assumes the parent frame is listening for postMessage events; in standalone mode, submissions go nowhere.

### 2. Quest Log Widget

**Problem solved:** Gamify task tracking with XP, levels, streaks, and rarity-tagged quests to make project progress visible and motivating in a Notion embed.

**Implementation:** `quest-log.html` renders an RPG-style quest panel with avatar, level badge, XP bar (animated fill), stat chips, and a scrollable quest list. Quests have name, xp value, rarity (common/rare/epic/legendary), and done state. All data comes from URL parameters as JSON arrays (with a legacy colon-delimited fallback). Completing a quest triggers a particle animation and XP recalculation.

**Files:** `quest-log.html`

**Tradeoffs:** The widget is purely presentational -- it displays the state encoded in the URL but does not persist changes. Checking off a quest triggers a visual animation but the URL does not update, so refreshing the page resets all state. This is intentional for Notion embeds where the URL is the source of truth, but it means the widget cannot be used as a standalone task tracker.

**Limitations:** XP values that are non-numeric or exceed bounds are clamped via `clampNumber()`, but the stat chips parse display values from URL params without validation, risking NaN display (issue #006).

### 3. Project Status Dashboard Widget

**Problem solved:** Display project progress with a visual ring chart, phase breakdown, and key stats in a compact format suitable for Notion embeds.

**Implementation:** `project-status.html` renders a circular SVG progress ring (animated stroke-dashoffset), stat rows, and a phase list with per-phase progress bars. Configuration via URL params: project name, client, status (in-progress/completed/at-risk/paused), deadline, phases (JSON array with name + pct), stats (JSON array with label + value + color), and optional custom accent color (hex).

**Files:** `project-status.html`

**Tradeoffs:** The ring chart percentage is computed as the average of all phase percentages, which is a reasonable default but may not match how teams weight phases. The accent color is user-customizable via URL param with proper hex validation and derived glow color.

### 4. Workspace Map v2 (D3/Dagre Graph Viewer)

**Problem solved:** Visualize the Notion workspace structure as an interactive node graph with pan, zoom, search, filtering, and detail inspection.

**Implementation:** `notion-workspace-map-v2.html` is a full graph explorer (~1200 lines) built with D3.js + Dagre for layout. It loads dataset.json and presentation.json from the maps/ directory, constructs an adjacency graph, and renders nodes with type-based coloring, edge styles, and a detail panel. Features include search, layer filtering, focus modes, heatmap toggle, and an impact table showing highest-degree nodes.

**Files:** `notion-workspace-map-v2.html`, `maps/notion-workspace/dataset.json`, `maps/notion-workspace/presentation.json`

**Tradeoffs:** This is essentially a precursor to the standalone Graph Explorer project. It shares the same maps directory and validation engine but is less feature-rich (no path finding, no undo/redo, no themes). The D3 and Dagre libraries are loaded from CDN, which means the widget fails silently in Notion embeds if CSP blocks external scripts (issue #005).

**Limitations:** innerHTML rendering uses `esc()` for labels but not all computed SVG attributes (issue #003). The nodeMap lookups crash without null guards when dataset references are broken (issue #002).

### 5. System Map (NotionWidgets Topology)

**Problem solved:** Self-documenting architecture visualization showing how the NotionWidgets project components relate to each other.

**Implementation:** `notionwidgets-system-map.html` renders a fixed topology of the widget ecosystem using the same dark-panel visual language. Unlike the workspace map, this uses a hardcoded node/edge structure rather than loading from JSON files.

### 6. URL Parameter Configuration System

**Problem solved:** Enable zero-backend widget customization by encoding all display data in the URL itself, making each widget fully self-contained and embeddable without server infrastructure.

**Implementation:** All widgets parse `URLSearchParams` at load time. Data parameters accept JSON arrays (preferred) or legacy colon-delimited strings (with deprecation warnings). Default values are provided for demo mode. Validation includes type checking, clamping numeric ranges, and sanitizing enum values (e.g., rarity types, status colors).

**Tradeoffs:** URL-based configuration means widgets are stateless and portable but limited by URL length constraints. Complex configurations with many deliverables or quests may exceed browser URL limits (~2000 characters). No URL builder UI exists to help users construct parameter strings.

---

## Top 3 Priorities

1. **Add debounce/mutex to Client Approval submit (issue #001).** This is a P1 bug -- rapid clicks fire multiple postMessages, which could create duplicate approval records in the parent system. A simple boolean flag or button disable after first click would resolve it.

2. **Add null guards to Workspace Map nodeMap lookups (issue #002).** Another P1 -- broken dataset references cause a crash rather than a graceful degradation. Adding `nodeMap[id]?.label` guards prevents the entire map from failing on a single bad reference.

3. **Add aria-labels to all interactive elements (issue #004).** The action buttons in Client Approval have aria-labels, but quest checkboxes, phase bars, and other interactive elements across widgets lack them. A single pass to add descriptive labels would significantly improve screen reader support.
