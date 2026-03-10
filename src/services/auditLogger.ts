import { AuditEvent } from '~/types/llm';
import { getLlmAuditEndpoint } from '~/utils/llm-utils';

async function postAuditEvent(endpoint: string, event: AuditEvent): Promise<void> {
  await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
    keepalive: true,
  });
}

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  const endpoint = getLlmAuditEndpoint();
  if (!endpoint) {
    return;
  }

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const payload = new Blob([JSON.stringify(event)], { type: 'application/json' });
      const queued = navigator.sendBeacon(endpoint, payload);
      if (queued) {
        return;
      }
    }

    await postAuditEvent(endpoint, event);
  } catch (error) {
    // Keep telemetry failures out of user workflows.
  }
}
