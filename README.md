# Notes

An Indent app: a page of notes kept in the app's own SQLite database. `indent app init <name>`
creates a new app from this starter,
[indent-com/nexus-app-template](https://github.com/indent-com/nexus-app-template).

- `server/notes.ts`: the `notes` query and the `addNote` mutation.
- `migrations/`: the database's schema, as numbered SQL files.
- `ui/`: the page, a React app styled with Tailwind.

## Commands

```sh
indent app dev                # serve the page and the API at http://localhost:5173
indent app db "SELECT * FROM notes"
indent app types              # write integrations.d.ts after you add an integration
indent app build              # bundle into dist/ (it does not typecheck)
npm run typecheck
```

With `indent app dev` running, call the query and the mutation:

```sh
curl -s localhost:5173/api/notes/notes
curl -s -X POST localhost:5173/api/notes/addNote \
  -H 'content-type: application/json' -d '{"text":"Hello"}'
```
