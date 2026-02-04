import { SlashCommandBuilder } from "discord.js";
import { getGamesByDate } from "../data/mockNhlData.js";
import { formatGameLine } from "../utils/gameUtils.js";

export const data = new SlashCommandBuilder()
  .setName("tomorrow")
  .setDescription("Shows tomorrow's NHL games.");

export const execute = async (interaction) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const games = getGamesByDate(tomorrow);

  if (!games.length) {
    await interaction.reply("No games tomorrow. Time for highlight reels 🏒");
    return;
  }

  const lines = games.map((game) => formatGameLine(game));
  await interaction.reply(`Tomorrow's games:\n${lines.join("\n")}`);
};
