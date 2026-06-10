import { Events } from 'discord.js';
import { logEvent, EVENT_TYPES } from '../services/loggingService.js';
import { logger } from '../utils/logger.js';

const MAX_CONTENT_LENGTH = 512;

export default {
  name: Events.MessageUpdate,
  once: false,

  async execute(oldMessage, newMessage) {
    try {
      if (!newMessage.guild || newMessage.author?.bot) return;
      if (oldMessage.content === newMessage.content) return;

      const authorMention = newMessage.author ? `<@${newMessage.author.id}>` : '`Unknown`';
      const authorId = newMessage.author?.id ?? 'Unknown';
      const now = Math.floor(Date.now() / 1000);

      const oldRaw = oldMessage.content || '*(empty)*';
      const newRaw = newMessage.content || '*(empty)*';

      const oldContent = oldRaw.length > MAX_CONTENT_LENGTH
        ? oldRaw.substring(0, MAX_CONTENT_LENGTH - 3) + '...'
        : oldRaw;
      const newContent = newRaw.length > MAX_CONTENT_LENGTH
        ? newRaw.substring(0, MAX_CONTENT_LENGTH - 3) + '...'
        : newRaw;

      const description = [
        `User: ${authorMention} — ${authorId}`,
        `<t:${now}:F>`,
        ``,
        `**Before:**`,
        oldContent,
        ``,
        `**After:**`,
        newContent
      ].join('\n');

      await logEvent({
        client: newMessage.client,
        guildId: newMessage.guild.id,
        eventType: EVENT_TYPES.MESSAGE_EDIT,
        data: {
          title: 'Message Edited',
          description,
          userId: newMessage.author?.id,
          channelId: newMessage.channel.id,
          footer: `AuthorID: ${authorId}  •  MessageID: ${newMessage.id}`
        }
      });

    } catch (error) {
      logger.error('Error in messageUpdate event:', error);
    }
  }
};
