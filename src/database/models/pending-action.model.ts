export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE';
export type EntityType = 'task';

export interface PendingAction {
  id: string;
  action_type: ActionType;
  entity_type: EntityType;
  entity_id: string;
  payload: string; // JSON stringified
  created_at: string;
  retry_count: number;
}

export interface PendingActionRow {
  id: string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  payload: string;
  created_at: string;
  retry_count: number;
}

export const pendingActionFromRow = (row: PendingActionRow): PendingAction => ({
  id: row.id,
  action_type: row.action_type as ActionType,
  entity_type: row.entity_type as EntityType,
  entity_id: row.entity_id,
  payload: row.payload,
  created_at: row.created_at,
  retry_count: row.retry_count,
});

