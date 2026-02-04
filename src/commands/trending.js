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
    .setName('trending')
    .setDescription('Get the craziest trending memes/videos tailored to you.'),
  async execute(interaction) {
    const prefs = getUserPreferences(interaction.user.id);
    const matches = filterTrends(prefs);

    if (matches.length === 0) {
      return interaction.reply({
        content: 'No trends match your exact prefs yet. Try widening your platform or style picks!',
        ephemeral: true,
      });
    }

    const bullets = matches.slice(0, 5).map((trend) => {
      return `• ${trend.energy} **${trend.title}** (${trend.platform} • ${trend.type})\n  - ${trend.summary}\n  - Why it pops: ${trend.why}`;
    });

    return interaction.reply({
      content: [
        'Here are the hottest plays for you right now:',
        bullets.join('\n'),
        '\nWant it tighter? Update with `/setplatform` or `/setstyle`.',
      ].join('\n'),
    });
  },
};
