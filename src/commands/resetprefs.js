const { SlashCommandBuilder } = require('discord.js');
const { resetUserPreferences } = require('../utils/preferences');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetprefs')
    .setDescription('Clear your saved preferences.'),
  async execute(interaction) {
    resetUserPreferences(interaction.user.id);

    return interaction.reply({
      content: 'All set! Your preferences are wiped. Start fresh with `/setplatform` and `/setstyle`.',
      ephemeral: true,
    });
  },
};
