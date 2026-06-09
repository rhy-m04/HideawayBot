import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    RoleSelectMenuBuilder,
    EmbedBuilder
} from 'discord.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription("Set a user's rank by assigning a role")
        .addUserOption(o =>
            o.setName('user')
             .setDescription('The user to set the rank for')
             .setRequired(true)
        )
        .addStringOption(o =>
            o.setName('reason')
             .setDescription('Reason / message shown on the panel')
             .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    category: 'moderation',

    async execute(interaction, config, client) {
        const deferSuccess = await InteractionHelper.safeDefer(interaction);
        if (!deferSuccess) return;

        try {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                throw new Error("You need the `Manage Roles` permission to use this command.");
            }

            const target = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || "Set the user's rank by selecting a role below";

            const embed = new EmbedBuilder()
                .setColor(0x062F77)
                .addFields(
                    {
                        name: '👤 User',
                        value: `${target.toString()} (${target.id})`
                    },
                    {
                        name: '🌐 Group',
                        value: interaction.guild.name
                    },
                    {
                        name: '📋 Message',
                        value: reason
                    }
                );

            const roleSelect = new RoleSelectMenuBuilder()
                .setCustomId(`rank_role_select:${target.id}`)
                .setPlaceholder('Select a role to assign...')
                .setMinValues(1)
                .setMaxValues(1);

            const row = new ActionRowBuilder().addComponents(roleSelect);

            await InteractionHelper.safeEditReply(interaction, {
                embeds: [embed],
                components: [row]
            });
        } catch (error) {
            logger.error('Rank command error:', error);
            await handleInteractionError(interaction, error, { subtype: 'rank_failed' });
        }
    }
};
