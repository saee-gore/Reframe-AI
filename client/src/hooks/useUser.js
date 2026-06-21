import { useState, useEffect } from 'react';

function generateId() {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useUser() {
  const [userId, setUserId] = useState(() => {
    let id = localStorage.getItem('reframe_user_id');
    if (!id) {
      id = generateId();
      localStorage.setItem('reframe_user_id', id);
    }
    return id;
  });

  const [userName, setUserNameState] = useState(
    () => localStorage.getItem('reframe_user_name') || ''
  );

  const [personaId, setPersonaIdState] = useState(
    () => localStorage.getItem('reframe_persona_id') || ''
  );

  const setUserName = (name) => {
    localStorage.setItem('reframe_user_name', name);
    setUserNameState(name);
  };

  const setPersonaId = (id) => {
    localStorage.setItem('reframe_persona_id', id);
    setPersonaIdState(id);
  };

  const clearUser = () => {
    localStorage.removeItem('reframe_user_name');
    localStorage.removeItem('reframe_persona_id');
    setUserNameState('');
    setPersonaIdState('');
  };

  return { userId, userName, setUserName, personaId, setPersonaId, clearUser };
}
