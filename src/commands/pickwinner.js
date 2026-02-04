import { SlashCommandBuilder } from "discord.js";
import { games } from "../data/mockNhlData.js";
import { ensureGameExists, isGameLocked } from "../utils/gameUtils.js";
import { upsertPrediction } from "../utils/dataStore.js";

const gameChoices = games.map((game) => ({ name: `${game.away} @ ${game.home}`, value: game.id }));

export const data = new SlashCommandBuilder()
  .setName("pickwinner")
  .setDescription("Predict which team will win a game.")
  .addStringOption((option) =>
    option
      .setName("game")
      .setDescription("Choose the game to pick")
      .setRequired(true)
      .addChoices(...gameChoices)
  )
  .addStringOption((option) =>
    option
      .setName("team")
      .setDescription("Who takes the W?")
      .setRequired(true)
  );

export const execute = async (interaction) => {
  const gameId = interaction.options.getString("game", true);
  const team = interaction.options.getString("team", true);
  const { game, error } = ensureGameExists(gameId);

  if (error) {
    await interaction.reply({ content: error, ephemeral: true });
    return;
  }

  if (isGameLocked(game)) {
    await interaction.reply({
      content: "Puck already dropped — no more picks for that one.",
      ephemeral: true
    });
    return;
  }

  await upsertPrediction(interaction.user.id, gameId, { winner: team });
  await interaction.reply(`Locked in: **${team}** to win. W pick 🏒🔥`);
};
