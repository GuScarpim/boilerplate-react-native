import { getDatabase } from '../db';
import { Task, TaskRow, taskFromRow } from '../models/task.model';

export const taskService = {
  getAll: (): Task[] => {
    const db = getDatabase();
    const result = db.getAllSync<TaskRow>(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    return result.map(taskFromRow);
  },

  getById: (id: string): Task | null => {
    const db = getDatabase();
    const result = db.getFirstSync<TaskRow>(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
    return result ? taskFromRow(result) : null;
  },

  create: (task: Omit<Task, 'synced' | 'created_at' | 'updated_at'>): Task => {
    const db = getDatabase();
    const now = new Date().toISOString();
    const id = task.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    db.runSync(
      'INSERT INTO tasks (id, title, completed, created_at, updated_at, synced, server_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, task.title, task.completed ? 1 : 0, now, now, 0, task.server_id || null]
    );

    return taskService.getById(id)!;
  },

  update: (id: string, updates: Partial<Pick<Task, 'title' | 'completed' | 'synced' | 'server_id'>>): Task | null => {
    const db = getDatabase();
    const current = taskService.getById(id);
    if (!current) return null;

    const updated: Task = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    db.runSync(
      'UPDATE tasks SET title = ?, completed = ?, updated_at = ?, synced = ?, server_id = ? WHERE id = ?',
      [
        updated.title,
        updated.completed ? 1 : 0,
        updated.updated_at,
        updated.synced ? 1 : 0,
        updated.server_id || null,
        id,
      ]
    );

    return taskService.getById(id);
  },

  delete: (id: string): boolean => {
    const db = getDatabase();
    const result = db.runSync('DELETE FROM tasks WHERE id = ?', [id]);
    return result.changes > 0;
  },

  getUnsynced: (): Task[] => {
    const db = getDatabase();
    const result = db.getAllSync<TaskRow>(
      'SELECT * FROM tasks WHERE synced = 0 ORDER BY created_at ASC'
    );
    return result.map(taskFromRow);
  },
};

