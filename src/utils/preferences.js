const fs = require('fs');
const path = require('path');

const PREFERENCES_PATH = path.join(__dirname, '../../data/preferences.json');

function ensureStore() {
  if (!fs.existsSync(PREFERENCES_PATH)) {
    fs.mkdirSync(path.dirname(PREFERENCES_PATH), { recursive: true });
    fs.writeFileSync(PREFERENCES_PATH, JSON.stringify({}, null, 2));
  }
}

function loadPreferences() {
  ensureStore();
  const raw = fs.readFileSync(PREFERENCES_PATH, 'utf-8');
  return JSON.parse(raw);
}

function savePreferences(prefs) {
  fs.writeFileSync(PREFERENCES_PATH, JSON.stringify(prefs, null, 2));
}

function getUserPreferences(userId) {
  const prefs = loadPreferences();
  return prefs[userId] || { platforms: [], styles: [] };
}

function updateUserPreferences(userId, updates) {
  const prefs = loadPreferences();
  const current = prefs[userId] || { platforms: [], styles: [] };
  prefs[userId] = { ...current, ...updates };
  savePreferences(prefs);
  return prefs[userId];
}

function resetUserPreferences(userId) {
  const prefs = loadPreferences();
  delete prefs[userId];
  savePreferences(prefs);
}

module.exports = {
  getUserPreferences,
  updateUserPreferences,
  resetUserPreferences,
};
