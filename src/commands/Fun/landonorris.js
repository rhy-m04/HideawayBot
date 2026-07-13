import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('landonorris')
        .setDescription('Sends a random Lando Norris image 🧡 (disabled)'),
    category: 'Fun',

    async execute(interaction) {
        try {
            await InteractionHelper.safeDefer(interaction);

            const embed = new EmbedBuilder()
                .setColor(0xFF8000)
                .setTitle('🧡 Lando Norris — Images Disabled')
                .setDescription('This command no longer serves images from Pinterest. For safety and reliability we have disabled remote scraping. If you want this restored, please contact the bot owner or open an issue.')
                .setTimestamp();

            await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
        } catch (err) {
            logger.error('[LandoNorris] Disabled command error:', err?.message || err);
            await InteractionHelper.safeEditReply(interaction, {
                content: "❌ Could not process your request."
            });
        }
    }
};
