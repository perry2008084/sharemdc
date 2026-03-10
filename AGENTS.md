# AGENTS.md - ShareMDC

Guidance for coding agents working in this repository.

## Project Summary

- **App type**: Markdown editor with live preview and shareable links.
- **Name**: ShareMDC (Share Markdown Content)
- **Tagline**: "Share AI content and Markdown with one click."
- **Backend**: Express 5 on Node.js, single entrypoint in `server.js`.
- **Frontend**: Vanilla JavaScript, browser globals, no bundler or framework.
- **Persistence**: SQLite via `better-sqlite3`, database file in `data/share.db`.
- **Rendering**: `marked` for Markdown and `DOMPurify` + `jsdom` for sanitization.
- **Localization**: UI defaults to Chinese and supports 7 languages in `public/i18n.js`.
- **Styling**: One shared stylesheet, theme-driven via CSS custom properties.
- **Analytics**: Optional Microsoft Clarity (enabled via CLARITY_ID env var).

## Rule Files

- `.cursor/rules/`: not present.
- `.cursorrules`: not present.
- `.github/copilot-instructions.md`: not present.
- Do not assume any extra editor-specific rules beyond this file.

## Repository Layout

```text
server.js           Express app, API routes, DB init, sanitization, static files
public/index.html   Editor page (with Clarity analytics placeholder)
public/share.html   Shared document viewer
public/app.js       Editor page behavior
public/share.js     Shared page behavior
public/i18n.js      Translation tables and language helpers
public/styles.css   Global styles and theme tokens
data/share.db       SQLite database file (gitignored)
design.md           Product and architecture notes
usage.md            Usage guide (English)
README.md           Project documentation (English)
LICENSE             MIT License
```

## Install / Run / Verify

```bash
npm install
npm run dev
npm start
node server.js
PORT=8080 npm start
curl http://localhost:3000/health
```

## Build / Lint / Test Reality

- Build step: none.
- Lint step: none configured.
- Formatter: none configured.
- Test runner: none configured.
- Existing scripts:
  - `npm run dev` -> `nodemon server.js`
  - `npm start` -> `node server.js`

## Single-Test Guidance

There are currently no tests to run. If you add a test runner, add an explicit
`test` script to `package.json` and document the single-test command.

```bash
# Vitest
npx vitest run path/to/file.test.js

# Jest
npx jest path/to/file.test.js

# If a package.json test script exists
npm test -- path/to/file.test.js
```

## Recommended Verification

- For server changes, run `npm start` and check `/health`.
- For API changes, exercise `POST /api/share`, `POST /api/preview`, and `GET /api/share/:id`.
- For UI changes, verify both `/` and `/s/<id>` in a browser.
- For theme or i18n changes, verify both pages because logic is duplicated.

## Architecture Notes

- `server.js` owns app boot, database setup, API routes, and static asset serving.
- The schema is created at startup with `CREATE TABLE IF NOT EXISTS`.
- Shared markdown is stored raw in SQLite and rendered through `/api/preview`.
- `/s/:id` serves `public/share.html`; the client then fetches content by ID.
- `public/app.js` and `public/share.js` intentionally duplicate some helpers.
- There is no shared frontend module system.

## JavaScript Style

- Use plain JavaScript only; do not add TypeScript or a build step unless requested.
- Server code uses CommonJS: `require(...)`.
- Client code runs directly in the browser and relies on globals like `window.I18n`.
- Prefer `const`, `let`, arrow functions, optional chaining, template literals, and `async/await`.
- Prefer explicit control flow and small helpers over abstraction-heavy patterns.

## Imports and File Structure

- Keep all `require()` calls at the top of server files.
- Order imports as: Node built-ins, third-party packages, local modules.

```javascript
const path = require("path");
const express = require("express");
const Database = require("better-sqlite3");
const { nanoid } = require("nanoid");
```

- In browser files, keep DOM references near the top.
- Keep initialization near the top and helper functions below when practical.

## Formatting

- Indentation: 2 spaces.
- Prefer double quotes for new or edited strings.
- Use semicolons consistently.
- Avoid trailing commas unless the surrounding file already uses them.
- Keep lines readable; there is no enforced max line length.

## Naming

- Use `camelCase` for variables, functions, and parameters.
- Constants are also typically `camelCase`, not `UPPER_SNAKE_CASE`.
- DOM element references usually end with `El`, for example `previewEl`.
- Keep route names and JSON field names aligned with the current API.

## Types and Data Handling

- There is no static typing; validate data at runtime.
- Validate request payloads with `typeof` checks before use.

```javascript
const content = typeof req.body?.content === "string" ? req.body.content : "";
```

- Treat DB rows and fetch results as potentially missing.
- Preserve existing API response names such as `createdAt`.

## Error Handling

- Use early returns for invalid input in Express handlers.
- Return JSON error payloads with meaningful HTTP status codes.
- Use `try/catch` around client `fetch()` flows and other async UI actions.
- Surface UI errors with existing patterns: DOM text updates or `alert()`.
- Log server-side operational failures with `console.error(...)`.

## Security and Persistence

- Do not bypass Markdown sanitization.
- Render with `marked.parse(...)` and sanitize with `DOMPurify.sanitize(...)`.
- Use parameterized SQLite queries via `db.prepare(...).run(...)` and `.get(...)`.
- Do not interpolate untrusted input into SQL or HTML.
- Respect the existing JSON body limit of `1mb` unless requirements change.
- SQLite access is synchronous through `better-sqlite3`.
- IDs are generated with `nanoid(10)`.
- Timestamps are stored as Unix milliseconds from `Date.now()`.

## Frontend and CSS Conventions

- Use `document.getElementById(...)` for key elements.
- Keep state lightweight and local.
- Theme selection is stored in `localStorage` under `themeColor` and `theme-color`.
- Language selection is stored in `localStorage` under `language`.
- When editing i18n behavior or UI copy, update both editor and share flows.
- Keep theme values in CSS custom properties such as `--bg`, `--panel`, and `--accent`.
- Preserve the current typography stack: Fraunces, Work Sans, Space Mono.
- Maintain mobile behavior at the existing `max-width: 768px` breakpoint.

## API Surface

- `POST /api/share` -> `{ id, url }`
- `POST /api/preview` -> `{ html }`
- `GET /api/share/:id` -> `{ content, createdAt }` or 404
- `GET /s/:id` -> shared viewer page
- `GET /health` -> service and database health payload

## Agent Change Guidance

- Prefer small, local edits that match the existing no-build architecture.
- Avoid introducing bundlers, frameworks, or TypeScript without explicit instruction.
- Be careful when refactoring shared theme logic because `public/app.js` and `public/share.js` intentionally mirror each other.
- If adding tests or linting, update `package.json` scripts and this file with exact commands.
- Do not commit `data/*.db`, `node_modules/`, secrets, or environment files.

## Known Gaps

- No automated tests currently protect routes or UI behavior.
- No lint or format automation exists.
- Frontend code contains duplicated theme and share logic across two pages.
- Microsoft Clarity analytics is optional and enabled via `CLARITY_ID` environment variable. If not set, the tracking script is completely removed from the page.
