import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

// Safe Lando Norris command — use a curated list of image URLs provided via env
// You can set process.env.LANDO_IMAGES to a comma-separated list of HTTPS image URLs to override the built-in list.
// If LANDO_IMAGES is not set or empty, the DEFAULT_IMAGES array below will be used as a safe fallback.

const DEFAULT_IMAGES = [
  // Add your vetted image URLs here. They must be HTTPS and point to actual image files.
  // Example placeholders — replace these with your own hosted images.
  'https://cdn.jsdelivr.net/gh/rhy-norris4/HideawayBot-assets/lando1.jpg',
  'https://cdn.jsdelivr.net/gh/rhy-norris4/HideawayBot-assets/lando2.jpg',
  'https://cdn.jsdelivr.net/gh/rhy-norris4/HideawayBot-assets/lando3.jpg'
];

function parseImageList() {
  const raw = process.env.LANDO_IMAGES || '';
  const envList = raw.split(',').map(s => s.trim()).filter(Boolean);
  // Prefer environment list if present and contains at least one valid HTTPS URL
  const validEnv = envList.filter(u => /^https:\/\//i.test(u));
  if (validEnv.length) return validEnv;
  // Fall back to built-in DEFAULT_IMAGES (already validated in repo)
  return DEFAULT_IMAGES.slice();
}

export default {
  data: new SlashCommandBuilder()
    .setName('landonorris')
    .setDescription('Sends a Lando Norris image 🧡 (curated list; Pinterest scraping disabled)'),
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
            'To enable, set the environment variable `LANDO_IMAGES` to a comma-separated list of HTTPS image URLs, or add URLs to the default list in the repository.'
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
