let sessions = new Map();

// retrieve a session by id
export function findSession(id: any) {
  return sessions.get(id);
}

// save the specific session in the session store
export function saveSession(id: string, session: any) {
  sessions.set(id, session);
}

// retrieve all sessions
export default function findAllSessions() {
  return [...sessions.values()];
}
