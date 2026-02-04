import { SlashCommandBuilder } from "discord.js";
import { games } from "../data/mockNhlData.js";
import { getUserPredictions } from "../utils/dataStore.js";

const feedbackMessages = {
  correct: "W pick 🏒🔥",
  close: "You were close 👀",
  miss: "That one didn’t age well 😭"
};

const evaluatePrediction = (prediction, game) => {
  if (!game.result) {
    return { status: "pending", message: "Still waiting on the final horn." };
  }

  const checks = [
    prediction.winner && prediction.winner === game.result.winner,
    prediction.score && prediction.score === game.result.score,
    prediction.scorer && prediction.scorer === game.result.scorer
  ].filter((value) => value !== undefined);

  const correctCount = checks.filter(Boolean).length;

  if (correctCount === checks.length && checks.length > 0) {
    return { status: "correct", message: feedbackMessages.correct };
  }

  if (correctCount > 0) {
    return { status: "close", message: feedbackMessages.close };
  }

  return { status: "miss", message: feedbackMessages.miss };
};

export const data = new SlashCommandBuilder()
  .setName("results")
  .setDescription("See how your predictions turned out.");

export const execute = async (interaction) => {
  const userPredictions = await getUserPredictions(interaction.user.id);
  const gameIds = Object.keys(userPredictions);

  if (!gameIds.length) {
    await interaction.reply("No predictions yet. Toss in a pick with `/pickwinner`.");
    return;
  }

  const lines = [];
  let correctTotals = 0;
  let checkedTotals = 0;

  gameIds.forEach((gameId) => {
    const game = games.find((entry) => entry.id === gameId);
    if (!game) {
      return;
    }

    const evaluation = evaluatePrediction(userPredictions[gameId], game);
    if (evaluation.status !== "pending") {
      checkedTotals += 1;
      if (evaluation.status === "correct") {
        correctTotals += 1;
      }
    }

    lines.push(`**${game.away} @ ${game.home}** — ${evaluation.message}`);
  });

  const summary = checkedTotals
    ? `You nailed **${correctTotals}** of **${checkedTotals}** finished games.`
    : "No finals yet — keep the hype alive.";

  await interaction.reply(`${summary}\n${lines.join("\n")}`);
};
