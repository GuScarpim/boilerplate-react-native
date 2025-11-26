import { getDatabase } from '../db';
import { PendingAction, PendingActionRow, ActionType, EntityType, pendingActionFromRow } from '../models/pending-action.model';

export const pendingActionService = {
  add: (
    actionType: ActionType,
    entityType: EntityType,
    entityId: string,
    payload: any
  ): PendingAction => {
    const db = getDatabase();
    const id = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    db.runSync(
      'INSERT INTO pending_actions (id, action_type, entity_type, entity_id, payload, created_at, retry_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, actionType, entityType, entityId, JSON.stringify(payload), now, 0]
    );

    return pendingActionService.getById(id)!;
  },

  getAll: (): PendingAction[] => {
    const db = getDatabase();
    const result = db.getAllSync<PendingActionRow>(
      'SELECT * FROM pending_actions ORDER BY created_at ASC'
    );
    return result.map(pendingActionFromRow);
  },

  getById: (id: string): PendingAction | null => {
    const db = getDatabase();
    const result = db.getFirstSync<PendingActionRow>(
      'SELECT * FROM pending_actions WHERE id = ?',
      [id]
    );
    return result ? pendingActionFromRow(result) : null;
  },

  delete: (id: string): boolean => {
    const db = getDatabase();
    const result = db.runSync('DELETE FROM pending_actions WHERE id = ?', [id]);
    return result.changes > 0;
  },

  incrementRetry: (id: string): void => {
    const db = getDatabase();
    db.runSync(
      'UPDATE pending_actions SET retry_count = retry_count + 1 WHERE id = ?',
      [id]
    );
  },
};

