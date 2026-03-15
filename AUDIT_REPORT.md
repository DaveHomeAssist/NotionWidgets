# NotionWidgets Audit Report

Date: 2026-03-14

## Executive Summary

`NotionWidgets` is a small catalog of self-contained HTML widgets for Notion embeds. The current architecture is appropriate for the scope:

- single-file widgets
- URL-parameter-driven configuration
- no backend
- no external JavaScript or CSS dependencies
- safe DOM rendering patterns in the interactive widget

The repository is in materially better shape than the earlier external audit suggested. The main risks are now accessibility, motion/UX polish, and long-term consistency of parameter parsing across widgets.

## Summary

- Total issues: 5
- Critical: 0
- High: 0
- Medium: 4
- Low: 1
- Estimated total hours: 15

## Findings

### 1. Interactive state is not fully exposed to assistive tech

- Category: Accessibility
- Severity: Medium
- Affected paths:
  - `client-approval.html`

The approval widget has strong visual interaction, but selected action state, transient errors, and success confirmation are not fully exposed to assistive technologies. The action buttons toggle visual state only, and the error/success surfaces are not implemented as clear live regions.

Recommended actions:

- Add `aria-pressed` to the three action buttons and keep it synchronized with selection state.
- Mark the error bar and success overlay with live-region semantics.
- Keep focus behavior explicit after validation failures and after reset.

Example:

```js
// Before
btn.classList.add('selected');

// After
btn.classList.add('selected');
btn.setAttribute('aria-pressed', 'true');
```

Estimated time: 3 hours

### 2. Animations do not respect reduced-motion preferences

- Category: UX
- Severity: Medium
- Affected paths:
  - `project-status.html`
  - `quest-log.html`
  - `client-approval.html`

All three widgets use visual motion such as count-up timers, shimmer, particles, badge pulses, or staged reveals. The presentation is strong, but there is no full reduced-motion fallback for users who opt out of animation.

Recommended actions:

- Add a `prefers-reduced-motion: reduce` CSS block for non-essential animations.
- Skip count-up and particle effects in JavaScript when reduced motion is requested.
- Render final values immediately when reduced motion is active.

Example:

```js
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  xpFill.style.width = xpPct + '%';
  xpCurrentEl.textContent = config.xp;
}
```

Estimated time: 4 hours

### 3. Validation and parsing logic is duplicated across widgets

- Category: Architecture
- Severity: Medium
- Affected paths:
  - `project-status.html`
  - `quest-log.html`
  - `client-approval.html`

The repo correctly uses URL parameters as the public configuration interface, but each widget reimplements its own parsing, clamping, token normalization, and fallback rules inline. This is acceptable for a small pack, but it raises drift risk as contracts evolve.

Recommended actions:

- Standardize a shared parsing pattern across widgets for arrays, clamping, token aliases, and defaults.
- If the single-file rule remains absolute, document the shared pattern clearly in the repo README and mirror it consistently.
- Add a small repo-level checklist for future widgets.

Estimated time: 3 hours

### 4. Client approval messaging still allows implicit target-origin fallback

- Category: Integration
- Severity: Medium
- Affected paths:
  - `client-approval.html`

The approval widget already validates `targetOrigin` far better than most embed tools, but it still falls back to `document.referrer` when the explicit param is absent. That is convenient, but less predictable than requiring a declared target for production embeds.

Recommended actions:

- Prefer explicit `targetOrigin` only for production embeds.
- Keep the current fallback only for local preview if needed.
- Update docs and examples to push the strict contract first.

Example:

```js
// Before
const raw = rawTargetOrigin || (document.referrer || '').trim();

// After
const raw = (P.get('targetOrigin') || '').trim();
```

Estimated time: 2 hours

### 5. Legacy delimited parameter formats add ongoing complexity

- Category: Code Quality
- Severity: Low
- Affected paths:
  - `project-status.html`
  - `quest-log.html`

Both widgets still support old comma-and-colon parameter formats alongside JSON array params. That backward compatibility is useful, but it keeps extra parsing branches and console warnings alive in the codepath.

Recommended actions:

- Keep legacy parsing for now, but mark a clear removal version in the README.
- Prefer JSON-only examples everywhere public.
- Remove legacy parsing after existing embeds are migrated.

Estimated time: 3 hours

## Quick Wins

- Add `prefers-reduced-motion` handling across all three widgets.
- Add `aria-pressed` and live-region semantics to `client-approval.html`.
- Make `targetOrigin` explicit-only in production examples and docs.
- Standardize one repo-wide URL param parsing pattern in `README.md`.

## Long-Term Improvements

- Build a small configurator page that generates valid embed URLs without changing the single-file widget architecture.
- Add a lightweight visual QA checklist for common Notion embed widths and light/dark color schemes.
- Add a small validation script that checks example URLs against documented widget contracts.

## Notes

This report supersedes the earlier external audit that referenced non-existent API integrations, missing folders, and unsupported asset-loading claims. The current repository does not show evidence of:

- exposed API keys
- external API fetches
- Google Fonts or third-party asset dependencies in shipped widget surfaces
- missing URL-parameter configuration support

The actual state of the repo is substantially healthier than that prior report implied.
