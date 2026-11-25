# Local testing

`indent app dev` runs the app from local code: the UI, queries, mutations and a SQLite database
built from the migrations. Integration calls go to Indent as the signed-in person. Sign in once
with `indent auth login`.

## Start

From the app's folder, on a port of its own:

```sh
indent app dev --port 5173
```

The first start downloads the runtime, writes `integrations.d.ts` and builds. It's ready when it
prints:

```
DB   <path>/local.sqlite
UI   http://localhost:5173
API  http://localhost:5173/api/<file>/<export>
Built 2 queries and mutations
```

An agent should run it detached, with its output in a log file, and stop it by its process
group. `pkill -f "app dev"` from the agent's own shell also matches that shell.

## Call

A query is a GET with the input as JSON in `input`; a mutation is a POST with a JSON body.
`<file>` is the file in `server/` without `.ts`.

```sh
curl -s localhost:5173/api/notes/notes
curl -sG localhost:5173/api/<file>/<query> --data-urlencode 'input={"days":7}'
curl -s -X POST localhost:5173/api/notes/addNote \
  -H 'content-type: application/json' -d '{"text":"Hello"}'
```

- 200 with the bare return value.
- 400 `invalid_input` when the input doesn't match the type, including extra properties.
- 404 for an unknown export, 405 for the wrong verb.
- Failures are `{"error":{"name","message","code"?,"stack"?}}`. The stack points at your files
  in `server/`.

## Database

From the app's folder, one statement per call:

```sh
indent app db "SELECT count(*) AS n FROM notes"
```

It refuses when the migrations are newer than the database; start `indent app dev` first.

## Logs

The dev server prints one line per call, plus anything server code logs:

```
POST /api/notes/addNote 200 12ms
```

Every call is also saved, with its input, `console` lines and error stack, so you can read it
back from another shell:

```sh
indent app logs              # the last 20 calls
indent app logs -n 5 --errors
indent app logs -f --path "notes/*"
indent app logs --json | jq . # one object per call
```

## The 30 s limit

Every deployed call has 30 s. Time each entrypoint cold (first call after start, empty database
and cache) and warm, and leave margin:

```sh
curl -s -o /dev/null -w '%{http_code} %{time_total}s\n' -X POST \
  localhost:5173/api/<file>/<mutation> -H 'content-type: application/json' -d '{}'
```

To fit, run independent integration calls in parallel with `map`, page with `paginate` and a
`limit`, sync incrementally with cursors stored in the database, and aggregate in the source's
SQL. Don't split the work across browser calls.

## Browser

Screenshot every page in light and dark with a headless browser, and look at the images. For dark
mode, emulate `prefers-color-scheme: dark`. Check that the numbers on the page match the curl
output, that text doesn't overflow at 1440 px, and that dark mode has no unreadable colors.

## Test data

- Read freely.
- Write to an external system only on an object you created for the test, then delete it.
- Never change other people's data.
- Prefer writes that set a value to writes that add one, so a retry is safe.
