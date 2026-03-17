# NotionWidgets

NotionWidgets is a small catalog of self-contained HTML widgets for Notion embeds. Each widget ships as a single file, is hosted on GitHub Pages, and is configured entirely with URL parameters so buyers can paste an embed URL directly into Notion without a build step or backend.

Live site: `https://davehomeassist.github.io/NotionWidgets/`

## Prompt library

An importable Prompt Lab pack for the NotionWidgets patch workflow lives at:

`prompt-library/notionwidgets-patch-workflows.prompt-library.json`

It mirrors the validated patch workflow prompts used across the Prompt Lab ecosystem, including:

- scoped validated patch passes
- prototype P1 stability sweeps
- single-file widget hardening

## Live widgets

| Widget | File | Live URL |
| --- | --- | --- |
| Project Status Dashboard | `project-status.html` | `https://davehomeassist.github.io/NotionWidgets/project-status.html` |
| Quest Log | `quest-log.html` | `https://davehomeassist.github.io/NotionWidgets/quest-log.html` |
| Client Approval Hub | `client-approval.html` | `https://davehomeassist.github.io/NotionWidgets/client-approval.html` |

## Product rules

These repo-level constraints are authoritative:

- Single self-contained HTML files only.
- No external JavaScript, external CSS, CDN assets, or Google Fonts in shipped surfaces.
- URL parameters are the public configuration interface.
- User-supplied content must be rendered safely with DOM APIs such as `createElement` and `textContent`.
- Token-based params must validate against allowlists and fall back silently to safe defaults.
- Widgets must remain usable inside Notion iframes at typical embed widths.
- Matching Notion templates must still function without a widget embed.

## Embed in Notion

1. Copy a widget URL or build one with query parameters.
2. In Notion, type `/embed`.
3. Paste the URL and confirm the embed.
4. Resize the block until the layout feels balanced for the page.

Widgets are optional enhancements. The surrounding Notion system should still work without them.

## Validation and safety

- JSON array params are preferred for structured data.
- Invalid tokens fall back to a documented default.
- Invalid JSON falls back to widget defaults where supported.
- User content is inserted with safe DOM APIs, not `innerHTML`.
- Widgets do not require API keys or a server.

## Widget contracts

### Project Status Dashboard

Live URL:

```text
https://davehomeassist.github.io/NotionWidgets/project-status.html
```

Example:

```text
https://davehomeassist.github.io/NotionWidgets/project-status.html?name=Website%20Redesign&client=Meridian%20Studios&status=in-progress&deadline=2026-04-30&phases=%5B%7B%22name%22%3A%22Discovery%22%2C%22pct%22%3A100%7D%2C%7B%22name%22%3A%22Design%22%2C%22pct%22%3A65%7D%2C%7B%22name%22%3A%22Launch%22%2C%22pct%22%3A10%7D%5D&stats=%5B%7B%22label%22%3A%22Tasks%22%2C%22value%22%3A%2218%2F24%22%2C%22color%22%3A%22on-track%22%7D%2C%7B%22label%22%3A%22Budget%22%2C%22value%22%3A%2272%25%22%2C%22color%22%3A%22warning%22%7D%5D
```

Parameters:

| Param | Type | Description |
| --- | --- | --- |
| `name` | string | Project name shown in the header. |
| `client` | string | Client or account name shown below the title. |
| `status` | string | Overall project state. |
| `deadline` | string | Date string used to calculate remaining days. |
| `phases` | JSON array | Array of `{name, pct}` objects. |
| `stats` | JSON array | Array of `{label, value, color}` objects. |
| `accent` | string | Optional hex accent color. Accepts `#RGB` or `#RRGGBB`. |

Accepted tokens:

| Field | Accepted values |
| --- | --- |
| `status` | `in-progress`, `completed`, `at-risk`, `paused` |
| `stats[].color` | `on-track`, `at-risk`, `warning`, empty string |

Validation notes:

- Empty or malformed phase arrays safely render as `0%` instead of producing `NaN`.
- `phases[].pct` is clamped to `0-100`.
- Invalid accent values are ignored silently; valid `#RGB` values are expanded to `#RRGGBB`.

Legacy notes:

- `phases` still accepts legacy comma-and-colon strings such as `Discovery:100,Design:65`.
- `stats` still accepts legacy comma-and-colon strings such as `Tasks:18/24:on-track`.

### Quest Log

Live URL:

```text
https://davehomeassist.github.io/NotionWidgets/quest-log.html
```

Example:

```text
https://davehomeassist.github.io/NotionWidgets/quest-log.html?title=Project%20Champion&class=Creative%20Director&avatar=%E2%9A%94%EF%B8%8F&level=7&xp=340&xpMax=500&streak=12&reward=Custom%20Title&quests=%5B%7B%22name%22%3A%22Finalize%20brand%20guidelines%22%2C%22xp%22%3A50%2C%22rarity%22%3A%22epic%22%2C%22done%22%3Atrue%7D%2C%7B%22name%22%3A%22Client%20presentation%20deck%22%2C%22xp%22%3A80%2C%22rarity%22%3A%22legendary%22%2C%22done%22%3Afalse%7D%5D&stats=%5B%7B%22icon%22%3A%22%E2%9A%A1%22%2C%22value%22%3A%2218%22%2C%22label%22%3A%22quests%20done%22%7D%2C%7B%22icon%22%3A%22%F0%9F%92%8E%22%2C%22value%22%3A%221240%22%2C%22label%22%3A%22total%20xp%22%7D%5D
```

Parameters:

| Param | Type | Description |
| --- | --- | --- |
| `title` | string | Main quest log title. |
| `class` | string | Secondary role or class label. |
| `avatar` | string | Emoji avatar shown in the hero block. |
| `level` | number | Level badge value. |
| `xp` | number | Current XP value. |
| `xpMax` | number | Maximum XP value for the bar. |
| `streak` | number | Streak counter value. |
| `nextReward` | string | Canonical next reward label shown beside the XP bar. |
| `quests` | JSON array | Array of `{name, xp, rarity, done}` objects. |
| `stats` | JSON array | Array of `{icon, value, label}` objects. |

Accepted tokens:

| Field | Accepted values |
| --- | --- |
| `quests[].rarity` | `common`, `rare`, `epic`, `legendary` |

Validation notes:

- `level` is clamped to `1-999`.
- `xp` is clamped to `0-999999`.
- `xpMax` is clamped to `1-999999`.
- `streak` is clamped to `0-99999`.
- `quests[].xp` is clamped to `0-99999`.
- `xp` is capped to `xpMax` before rendering the progress bar.
- `quests[].done` accepts boolean `true` and legacy string `"1"`.

Legacy notes:

- `quests` still accepts legacy comma-and-colon strings such as `Wireframes:30:rare:1`.
- `stats` still accepts legacy comma-and-colon strings such as `⚡:18:quests done`.
- `reward` is still accepted as a legacy fallback, but `nextReward` is canonical in v1.2.

### Client Approval Hub

Live URL:

```text
https://davehomeassist.github.io/NotionWidgets/client-approval.html
```

Example:

```text
https://davehomeassist.github.io/NotionWidgets/client-approval.html?title=Creative%20Review&subtitle=Website%20Redesign%20%E2%80%94%20Homepage&round=2&targetOrigin=https%3A%2F%2Fwww.notion.so&deliverables=%5B%7B%22name%22%3A%22Homepage%20mockup%22%2C%22type%22%3A%22design%22%2C%22status%22%3A%22approved%22%7D%2C%7B%22name%22%3A%22Copy%20%26%20headlines%22%2C%22type%22%3A%22copy%22%2C%22status%22%3A%22revisions%22%7D%5D&timeline=%5B%7B%22text%22%3A%22Round%201%20submitted%22%2C%22type%22%3A%22submitted%22%2C%22date%22%3A%22Mar%201%22%7D%2C%7B%22text%22%3A%22Revisions%20requested%20on%20hero%22%2C%22type%22%3A%22revisions%22%2C%22date%22%3A%22Mar%204%22%7D%5D
```

Parameters:

| Param | Type | Description |
| --- | --- | --- |
| `title` | string | Panel title. |
| `subtitle` | string | Context or deliverable subtitle. |
| `round` | string | Review round label shown in the badge. |
| `deliverables` | JSON array | Array of `{name, type, status}` objects. |
| `timeline` | JSON array | Array of `{text, type, date}` objects. |
| `targetOrigin` | string | Explicit `postMessage` target origin. Recommended for embeds. |

Accepted deliverable types:

`design`, `copy`, `dev`, `video`, `doc`, `motion`, `photo`, `brand`, `audio`

Accepted deliverable statuses:

`approved`, `revisions`, `pending`, `restart`

Accepted timeline types:

`approved`, `revisions`, `pending`, `submitted`, `restart`

Compatibility aliases:

| Legacy value | Canonical v1.2 value |
| --- | --- |
| `revision` | `revisions` |
| `rejected` | `restart` |
| `active` | `submitted` |
| `completed` | `approved` |
| `document` | `doc` |

Interactive decision payload:

- The widget emits a `postMessage` payload with `type: "approval-submission"`.
- Canonical `action` values are `approve`, `revisions`, and `restart`.
- `targetOrigin` should be supplied explicitly for predictable iframe integrations.

## No Widget Mode

These widgets are enhancements, not prerequisites. Any Notion template sold with them should remain useful if the embed is removed, fails to load, or is intentionally omitted.

## v1.2 hardening notes

- `client-approval.html` now uses a documented canonical token contract with legacy aliases normalized safely.
- `client-approval.html` no longer depends on Google Fonts.
- `project-status.html` now normalizes accent colors safely, clamps phase values, and guards empty phase arrays.
- `quest-log.html` now treats `nextReward` as canonical, keeps `reward` as a legacy fallback, and clamps numeric inputs.
- The landing page is aligned with the repo contract so the repo is understandable without external context.
- Legacy delimited array parsing remains in `project-status.html` and `quest-log.html` for backward compatibility.

## Known follow-up items outside this pass

- `project-status.html` and `quest-log.html` were hardened locally in this pass but still warrant a browser check at typical Notion embed widths.
