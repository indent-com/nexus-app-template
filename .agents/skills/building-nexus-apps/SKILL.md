---
name: building-nexus-apps
description:
  Build, run and check this Indent app, from the outcome a person asks for to a page that works.
  Use when you change its server code, migrations or UI, or test it with indent app dev.
---

# Building Nexus apps

The app has three parts:

- `server/`: queries and mutations, and the functions they call. A query is a read and a
  mutation is a change; each answers at `/api/<file>/<export>`.
- `migrations/`: the SQLite schema, as numbered SQL files.
- `ui/`: a React app styled with Tailwind. It imports queries and mutations from `server/`.

The API reference is the SDK's declarations in `node_modules/@indent-com/nexus-sdk/dist/`:
`index.d.ts` for server code, `react.d.ts` and `client.d.ts` for the UI. Server code calls
integrations through globals such as `MCP_Linear["acme"]`, typed in the `integrations.d.ts`
that `indent app types` and `indent app dev` write.

- [local-testing.md](local-testing.md): start `indent app dev`, call entrypoints, read the
  database, time calls, check the UI. Read it before running anything.
- [gotchas.md](gotchas.md): known problems and their workarounds. Read it before debugging.

## The loop

1. **Outcome.** Restate what the person wants in one sentence. Ask only if two readings lead to
   different apps.
2. **Source of truth.** Find the existing definition of every number before writing code, such as
   a query, a report or a number someone already trusts. Copy it; don't reinvent a metric.
3. **Build a page in a loop.** Write a query and call it with curl to see its JSON. Write the
   component that shows it. Open the page and take a screenshot.
4. **Check.** Call every entrypoint with curl, read the database, and time each call against the
   30 s limit ([local-testing.md](local-testing.md)).
5. **Reconcile.** Reproduce a number someone already trusts, exactly, from an independent source.
   If it doesn't match, find out why before you show it.
6. **Screenshots.** Light and dark. Look at them, and fix what looks off.

## Rules

- **Explicit caching.** Either `cache.get` with a stated `freshFor`, or a `refresh` mutation that
  writes rows to the app's database and queries that read them. The UI shows when the data was
  loaded. Never serve stale data silently.
- **Long work runs in the backend.** Never a browser loop that calls a mutation until it's done.
  Every call has 30 s. Work that can't fit belongs in a workflow, and `workflow` and `onSchedule`
  don't run in `indent app dev` yet.
- **No text-packing.** Don't pack rows into strings to get past an integration's size limit.
  Treat integration results as typed data.
- **No personal installations.** Never point the app at one person's installation: every viewer
  would read that person's data. Use `.me` for the viewer's own account, or an organization
  installation.
- **Say the basis of every number**: which days and time zone, and what is excluded. Label
  estimates.
- **A finished UI.** Stat tiles for headline numbers, real charts, loading, empty and error
  states for every read, and dark mode. Start from `ui/src/components.tsx` and Tailwind.
- **Test writes on your own objects.** Read freely; write only to something you created for the
  test, then clean it up.

## Done means

- Every entrypoint called with curl, inputs and outputs as expected, each under 30 s cold.
- The database holds what you expect (`indent app db`).
- Every number's basis stated, and at least one reconciled against an independent source.
- Light and dark screenshots that you looked at.
- `npm run typecheck` passes, after `indent app dev` wrote `integrations.d.ts`.
