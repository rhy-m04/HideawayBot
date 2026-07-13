import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

// Safe Lando Norris command — use a curated list of image URLs provided via env
// Set process.env.LANDO_IMAGES to a comma-separated list of HTTPS image URLs to enable images.
// Example: LANDO_IMAGES="https://example.com/1.jpg,https://example.com/2.jpg"

function parseImageList() {
  const raw = process.env.LANDO_IMAGES || '';
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

export default {
  data: new SlashCommandBuilder()
    .setName('landonorris')
    .setDescription('Sends a Lando Norris image 🧡 (uses curated list; Pinterest scraping disabled)'),
  category: 'Fun',

  async execute(interaction) {
    try {
      await InteractionHelper.safeDefer(interaction);

      const images = parseImageList();
      if (!images.length) {
        const embed = new EmbedBuilder()
          .setColor(0xFF8000)
          .setTitle('🧡 Lando Norris — Images Disabled')
          .setDescription(
            'Image delivery is disabled because no curated image list is configured.\n' +
            'To enable, set the environment variable `LANDO_IMAGES` to a comma-separated list of HTTPS image URLs.'
          )
          .setTimestamp();

        await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
        return;
      }

      // Pick a random image from the curated list
      const idx = Math.floor(Math.random() * images.length);
      const image = images[idx];

      // Basic validation: must be HTTPS URL
      if (!/^https:\/\//i.test(image)) {
        logger.warn('[LandoNorris] Skipping invalid image URL:', image);
        const embed = new EmbedBuilder()
          .setColor(0xFF8000)
          .setTitle('🧡 Lando Norris — Image Error')
          .setDescription('The configured image list contains an invalid URL. Please ensure all entries are HTTPS image URLs.')
          .setTimestamp();
        await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0xFF8000)
        .setTitle('🧡 Lando Norris')
        .setImage(image)
        .setFooter({ text: `Image ${idx + 1} of ${images.length}` })
        .setTimestamp();

      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    } catch (err) {
      logger.error('[LandoNorris] Command error:', err?.message || err);
      await InteractionHelper.safeEditReply(interaction, {
        content: "❌ Could not process your request."
      });
    }
  }
};
