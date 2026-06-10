import { Events } from 'discord.js';
import { logEvent, EVENT_TYPES } from '../services/loggingService.js';
import { logger } from '../utils/logger.js';
import { getReactionRoleMessage, deleteReactionRoleMessage } from '../services/reactionRoleService.js';

const MAX_CONTENT_LENGTH = 1024;

export default {
  name: Events.MessageDelete,
  once: false,

  async execute(message) {
    try {
      if (!message.guild) return;

      try {
        const reactionRoleData = await getReactionRoleMessage(message.client, message.guild.id, message.id);
        if (reactionRoleData) {
          await deleteReactionRoleMessage(message.client, message.guild.id, message.id);
          logger.info(`Cleaned up reaction role database entry for manually deleted message ${message.id} in guild ${message.guild.id}`);
          try {
            await logEvent({
              client: message.client,
              guildId: message.guild.id,
              eventType: EVENT_TYPES.REACTION_ROLE_DELETE,
              data: {
                description: `Reaction role message was deleted manually and removed from database.`,
                channelId: message.channel?.id,
                fields: [
                  { name: '🗑️ Message ID', value: message.id, inline: true },
                  { name: '📍 Channel', value: message.channel ? `${message.channel.toString()} (${message.channel.id})` : 'Unknown', inline: true },
                  { name: '🧹 Cleanup', value: 'Database entry removed automatically', inline: false }
                ]
              }
            });
          } catch (logCleanupError) {
            logger.warn('Failed to log reaction role cleanup after manual message deletion:', logCleanupError);
          }
        }
      } catch (reactionRoleCleanupError) {
        logger.warn(`Failed to clean up reaction role data for deleted message ${message.id}:`, reactionRoleCleanupError);
      }

      if (message.author?.bot) return;

      const authorMention = message.author ? `<@${message.author.id}>` : '`Unknown`';
      const authorId = message.author?.id ?? 'Unknown';
      const now = Math.floor(Date.now() / 1000);

      const rawContent = message.content || '*(no text content)*';
      const content = rawContent.length > MAX_CONTENT_LENGTH
        ? rawContent.substring(0, MAX_CONTENT_LENGTH - 3) + '...'
        : rawContent;

      const description = [
        `User: ${authorMention} — ${authorId}`,
        `<t:${now}:F>`,
        ``,
        `**Deleted Message:**`,
        content
      ].join('\n');

      await logEvent({
        client: message.client,
        guildId: message.guild.id,
        eventType: EVENT_TYPES.MESSAGE_DELETE,
        data: {
          title: 'Message Deleted',
          description,
          userId: message.author?.id,
          channelId: message.channel.id,
          footer: `AuthorID: ${authorId}  •  MessageID: ${message.id}`
        }
      });

    } catch (error) {
      logger.error('Error in messageDelete event:', error);
    }
  }
};
