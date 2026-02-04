import { SlashCommandBuilder } from "discord.js";

const hypeLines = [
  "Let them know you're coming. 🚨",
  "The barn is buzzing tonight 🏒",
  "Stick taps for the squad 👏",
  "Time to light the lamp 🥅"
];

export const data = new SlashCommandBuilder()
  .setName("hype")
  .setDescription("Drop a hype message for your team.")
  .addStringOption((option) =>
    option
      .setName("team")
      .setDescription("Which team are we hyping?")
      .setRequired(true)
  );

export const execute = async (interaction) => {
  const team = interaction.options.getString("team", true);
  const line = hypeLines[Math.floor(Math.random() * hypeLines.length)];
  await interaction.reply(`**${team}** — ${line}`);
};
