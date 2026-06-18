import { EmbedBuilder, MessageFlags } from 'discord.js';
import { logger } from '../../utils/logger.js';
import { canUseGoogleUpdate } from '../../services/googleGroupsService.js';

export default [
    {
        name: 'google_role_toggle',
        async execute(interaction, client) {
            const [, targetUserId, roleId] = interaction.customId.split(':');

            const allowed = await canUseGoogleUpdate(interaction.member, interaction.guildId);
            if (!allowed) {
                return interaction.reply({
                    content: '❌ You don\'t have permission to manage Google Group roles.',
                    flags: MessageFlags.Ephemeral
                });
            }

            const targetMember = await interaction.guild.members.fetch(targetUserId).catch(() => null);
            if (!targetMember) {
                return interaction.reply({
                    content: '❌ Member not found in this server.',
                    flags: MessageFlags.Ephemeral
                });
            }

            const role = interaction.guild.roles.cache.get(roleId);
            if (!role) {
                return interaction.reply({
                    content: '❌ Role not found.',
                    flags: MessageFlags.Ephemeral
                });
            }

            const hasRole = targetMember.roles.cache.has(roleId);

            try {
                if (hasRole) {
                    await targetMember.roles.remove(role, `Google Groups manual update by ${interaction.user.tag}`);
                } else {
                    await targetMember.roles.add(role, `Google Groups manual update by ${interaction.user.tag}`);
                }

                const embed = new EmbedBuilder()
                    .setColor(hasRole ? 0xED4245 : 0x57F287)
                    .setTitle(hasRole ? '🗑️ Role Removed' : '✅ Role Assigned')
                    .setDescription(
                        hasRole
                            ? `Removed ${role} from **${targetMember.displayName}**.`
                            : `Assigned ${role} to **${targetMember.displayName}**.`
                    )
                    .setFooter({ text: `Updated by ${interaction.user.tag}` })
                    .setTimestamp();

                logger.info(`[GoogleGroups] ${interaction.user.tag} ${hasRole ? 'removed' : 'assigned'} role ${role.name} to ${targetMember.user.tag}`);

                return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            } catch (err) {
                logger.error(`[GoogleGroups] Failed to toggle role ${roleId} for ${targetUserId}:`, err.message);
                return interaction.reply({
                    content: `❌ Failed to ${hasRole ? 'remove' : 'assign'} role: ${err.message}`,
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
];
