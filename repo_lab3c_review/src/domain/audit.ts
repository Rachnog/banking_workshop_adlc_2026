/**
 * Append-only audit trail. In a real bank this is durable and tamper-evident;
 * here it is in-memory, but the shape (who/what/when/why) is the lesson:
 * provenance is the audit product.
 */

export interface AuditEntry {
  seq: number;
  ts: string; // ISO-8601 UTC
  actor: string;
  action: string;
  entityId: string;
  details: Record<string, unknown>;
}

const entries: AuditEntry[] = [];
let seq = 0;

export function audit(actor: string, action: string, entityId: string, details: Record<string, unknown> = {}): AuditEntry {
  const entry: AuditEntry = {
    seq: ++seq,
    ts: new Date().toISOString(),
    actor,
    action,
    entityId,
    details
  };
  entries.push(entry);
  return entry;
}

export function auditTrail(): readonly AuditEntry[] {
  return entries;
}

export function resetAudit(): void {
  entries.length = 0;
  seq = 0;
}
