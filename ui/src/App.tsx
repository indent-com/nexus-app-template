import { useCall } from "@indent-com/nexus-sdk/react";
import { useState, type FormEvent } from "react";
import { addNote, notes } from "../../server/notes";
import { Button, Card, Empty, ErrorBanner, Skeleton } from "./components";

const time = (at: string) =>
  new Date(at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export function App() {
  const reading = useCall(notes, {});

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <main className="mx-auto max-w-2xl px-6 py-12">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Stored in this app's own database
            {reading.at && <> · updated {time(reading.at)}</>}
          </p>
        </header>
        <NewNote />
        {reading.error && <ErrorBanner className="mt-6">{reading.error.message}</ErrorBanner>}
        <Card className="mt-6">
          {reading.data === undefined ? (
            !reading.error && (
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-3/5" />
              </div>
            )
          ) : reading.data.length === 0 ? (
            <Empty title="No notes yet">Write one above to save it.</Empty>
          ) : (
            <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {reading.data.map((note) => (
                <li key={note.id} className="flex items-baseline justify-between gap-4 px-5 py-3">
                  <span className="min-w-0 break-words">{note.text}</span>
                  <span className="shrink-0 text-xs text-neutral-500">{time(note.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
    </div>
  );
}

function NewNote() {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(undefined);
    try {
      await addNote({ text });
      setText("");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(event) => void submit(event)}>
      <div className="flex gap-2">
        <input
          className="h-9 min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
          placeholder="Write a note"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button disabled={saving || text.trim() === ""}>{saving ? "Saving…" : "Add"}</Button>
      </div>
      {error && <ErrorBanner className="mt-3">{error}</ErrorBanner>}
    </form>
  );
}
