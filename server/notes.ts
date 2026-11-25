import { db, mutation, query, sql, ToolError } from "@indent-com/nexus-sdk";

export type Note = { id: number; text: string; created_at: string };

export const notes = query(async (_: {}) => {
  const [{ rows }] = await db.execute(
    sql<Note>`SELECT id, text, created_at FROM notes ORDER BY id DESC LIMIT 50`,
  );
  return rows;
});

export const addNote = mutation(async ({ text }: { text: string }) => {
  const trimmed = text.trim();
  if (trimmed === "") throw new ToolError("invalid_arguments", "Write something first");
  const [{ rows }] = await db.execute(sql<Note>`
    INSERT INTO notes (text, created_at) VALUES (${trimmed}, ${new Date().toISOString()})
    RETURNING id, text, created_at`);
  return rows[0]!;
});
