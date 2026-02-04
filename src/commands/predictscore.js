import { SlashCommandBuilder } from "discord.js";
import { games } from "../data/mockNhlData.js";
import { ensureGameExists, isGameLocked } from "../utils/gameUtils.js";
import { upsertPrediction } from "../utils/dataStore.js";

const gameChoices = games.map((game) => ({ name: `${game.away} @ ${game.home}`, value: game.id }));
const scoreRegex = /^\d{1,2}-\d{1,2}$/;

export const data = new SlashCommandBuilder()
  .setName("predictscore")
  .setDescription("Predict the final score.")
  .addStringOption((option) =>
    option
      .setName("game")
      .setDescription("Choose the game")
      .setRequired(true)
      .addChoices(...gameChoices)
  )
  .addStringOption((option) =>
    option
      .setName("score")
      .setDescription("Final score format: 3-2")
      .setRequired(true)
  );

export const execute = async (interaction) => {
  const gameId = interaction.options.getString("game", true);
  const score = interaction.options.getString("score", true);
  const { game, error } = ensureGameExists(gameId);

  if (error) {
    await interaction.reply({ content: error, ephemeral: true });
    return;
  }

  if (!scoreRegex.test(score)) {
    await interaction.reply({ content: "Score format should look like 3-2.", ephemeral: true });
    return;
  }

  if (isGameLocked(game)) {
    await interaction.reply({
      content: "Puck already dropped — no more score calls for that one.",
      ephemeral: true
    });
    return;
  }

  await upsertPrediction(interaction.user.id, gameId, { score });
  await interaction.reply(`Score prediction saved: **${score}**. Bold call 🥅`);
};
