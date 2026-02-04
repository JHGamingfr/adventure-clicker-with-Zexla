const { SlashCommandBuilder } = require('discord.js');
const { updateUserPreferences } = require('../utils/preferences');

const PLATFORM_MAP = {
  tiktok: ['TikTok'],
  youtube: ['YouTube'],
  shorts: ['Shorts'],
  both: ['TikTok', 'YouTube'],
  all: ['TikTok', 'YouTube', 'Shorts'],
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setplatform')
    .setDescription('Set which platforms you want ClipKing to track for you.')
    .addStringOption((option) =>
      option
        .setName('platform')
        .setDescription('Pick your main platforms.')
        .setRequired(true)
        .addChoices(
          { name: 'TikTok', value: 'tiktok' },
          { name: 'YouTube', value: 'youtube' },
          { name: 'Shorts', value: 'shorts' },
          { name: 'TikTok + YouTube', value: 'both' },
          { name: 'All Platforms', value: 'all' }
        )
    ),
  async execute(interaction) {
    const selection = interaction.options.getString('platform');
    const platforms = PLATFORM_MAP[selection] || [];
    const updated = updateUserPreferences(interaction.user.id, { platforms });

    return interaction.reply({
      content: `Locked in! I’ll pull trends from **${updated.platforms.join(', ')}**.`,
      ephemeral: true,
    });
  },
};
