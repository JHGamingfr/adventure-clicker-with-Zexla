import { games } from "../data/mockNhlData.js";

export const formatGameLine = (game) => {
  const startTime = new Date(game.startTime);
  return `**${game.away}** @ **${game.home}** — <t:${Math.floor(
    startTime.getTime() / 1000
  )}:t>`;
};

export const findGame = (gameId) => games.find((game) => game.id === gameId);

export const isGameLocked = (game) => new Date() >= new Date(game.startTime);

export const ensureGameExists = (gameId) => {
  const game = findGame(gameId);
  if (!game) {
    return { error: "That game ID isn't on the board. Try `/games` for today's slate." };
  }
  return { game };
};
