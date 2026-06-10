import { EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { logger } from './logger.js';

const TICKET_LOG_CHANNEL_ID = '1514063621712515213';

export async function logTicketEvent({ client, guildId, event }) {
  try {
    const guild = client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId).catch(() => null);
    if (!guild) {
      logger.warn(`logTicketEvent invoked without valid guild: ${guildId}`);
      return;
    }

    const channel = guild.channels.cache.get(TICKET_LOG_CHANNEL_ID)
      || await guild.channels.fetch(TICKET_LOG_CHANNEL_ID).catch(() => null);
    if (!channel) {
      logger.warn(`Ticket log channel not found: ${TICKET_LOG_CHANNEL_ID}`);
      return;
    }

    const permissions = channel.permissionsFor(guild.members.me);
    if (!permissions?.has(['SendMessages', 'EmbedLinks'])) {
      logger.warn(`Missing permissions in ticket log channel: ${TICKET_LOG_CHANNEL_ID}`);
      return;
    }

    const embed = await createTicketLogEmbed(guild, event);

    const messageOptions = { embeds: [embed] };

    if (event.attachments && event.attachments.length > 0) {
      messageOptions.files = event.attachments;
    }

    if (['close', 'delete', 'transcript'].includes(event.type)) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`dl_transcript:${event.ticketId || event.ticketNumber || 'unknown'}`)
          .setLabel('Download Transcript')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('📥')
      );
      messageOptions.components = [row];
    }

    await channel.send(messageOptions);
    logger.info(`Ticket event logged: ${event.type} in guild ${guildId}`);

  } catch (error) {
    logger.error('Error logging ticket event:', error);
  }
}

async function createTicketLogEmbed(guild, event) {
  const embed = new EmbedBuilder();

  const titleMap = {
    open:       '🎫 Report Ticket Opened',
    close:      '🔓 Report Ticket Closed',
    delete:     '🗑️ Report Ticket Deleted',
    claim:      '🙋 Ticket Claimed',
    unclaim:    '🔓 Ticket Unclaimed',
    priority:   '🎯 Priority Updated',
    transcript: '📜 Transcript Created',
  };

  const colorMap = {
    open:       0x2ecc71,
    close:      0xe74c3c,
    delete:     0x8b0000,
    claim:      0x3498db,
    unclaim:    0xf39c12,
    priority:   0x9b59b6,
    transcript: 0x1abc9c,
  };

  embed.setColor(colorMap[event.type] || 0x95a5a6);
  embed.setTitle(titleMap[event.type] || '🎫 Ticket Event');
  embed.setTimestamp();

  const ticketNum = event.ticketNumber || 1;
  const ticketIdStr = event.ticketId ? `${guild.id}-${ticketNum}-1` : (event.ticketId || 'Unknown');
  const ticketRef = event.ticketRef || `report-${ticketNum}`;

  embed.addFields(
    { name: '🪪 Ticket ID',  value: `\`${ticketIdStr}\``, inline: true },
    { name: '🔢 Ticket Ref', value: `\`${ticketRef}\``,   inline: true }
  );

  embed.addFields({ name: '🌐 Server', value: guild.id, inline: false });

  let openedByStr = 'Unknown';
  if (event.userId) {
    const openedAtTs = event.openedAt ? Math.floor(event.openedAt / 1000) : null;
    openedByStr = openedAtTs
      ? `<@${event.userId}> at <t:${openedAtTs}:F>`
      : `<@${event.userId}>`;
  }
  embed.addFields({ name: '👤 Opened by', value: openedByStr, inline: false });

  if (['close', 'delete', 'claim', 'unclaim'].includes(event.type) && event.executorId) {
    const closedAtTs = Math.floor(Date.now() / 1000);
    const label = event.type === 'claim' ? '🙋 Claimed by'
                : event.type === 'unclaim' ? '🔓 Unclaimed by'
                : '🕐 Closed by';
    embed.addFields({
      name: label,
      value: `<@${event.executorId}> at <t:${closedAtTs}:F>`,
      inline: false
    });
  }

  if (event.reason) {
    const reasonText = event.reason.length > 1000
      ? event.reason.substring(0, 997) + '...'
      : event.reason;
    embed.addFields({ name: '📋 Reason', value: `\`\`\`${reasonText}\`\`\``, inline: false });
  }

  return embed;
}

export async function getTicketLoggingConfig(client, guildId) {
  return {
    enabled: true,
    lifecycleChannelId: TICKET_LOG_CHANNEL_ID,
    transcriptChannelId: TICKET_LOG_CHANNEL_ID,
  };
}

export function validateLogChannel(channel, botMember) {
  if (!channel || channel.type !== ChannelType.GuildText) {
    return { valid: false, error: 'Channel must be a text channel.' };
  }
  const permissions = channel.permissionsFor(botMember);
  const requiredPermissions = ['SendMessages', 'EmbedLinks'];
  const missing = requiredPermissions.filter(perm => !permissions.has(perm));
  if (missing.length > 0) {
    return { valid: false, error: `Missing permissions: ${missing.join(', ')}` };
  }
  return { valid: true };
}
