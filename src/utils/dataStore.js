import { promises as fs } from "fs";
import path from "path";

const dataPath = path.resolve("src/data/predictions.json");

const ensureFile = async () => {
  try {
    await fs.access(dataPath);
  } catch {
    await fs.writeFile(dataPath, JSON.stringify({ users: {} }, null, 2));
  }
};

export const loadPredictions = async () => {
  await ensureFile();
  const raw = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(raw);
};

export const savePredictions = async (data) => {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
};

export const resetUserPredictions = async (userId) => {
  const data = await loadPredictions();
  data.users[userId] = {};
  await savePredictions(data);
};

export const getUserPredictions = async (userId) => {
  const data = await loadPredictions();
  return data.users[userId] || {};
};

export const upsertPrediction = async (userId, gameId, prediction) => {
  const data = await loadPredictions();
  if (!data.users[userId]) {
    data.users[userId] = {};
  }
  data.users[userId][gameId] = {
    ...data.users[userId][gameId],
    ...prediction,
    updatedAt: new Date().toISOString()
  };
  await savePredictions(data);
};
