let sessions = new Map();

export function findSession(id: any) {
  return sessions.get(id);
}

export function saveSession(id: string, session: any) {
  sessions.set(id, session);
}

export default function findAllSessions() {
  return [...sessions.values()];
}
