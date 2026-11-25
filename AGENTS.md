# AGENTS.md

This is an Indent app. Read the building-nexus-apps skill in
[.agents/skills/building-nexus-apps](.agents/skills/building-nexus-apps/SKILL.md) before you change
it: `SKILL.md`, then `local-testing.md` and `gotchas.md`. The API reference is the SDK's type
declarations in `node_modules/@indent-com/nexus-sdk/dist/`.

- Get data only from queries and mutations imported from `server/`. The UI never calls
  `fetch`; server code does.
- Read with `useCall`, and show when the data is from with its `at`.
- Do the gathering and counting in queries, and send the UI only what it shows.
- Give each part of a page its own query, so parts load and fail independently.
- Show every read's loading, empty and error states.
- Change the schema with a new file in `migrations/`; never edit one that has run.
- Before you finish, call every query and mutation you touched with curl, run
  `npm run typecheck`, and look at a screenshot of the page.
