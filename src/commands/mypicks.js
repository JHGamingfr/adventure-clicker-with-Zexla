import { SlashCommandBuilder } from "discord.js";
import { games } from "../data/mockNhlData.js";
import { getUserPredictions } from "../utils/dataStore.js";

export const data = new SlashCommandBuilder()
  .setName("mypicks")
  .setDescription("View your submitted predictions.");

export const execute = async (interaction) => {
  const userPredictions = await getUserPredictions(interaction.user.id);
  const gameIds = Object.keys(userPredictions);

  if (!gameIds.length) {
    await interaction.reply("No picks on file yet. Start with `/pickwinner`.");
    return;
  }

  const lines = gameIds.map((gameId) => {
    const game = games.find((entry) => entry.id === gameId);
    const prediction = userPredictions[gameId];
    const match = game ? `${game.away} @ ${game.home}` : gameId;

    const details = [
      prediction.winner ? `Winner: **${prediction.winner}**` : null,
      prediction.score ? `Score: **${prediction.score}**` : null,
      prediction.scorer ? `Scorer: **${prediction.scorer}**` : null
    ].filter(Boolean);

    return `**${match}** — ${details.join(" | ")}`;
  });

  await interaction.reply(`Here are your picks:\n${lines.join("\n")}`);
};
