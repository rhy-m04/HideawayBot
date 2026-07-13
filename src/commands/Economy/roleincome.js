import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getGuildConfig, updateGuildConfig } from '../../services/guildConfig.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { logger } from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Role management commands')
    .addSubcommandGroup(group =>
      group
        .setName('income')
        .setDescription('Manage role-based income for this server (owner/admin only)')
        .addSubcommand(sub =>
          sub
            .setName('add')
            .setDescription('Add income to a role')
            .addRoleOption(o => o.setName('role').setDescription('Role to award income').setRequired(true))
            .addIntegerOption(o => o.setName('amount').setDescription('Income amount per claim').setRequired(true))
        )
        .addSubcommand(sub =>
          sub
            .setName('remove')
            .setDescription('Remove income for a role')
            .addRoleOption(o => o.setName('role').setDescription('Role to remove').setRequired(true))
        )
        .addSubcommand(sub =>
          sub
            .setName('list')
            .setDescription('List role incomes configured in this server')
        )
    ),
  category: 'Economy',

  async execute(interaction, config, client) {
    const ok = await InteractionHelper.safeDefer(interaction);
    if (!ok) return;

    try {
      const guildId = interaction.guildId;
      // Allow owner or ManageGuild perms
      const member = interaction.member;
      const isOwner = interaction.guild?.ownerId === interaction.user.id;
      const hasPerm = member.permissions?.has?.(PermissionFlagsBits.ManageGuild);

      if (!isOwner && !hasPerm) {
        await InteractionHelper.safeEditReply(interaction, { content: 'Only the server owner or administrators may manage role incomes.' });
        return;
      }

      const group = interaction.options.getSubcommandGroup(false);
      const sub = interaction.options.getSubcommand(false);

      if (group !== 'income') {
        await InteractionHelper.safeEditReply(interaction, { content: 'Unknown role management group.' });
        return;
      }

      const cfg = await getGuildConfig(client, guildId);
      const roleIncome = cfg.roleIncome || {};

      if (sub === 'add') {
        const role = interaction.options.getRole('role');
        const amount = interaction.options.getInteger('amount');
        if (amount < 0) {
          await InteractionHelper.safeEditReply(interaction, { content: 'Amount must be 0 or greater.' });
          return;
        }
        roleIncome[role.id] = amount;
        await updateGuildConfig(client, guildId, { roleIncome });
        await InteractionHelper.safeEditReply(interaction, { content: `✅ Set income for role ${role.name} to ${amount}.` });
        return;
      }

      if (sub === 'remove') {
        const role = interaction.options.getRole('role');
        if (roleIncome[role.id]) {
          delete roleIncome[role.id];
          await updateGuildConfig(client, guildId, { roleIncome });
          await InteractionHelper.safeEditReply(interaction, { content: `✅ Removed income for role ${role.name}.` });
        } else {
          await InteractionHelper.safeEditReply(interaction, { content: `That role has no configured income.` });
        }
        return;
      }

      if (sub === 'list') {
        const entries = Object.entries(roleIncome || {});
        if (entries.length === 0) {
          await InteractionHelper.safeEditReply(interaction, { content: 'No role incomes configured for this server.' });
          return;
        }
        const lines = entries.map(([roleId, amount]) => {
          const role = interaction.guild.roles.cache.get(roleId);
          return `${role ? role.name : `<role:${roleId}>`}: ${amount}`;
        });
        await InteractionHelper.safeEditReply(interaction, { content: `Configured role incomes:\n${lines.join('\n')}` });
        return;
      }
    } catch (err) {
      logger.error('role income command error:', err);
      await InteractionHelper.safeEditReply(interaction, { content: 'An error occurred while updating role incomes.' });
    }
  }
};
