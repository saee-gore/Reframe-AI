import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEMORIES_FILE = path.join(__dirname, '..', '.memories.json');

function readAll() {
  if (!fs.existsSync(MEMORIES_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(MEMORIES_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeAll(data) {
  fs.writeFileSync(MEMORIES_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export function saveMemory(userId, memory) {
  const all = readAll();
  if (!all[userId]) all[userId] = [];
  all[userId].unshift({ ...memory, timestamp: new Date().toISOString() });
  writeAll(all);
}

export function getMemories(userId) {
  const all = readAll();
  return all[userId] || [];
}

export function deleteMemories(userId) {
  const all = readAll();
  delete all[userId];
  writeAll(all);
}
