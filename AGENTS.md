# Agent instructions — ats-cv

## What this repo is

A small **ATS-oriented résumé** pipeline: structured data in JSON is compiled into a single **self-contained HTML** file (embedded CSS, print-friendly). There is no framework; the build script is plain Node.js (CommonJS).

## Source of truth

| File | Role |
|------|------|
| `resume.json` | **Edit content here** — name, roles, bullets, skills, etc. |
| `build.js` | Template, layout, escaping, and CSS; writes `index.html`. |
| `index.html` | **Generated output** — do not hand-edit for content; it is overwritten by `node build.js`. |

## Build

From the repo root:

```bash
node build.js
```

Requires `resume.json` to exist. Success prints a short confirmation and refreshes `index.html`.

## `resume.json` shape

All top-level fields except those noted are optional for rendering (empty arrays / missing sections are skipped).

- **`name`** (string): Full name; used in `<title>` and header.
- **`title`** (string, optional): Job headline under the name.
- **`contact`** (object, optional):
  - `location`, `email`, `phone` — plain text; `email` becomes a `mailto:` link.
  - `linkedin`, `github`, `portfolio` — host/path only (no `https://`); the script prefixes `https://` and uses fixed link labels (“LinkedIn”, “GitHub”, “Portfolio”). Use `null` to omit a slot.
- **`summary`** (string): Professional summary paragraph.
- **`experience`** (array): Each item:
  - `role`, `company`, `startDate`, `endDate` (strings)
  - `location` (optional string)
  - `bullets` (array of strings)
- **`education`** (array): Each item: `degree`, `institution`, `graduationDate`; `location` optional.
- **`skills`** (array of strings): Renders as a two-column bullet list.
- **`techStack`** (array of strings): Renders as tags.
- **`certifications`** (array): Each item: `name`, `issuer`; `dateIssued` optional.
- **`languages`** (array): Each item: `name`, `level`.

## Security and privacy

`resume.json` may contain **PII** (email, phone, links). Treat edits as sensitive; do not paste real contact data into public issues or logs unnecessarily.

## Implementation notes for agents

- **Escaping**: `build.js` uses `esc()` for HTML entity encoding on all user-facing strings. If you add new fields or HTML interpolation, route text through `esc()` unless you intentionally output trusted markup.
- **Styling**: Inline `<style>` in the generated document is defined inside `build.js`. Layout tweaks belong there (or in a future extracted CSS file if the project evolves).
- **Scope**: Prefer changing `resume.json` for copy updates. Change `build.js` only when sections, structure, or presentation need to change.
- **Tests / package manager**: This workspace may not define `package.json` or tests; do not assume `pnpm test` unless the user adds that tooling.

## Suggested workflow for changes

1. Update `resume.json` (or extend schema + builders in `build.js`).
2. Run `node build.js`.
3. Open `index.html` in a browser or print to PDF for output review.
