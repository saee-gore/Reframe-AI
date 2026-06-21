const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  createPersona: () => request('/persona/create', { method: 'POST' }),

  createConversation: (body) =>
    request('/conversation/create', { method: 'POST', body: JSON.stringify(body) }),

  endConversation: (conversationId) =>
    request('/conversation/end', { method: 'POST', body: JSON.stringify({ conversationId }) }),

  getMemories: (userId) => request(`/memory/${userId}`),

  deleteMemories: (userId) => request(`/memory/${userId}`, { method: 'DELETE' }),
};
