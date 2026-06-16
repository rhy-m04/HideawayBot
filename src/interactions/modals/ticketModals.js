import {
    EmbedBuilder,
    MessageFlags
} from 'discord.js';
import { getTicketData, updateTicketData, escalateTicket, ESCALATION_LEVELS, TICKET_TYPES } from '../../services/ticketService.js';
import { logger } from '../../utils/logger.js';

const MOD_ROLES = ['1511500082053120020', '1511500077137399928', '1511500080031469790'];

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

                // Escalate the ticket
                await escalateTicket(interaction.client, interaction.guild, interaction.channel, ticket, escalationLevel, reason, interaction.user);

                const embed = new EmbedBuilder()
                    .setColor(escalationConfig.color)
                    .setTitle(`⬆️ Ticket Escalated to ${escalationConfig.label}`)
                    .setDescription(
                        `**Escalated by:** ${interaction.user.tag}\n` +
                        `**Level:** ${escalationConfig.label}\n` +
                        `**Reason:** ${reason}`
                    )
                    .setTimestamp();

                // Send escalation message with ping
                const pingRole = `<@&${escalationConfig.roleId}>`;
                await interaction.reply({ content: pingRole, embeds: [embed] });

                // Log escalation
                logger.info(`[Tickets] Ticket #${ticket.num} escalated to ${escalationConfig.label} by ${interaction.user.tag}`);
            } catch (err) {
                logger.error('[Tickets] Error in escalate modal:', err.message);
                await interaction.reply({
                    content: '❌ Failed to escalate ticket.',
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    },

    {
        name: 'ticket_close_modal',
        async execute(interaction, client) {
            try {
                const reason = interaction.fields.getTextInputValue('close_reason');
                const ticket = await getTicketData(interaction.guildId, interaction.channelId);

                if (!ticket) {
                    return interaction.reply({
                        content: '❌ This is not a ticket channel.',
                        flags: MessageFlags.Ephemeral
                    });
                }

                // Update ticket status
                await updateTicketData(interaction.guildId, interaction.channelId, {
                    status: 'closed',
                    closedAt: Date.now(),
                    closedBy: interaction.user.id,
                    closeReason: reason
                });

                const embed = new EmbedBuilder()
                    .setColor(0x2F3136)
                    .setTitle('🔒 Ticket Closed')
                    .setDescription(
                        `**Closed by:** ${interaction.user.tag}\n` +
                        `**Reason:** ${reason}`
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });

                // Delete channel after 5 seconds
                setTimeout(async () => {
                    await interaction.channel.delete(`Ticket closed by ${interaction.user.tag}`).catch(() => {});
                }, 5000);

                logger.info(`[Tickets] Ticket #${ticket.num} closed by ${interaction.user.tag}`);
            } catch (err) {
                logger.error('[Tickets] Error in close modal:', err.message);
                await interaction.reply({
                    content: '❌ Failed to close ticket.',
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
];
