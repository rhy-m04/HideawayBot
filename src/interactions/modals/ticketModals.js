import {
    MessageFlags,
    EmbedBuilder
} from 'discord.js';
import { getTicketData, escalateTicket, ESCALATION_LEVELS } from '../../services/ticketService.js';
import { logger } from '../../utils/logger.js';

export default [
    {
        name: 'ticket_escalate_modal',
        async execute(interaction, client) {
            try {
                const customIdParts = interaction.customId.split(':');
                const escalationLevel = customIdParts[1];
                const reason = interaction.fields.getTextInputValue('escalation_reason');

                const ticket = await getTicketData(interaction.guildId, interaction.channelId);
                if (!ticket) {
                    return interaction.reply({
                        content: '❌ This is not a ticket channel.',
                        flags: MessageFlags.Ephemeral
                    });
                }

                const escalationConfig = ESCALATION_LEVELS[escalationLevel];
                if (!escalationConfig) {
                    return interaction.reply({
                        content: '❌ Invalid escalation level.',
                        flags: MessageFlags.Ephemeral
                    });
                }

                await escalateTicket(interaction.client, interaction.guild, interaction.channel, ticket, escalationLevel, reason, interaction.user);

                const pingRole = `<@&${escalationConfig.roleId}>`;
                const escalateEmbed = new EmbedBuilder()
                    .setColor(escalationConfig.color)
                    .setTitle(`⬆️ Ticket Escalated to ${escalationConfig.label}`)
                    .setDescription(
                        `This ticket has been escalated to **${escalationConfig.label}** by <@${interaction.user.id}>.\n\n` +
                        `Reason:\n\`\`\`\n${reason}\n\`\`\``
                    );

                await interaction.reply({
                    content: pingRole,
                    embeds: [escalateEmbed]
                });

                logger.info(`[Tickets] Ticket #${ticket.num} escalated to ${escalationConfig.label} by ${interaction.user.tag}`);
            } catch (err) {
                logger.error('[Tickets] Error in escalate modal:', err.message);
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        content: '❌ Failed to escalate ticket.',
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        }
    }
];
