const { SlashCommandBuilder } = require('discord.js');
const { updateUserPreferences } = require('../utils/preferences');

const VALID_STYLES = new Set([
  'memes',
  'gaming',
  'sports',
  'edits',
  'challenges',
  'commentary',
]);

function parseStyles(input) {
  return input
    .split(',')
    .map((style) => style.trim().toLowerCase())
    .filter((style) => VALID_STYLES.has(style));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setstyle')
    .setDescription('Set the content styles you want ClipKing to focus on.')
    .addStringOption((option) =>
      option
        .setName('styles')
        .setDescription('Comma-separate styles (memes, gaming, sports, edits, challenges, commentary).')
        .setRequired(true)
    ),
  async execute(interaction) {
    const rawStyles = interaction.options.getString('styles');
    const styles = parseStyles(rawStyles);

    if (styles.length === 0) {
      return interaction.reply({
        content: 'Hmm, I did not catch any valid styles. Try: memes, gaming, sports, edits, challenges, commentary.',
        ephemeral: true,
      });
    }

    const updated = updateUserPreferences(interaction.user.id, { styles });
    return interaction.reply({
      content: `Style set! I’ll watch **${updated.styles.join(', ')}** for you.`,
      ephemeral: true,
    });
  },
};
