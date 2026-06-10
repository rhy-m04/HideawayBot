import { Events } from 'discord.js';
import { logEvent, EVENT_TYPES } from '../services/loggingService.js';
import { logger } from '../utils/logger.js';

export default {
  name: Events.GuildMemberUpdate,
  once: false,

  async execute(oldMember, newMember) {
    try {
      if (!newMember.guild) return;

      const oldRoles = oldMember.roles.cache;
      const newRoles = newMember.roles.cache;

      const addedRoles = newRoles.filter(r => !oldRoles.has(r.id));
      const removedRoles = oldRoles.filter(r => !newRoles.has(r.id));

      if (addedRoles.size > 0) {
        for (const role of addedRoles.values()) {
          await logEvent({
            client: newMember.client,
            guildId: newMember.guild.id,
            eventType: EVENT_TYPES.MEMBER_ROLE_ADD,
            data: {
              title: 'Role Added',
              description: [
                `User: ${newMember.toString()} — ${newMember.user.id}`,
                `Role: ${role.toString()} — ${role.id}`
              ].join('\n'),
              userId: newMember.user.id
            }
          });
        }
      }

      if (removedRoles.size > 0) {
        for (const role of removedRoles.values()) {
          await logEvent({
            client: newMember.client,
            guildId: newMember.guild.id,
            eventType: EVENT_TYPES.MEMBER_ROLE_REMOVE,
            data: {
              title: 'Role Removed',
              description: [
                `User: ${newMember.toString()} — ${newMember.user.id}`,
                `Role: ${role.toString()} — ${role.id}`
              ].join('\n'),
              userId: newMember.user.id
            }
          });
        }
      }

      if (oldMember.nickname !== newMember.nickname) {
        await logEvent({
          client: newMember.client,
          guildId: newMember.guild.id,
          eventType: EVENT_TYPES.MEMBER_NAME_CHANGE,
          data: {
            description: `Member nickname changed: ${newMember.user.tag}`,
            userId: newMember.user.id,
            fields: [
              { name: '👤 Member', value: `${newMember.user.tag} (${newMember.user.id})`, inline: true },
              { name: '🏷️ Old Nickname', value: oldMember.nickname || '*(no nickname)*', inline: true },
              { name: '🏷️ New Nickname', value: newMember.nickname || '*(no nickname)*', inline: true }
            ]
          }
        });
      }

    } catch (error) {
      logger.error('Error in guildMemberUpdate event:', error);
    }
  }
};
