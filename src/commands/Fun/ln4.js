import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

// Lando Norris command — picks a random image from a fixed curated list.
// The URLs below are the direct image links resolved from the requested
// Pinterest pins (Discord embeds require a direct image URL, not a pin page URL).
const IMAGES = [
  'https://i.pinimg.com/736x/f4/c4/d2/f4c4d256236b8c11759209393c3c47d6.jpg',
  'https://i.pinimg.com/736x/a7/a5/8c/a7a58c963f17833aba1b3e5d155612a9.jpg',
  'https://i.pinimg.com/736x/50/f8/1f/50f81f288f2df19df3b3982e98924ad4.jpg',
  'https://i.pinimg.com/736x/76/c4/06/76c40689a7477fa32a8c17eb6377cac4.jpg',
  'https://i.pinimg.com/736x/06/13/13/0613137b5d14c13294b74ff0c8dc39cf.jpg',
  'https://i.pinimg.com/736x/e5/f7/06/e5f70683b24172d760da1cec8f28f582.jpg',
  'https://i.pinimg.com/736x/4a/71/e3/4a71e35f9313453f9e6cec8e1e329198.jpg',
  'https://i.pinimg.com/736x/d0/64/49/d064495f6d6359b4d69d19b7317499e8.jpg',
  'https://i.pinimg.com/736x/15/81/3e/15813e8e3918fe9e3b85d1f9bac3687a.jpg',
  'https://i.pinimg.com/736x/df/86/d4/df86d46db2e8037fb1f6390f224175a1.jpg',
  'https://i.pinimg.com/736x/a9/f2/78/a9f278cbf82d5150e49d360e4762e114.jpg',
  'https://i.pinimg.com/736x/53/87/0d/53870d00c73c2522aaa5e0ea59d36bb2.jpg',
  'https://i.pinimg.com/736x/a6/d2/9d/a6d29dda881c19fad8e296c6145b9fca.jpg',
  'https://i.pinimg.com/736x/5e/3c/a4/5e3ca4fe1b7eeb3614245ff424d8d55c.jpg',
  'https://i.pinimg.com/736x/a9/8f/a6/a98fa6bac949e5c3a3f73c6be08eb97e.jpg',
  'https://i.pinimg.com/736x/52/fb/c7/52fbc776985c727d401c4634f7dfe4eb.jpg',
  'https://i.pinimg.com/736x/9b/53/8c/9b538c34899de70ff82f0b1b106f7475.jpg',
  'https://i.pinimg.com/736x/e3/08/b2/e308b2d1848fc81483182c64c9aca20b.jpg',
  'https://i.pinimg.com/736x/72/64/00/726400060a90d811774376043217d148.jpg',
  'https://i.pinimg.com/736x/e7/f5/2e/e7f52e7c76be892c20371856dc8035b1.jpg',
  'https://i.pinimg.com/736x/68/8d/98/688d9811d5072127234543530f8adb28.jpg',
  'https://i.pinimg.com/736x/46/5a/7e/465a7e1b41cd8418a8ecfd12f45b5a16.jpg',
  'https://i.pinimg.com/736x/51/32/2f/51322fcf1a079ba4f89cbcc939aa6b8e.jpg',
  'https://i.pinimg.com/736x/d6/c6/4b/d6c64b8108cd56f09cf5a9bcbed66ea4.jpg',
  'https://i.pinimg.com/736x/90/ca/2b/90ca2b82f9e60709f7b3272943daf895.jpg',
  'https://i.pinimg.com/736x/c1/d0/cb/c1d0cbdb58b36c18d1a13e41b42712c8.jpg',
  'https://i.pinimg.com/736x/14/db/19/14db194fcf6936f004fe69c8eb2fbbe6.jpg',
  'https://i.pinimg.com/736x/8e/2c/1d/8e2c1dc6b5aa748f0dc15245f1e91e16.jpg',
  'https://i.pinimg.com/736x/3d/d2/05/3dd205dd9190f488015c07c91198daf7.jpg',
  'https://i.pinimg.com/736x/35/f8/fb/35f8fbaa17a0e70a089657b1aa1ac630.jpg',
  'https://i.pinimg.com/736x/ea/f7/24/eaf724bbcffe2deadf80cdbc62c5ac46.jpg',
  'https://i.pinimg.com/736x/89/c2/30/89c2306edb69713c1a1dd1d387e72ae6.jpg',
  'https://i.pinimg.com/736x/60/3a/8f/603a8fe2538b2da41eec943fe6977b01.jpg',
  'https://i.pinimg.com/736x/b9/40/0e/b9400ecd7207eb910afb0d6b694495bc.jpg',
  'https://i.pinimg.com/736x/31/55/d3/3155d34e9ada3f6938ec8a0d9741e956.jpg'
];

export default {
  data: new SlashCommandBuilder()
    .setName('ln4')
    .setDescription('Sends a random Lando Norris image 🧡'),
  category: 'Fun',

  async execute(interaction) {
    try {
      await InteractionHelper.safeDefer(interaction);

      const idx = Math.floor(Math.random() * IMAGES.length);
      const image = IMAGES[idx];

      const embed = new EmbedBuilder()
        .setColor(0xFF8000)
        .setTitle('🧡 Lando Norris')
        .setImage(image)
        .setFooter({ text: `Image ${idx + 1} of ${IMAGES.length}` })
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
