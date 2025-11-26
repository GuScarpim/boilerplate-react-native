export interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  synced: boolean;
  server_id?: string | null;
}

export interface TaskRow {
  id: string;
  title: string;
  completed: number;
  created_at: string;
  updated_at: string;
  synced: number;
  server_id: string | null;
}

export const taskFromRow = (row: TaskRow): Task => ({
  id: row.id,
  title: row.title,
  completed: Boolean(row.completed),
  created_at: row.created_at,
  updated_at: row.updated_at,
  synced: Boolean(row.synced),
  server_id: row.server_id || undefined,
});

