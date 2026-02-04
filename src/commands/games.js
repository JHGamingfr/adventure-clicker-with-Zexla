import { SlashCommandBuilder } from "discord.js";
import { getGamesByDate } from "../data/mockNhlData.js";
import { formatGameLine } from "../utils/gameUtils.js";

export const data = new SlashCommandBuilder()
  .setName("games")
  .setDescription("Shows today's NHL games.");

export const execute = async (interaction) => {
  const today = new Date();
  const games = getGamesByDate(today);

  if (!games.length) {
    await interaction.reply("No games on the schedule today. Rest day vibes 🧊");
    return;
  }

  const lines = games.map((game) => formatGameLine(game));
  await interaction.reply(`Today's games:\n${lines.join("\n")}`);
};
