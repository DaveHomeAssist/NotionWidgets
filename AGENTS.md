# AGENTS.md

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

## Issue Tracker

| ID | Severity | Status | Title | Notes |
|----|----------|--------|-------|-------|
| 001 | P1 | open | Client approval submit button allows duplicate submissions | No debounce mutex; rapid clicks can fire multiple postMessages |
| 002 | P1 | open | Workspace map nodeMap lookups crash on broken dataset refs | No null guard on nodeMap[id].label when node missing from data |
| 003 | P2 | open | Workspace map innerHTML not fully sanitized | esc() used for labels but not for all computed SVG attributes |
| 004 | P2 | open | All widgets missing aria-label on interactive elements | Action buttons, quest checkboxes, and phase bars lack AT labels |
| 005 | P2 | open | Workspace map external CDN scripts fail silently in CSP iframes | D3 and Dagre loaded from cdnjs with no fallback if blocked |
| 006 | P2 | open | Quest log displays NaN if xp values are malformed | No Number.isFinite check before rendering accumulated XP |

## Session Log

[2026-03-18] [NotionWidgets] [docs] Add AGENTS baseline