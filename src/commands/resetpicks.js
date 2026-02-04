import { SlashCommandBuilder } from "discord.js";
import { resetUserPredictions } from "../utils/dataStore.js";

export const data = new SlashCommandBuilder()
  .setName("resetpicks")
  .setDescription("Clear all your predictions.");

export const execute = async (interaction) => {
  await resetUserPredictions(interaction.user.id);
  await interaction.reply("All picks cleared. Fresh slate energy 🧼");
};
