import { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { logger } from '../utils/logger.js';

const INVITE_LOG_CHANNEL = '1514064111628189696';

export default {
  name: Events.InviteCreate,
  once: false,

  async execute(invite) {
    try {
      const guild = invite.guild;
      if (!guild) return;

      const logChannel = guild.channels.cache.get(INVITE_LOG_CHANNEL)
        || await guild.channels.fetch(INVITE_LOG_CHANNEL).catch(() => null);
      if (!logChannel) return;

      const creator = invite.inviter;
      const usesStr = invite.maxUses === 0 ? '∞ Uses' : `${invite.maxUses} Uses`;
      const expiresStr = invite.maxAge === 0
        ? 'Never'
        : `<t:${Math.floor((Date.now() / 1000) + invite.maxAge)}:F>`;

      const embed = new EmbedBuilder()
        .setColor(0xf39c12)
        .setTitle('🎟️ Invite created')
        .addFields(
          { name: '🪪 Invite', value: `${invite.url} (${usesStr})`, inline: true },
          { name: '🔑 Invite Code', value: `\`${invite.code}\``, inline: true },
          { name: '👤 Created by', value: creator ? `<@${creator.id}> (${creator.id})` : 'Unknown', inline: true },
          { name: '🕐 Expires', value: expiresStr, inline: true }
        )
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`deactivate_invite:${invite.code}`)
          .setLabel('Deactivate Invite')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🗑️')
      );

      await logChannel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      logger.error('Error in guildInviteCreate event:', error);
    }
  }
};
