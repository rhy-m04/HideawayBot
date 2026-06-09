import { PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { logger } from '../../utils/logger.js';

export default {
    name: 'rank_role_select',
    async execute(interaction, client, args) {
        await interaction.deferUpdate();
        try {
            const userId = args[0];
            const roleId = interaction.values[0];

            const guild = interaction.guild;
            const member = await guild.members.fetch(userId).catch(() => null);
            const role = guild.roles.cache.get(roleId);

            if (!member) {
                return interaction.followUp({ content: '❌ Could not find that user in this server.', ephemeral: true });
            }

            if (!role) {
                return interaction.followUp({ content: '❌ Could not find that role.', ephemeral: true });
            }

            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                return interaction.followUp({ content: '❌ You do not have permission to manage roles.', ephemeral: true });
            }

            await member.roles.add(role, `Rank set by ${interaction.user.tag}`);

            const originalEmbed = interaction.message.embeds[0];
            await interaction.editReply({
                embeds: [originalEmbed],
                components: []
            });

            await interaction.followUp({
                content: `${member.toString()} has been issued ${role.toString()}`,
                ephemeral: true
            });
        } catch (error) {
            logger.error('Rank select error:', error);
            await interaction.followUp({
                content: '❌ Failed to assign role. Make sure my role is above the target role.',
                ephemeral: true
            });
        }
    }
};
