# Internal Developer Portal Plugin (Prototype)

This plugin provides a task-oriented Backstage Start experience focused on discoverability and clarity.

## UX rationale (high level)

- Task-first home: The default screen emphasizes "what users need to do" (find service, request access, create template) instead of product structure.
- Predictable navigation: Left IA groups use user-meaningful labels: Build & Run, Learn, Standards, Utilities.
- Fast orientation: Each page has a title, subtitle, breadcrumbs, and active nav state to answer "Where am I?".
- Guided empty states: Filtered pages include action-oriented empty messages.
- Progressive confidence: Getting started steps and Help menu reduce first-time friction.
- Real portal context: Services/APIs/Docs are loaded from Backstage Catalog API with mock fallback.
- Discoverability measurement: First-find telemetry captures whether users reach a destination within 30 seconds.

## Included pages

- Home / Start
- Service Catalog template page
- API Hub
- Docs Hub
- Tool Box
- Playlists
- Tech Radar

All data is mocked in `src/mockData.ts`.

Primary data source is Backstage APIs via `src/hooks/usePortalData.ts`.
Fallback mock data remains in `src/mockData.ts` when APIs are unavailable.

## Run in Backstage

1. Install dependencies from repo root:

```bash
yarn install
```

2. Start Backstage app from repo root:

```bash
yarn start
```

3. Open the new route:

- `/start` for Home / Start
- `/start/catalog`, `/start/apis`, `/start/docs`, `/start/toolbox`, `/start/playlists`, `/start/radar`

## Development notes

- The plugin follows Backstage frontend plugin conventions (`src/index.ts`, `src/plugin.ts`, `src/routes.ts`).
- A simple dev mode is provided via route-based rendering with mock data through `DevPortalRouter`.
- Accessibility basics included: semantic landmarks, aria labels for search and help, keyboard-focusable controls through MUI components.
- User signals are stored locally for prototype behavior:
	- recent visits: `idp.recent.v1`
	- pinned items: `idp.pinned.v1`
	- telemetry events: `idp.telemetry.v1`
- Storybook story files are included for home modules under `src/components/Home/*.stories.tsx`.
