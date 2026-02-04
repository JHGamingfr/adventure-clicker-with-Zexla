import { SlashCommandBuilder } from "discord.js";
import { games } from "../data/mockNhlData.js";
import { ensureGameExists, isGameLocked } from "../utils/gameUtils.js";
import { upsertPrediction } from "../utils/dataStore.js";

const gameChoices = games.map((game) => ({ name: `${game.away} @ ${game.home}`, value: game.id }));

export const data = new SlashCommandBuilder()
  .setName("predictscorer")
  .setDescription("Predict a goal scorer.")
  .addStringOption((option) =>
    option
      .setName("game")
      .setDescription("Choose the game")
      .setRequired(true)
      .addChoices(...gameChoices)
  )
  .addStringOption((option) =>
    option
      .setName("player")
      .setDescription("Player name")
      .setRequired(true)
  );

export const execute = async (interaction) => {
  const gameId = interaction.options.getString("game", true);
  const player = interaction.options.getString("player", true);
  const { game, error } = ensureGameExists(gameId);

  if (error) {
    await interaction.reply({ content: error, ephemeral: true });
    return;
  }

  if (isGameLocked(game)) {
    await interaction.reply({
      content: "Puck already dropped — no more scorer calls for that one.",
      ephemeral: true
    });
    return;
  }

  await upsertPrediction(interaction.user.id, gameId, { scorer: player });
  await interaction.reply(`Goal scorer pick saved: **${player}**. Net-finder vibes 🏒`);
};
