# NER-LINK AI

NER-LINK AI is a logistics accessibility intelligence console for monitoring essential-goods movement, field incidents, weather risk, and safer route decisions across North Eastern India.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ner-link-ai` — React/Vite web app with the public entry page, Clerk-ready auth routes, protected operations shell, dashboard, vehicles, incidents, route desk, reports, and settings.
- `artifacts/api-server` — Express API with dashboard, vehicle, incident, route, weather, alert, and report endpoints under `/api`.
- `lib/api-spec/openapi.yaml` — source of truth for the API contract; generated hooks and Zod schemas live in the shared API libraries.
- `lib/db/src/schema/index.ts` — Drizzle schema for vehicle and incident persistence foundations.

## Architecture decisions

- Use Clerk as the authentication boundary; the browser uses Clerk's cookie-based session transport rather than local password/JWT code.
- Keep external weather, routing, government, and telemetry providers behind typed response shapes. Until a provider is connected, responses are clearly labelled `SIMULATED`, `FIELD`, or `GOVERNMENT` rather than being presented as live.
- Keep the OpenAPI contract ahead of the React surface so generated client hooks and server-side Zod validation stay aligned.
- Store geospatial points as latitude/longitude fields in the first schema slice; the model is ready to evolve to PostGIS geometry when road-segment ingestion is added.

## Product

- Public welcome surface explaining the decision-support mission.
- Authenticated command center with operational metrics, recent activity, active alerts, weather watch, and delivery readiness.
- Vehicle tracking with status filters, registration, cargo priority, and status updates.
- Field incident register with severity filters and incident submission.
- Route desk with priority-aware risk recommendations.
- Weekly accessibility report and source-layer settings.

## User preferences

The user wants a production-style Smart India Hackathon prototype, not a disconnected mockup; simulated data must be explicitly labelled.

## Gotchas

- API changes start in `lib/api-spec/openapi.yaml`; rerun `pnpm --filter @workspace/api-spec run codegen` before using changed generated types.
- The web app uses the root preview path and the API is proxied at `/api`; do not hardcode localhost URLs in browser code.
- Artifact workflows provide `PORT` and `BASE_PATH`; use the managed workflow restart rather than launching artifact dev commands manually.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
