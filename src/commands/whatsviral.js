const { SlashCommandBuilder } = require('discord.js');
const { getUserPreferences } = require('../utils/preferences');
const { trends } = require('../data/trends');

function filterTrends(preferences) {
  const platformSet = new Set(preferences.platforms);
  const styleSet = new Set(preferences.styles);

  return trends.filter((trend) => {
    const platformMatch = platformSet.size === 0 || platformSet.has(trend.platform);
    const styleMatch = styleSet.size === 0 || styleSet.has(trend.type);
    return platformMatch && styleMatch;
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whatsviral')
    .setDescription('Get a fast summary of what is blowing up today.'),
  async execute(interaction) {
    const prefs = getUserPreferences(interaction.user.id);
    const matches = filterTrends(prefs).slice(0, 3);

    if (matches.length === 0) {
      return interaction.reply({
        content: 'Nothing in your lane yet. Try `/setplatform` or `/setstyle` to tune the feed.',
        ephemeral: true,
      });
    }

    const summary = matches.map((trend) => `• ${trend.energy} **${trend.title}** — ${trend.why}`).join('\n');

    return interaction.reply({
      content: `Quick viral pulse:\n${summary}`,
    });
  },
};
