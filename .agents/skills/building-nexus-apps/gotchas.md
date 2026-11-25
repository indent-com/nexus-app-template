# Gotchas

Each entry: what you see, then what to do.

## Integrations

- **App code gets only a preview of a SQL result.** `run_query` returns at most 20 rows and
  16,000 bytes, each cell clipped to 2,048 bytes. Aggregate in SQL so the result is small, or
  load in chunks into the app's database.
- **SQL values decode loosely.** Numerics come back as strings and small JSON cells as objects.
  Convert each column yourself (`Number(row.usd)`). `run_query` takes no bind parameters, so
  check every value you put into SQL.
- **Some column aliases fail unquoted**, such as `month` and `day`. Quote them: `AS "month"`.
- **MCP results are text.** Many tools return JSON in `content` with no `structuredContent`.
  Decode with `structuredContent ?? JSON.parse(content[0].text)` and check `isError` first.
- **Literal-union parameters fail only at runtime.** A wrong enum value typechecks and fails with
  `invalid_arguments`. Call each new tool once with curl before building on it.
- **64 integration calls in flight per connection**, across every call running at once; the 65th
  throws. Fan out with `map` (5 at a time by default), not `Promise.all` over a list.
- **`.me` is undefined in the emulator.** Apps that need the viewer's own account can't be tested
  locally yet.
- **Secrets come from an untyped `process.env`**, and a missing one is `undefined`, not an error.
  Check and throw.

## Runtime and emulator

- **`workflow` and `onSchedule` are stubs** in `indent app dev`: they return `{}` and never run.
- **Connections drop after idle.** After about 16 minutes idle, calls can fail with a lost
  connection or 500s. Restart the dev server. The first call after a restart can be slow.
- **Server code has no IANA time zones.** Most of `Intl` is excluded. Prefer a time field the
  integration already computes; otherwise convert by hand and test daylight saving time.
- **Optional inputs and `undefined`** may not work. Use `null` or a required field.
- **Tuple types aren't JSON types.** An entrypoint whose output contains a tuple fails to build.
  Return objects or plain arrays.

## Build

- **Every query and mutation must return a JSON type.** An `any` output, such as a bare
  `JSON.parse(...)`, fails that entrypoint's build with `output is any, which is not a JSON type`
  and every call to it returns `build_failed`. Declare the return type and cast decoded values.
- **`indent app build` doesn't typecheck.** Run `npm run typecheck` too.

- **The UI can import server types but not values.** Repeat a constant in `ui/src`, or return it
  from a query.
- **Each dev server uses about 1 GB.** Stop the ones you are done with.
