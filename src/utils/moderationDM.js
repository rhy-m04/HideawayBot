import { EmbedBuilder } from 'discord.js';
import { logger } from './logger.js';

const SERVER_NAME = 'The Hideaway';

const ACTION_LABELS = {
    warn: 'a Warning',
    ban: 'a Ban',
    kick: 'a Kick',
    timeout: 'a Timeout',
    massban: 'a Ban',
    masskick: 'a Kick',
};

/**
 * Send a moderation action DM to a user.
 * @param {Object} options
 * @param {import('discord.js').User}   options.user       - The user being sanctioned
 * @param {string}  options.action      - Action key: 'warn' | 'ban' | 'kick' | 'timeout'
 * @param {string}  options.reason      - Reason for the action
 * @param {Date|null} options.expiresAt - Expiry date (only for timeouts), or null
 */
export async function sendModerationDM({ user, action, reason, expiresAt = null }) {
    try {
        const actionLabel = ACTION_LABELS[action] ?? `a ${action}`;
        const issueDate = new Date();

        let expiryText;
        if (action === 'timeout' && expiresAt instanceof Date) {
            expiryText = expiresAt.toUTCString();
        } else if (action === 'ban' || action === 'massban') {
            expiryText = 'Permanent';
        } else {
            expiryText = 'N/A';
        }

        const embed = new EmbedBuilder()
            .setTitle('Moderation Action Notice')
            .setColor(0xED4245)
            .setDescription(`You have been provided ${actionLabel}`)
            .addFields(
                {
                    name: '👤 User',
                    value: `${user.username} (${user.id})`
                },
                {
                    name: '🌐 Server',
                    value: SERVER_NAME
                },
                {
                    name: '📋 Reason',
                    value: reason || 'No reason provided'
                },
                {
                    name: '📅 Date of Issue',
                    value: issueDate.toUTCString()
                },
                {
                    name: '⏰ Date of Expiry',
                    value: expiryText
                }
            )
            .setTimestamp();

        await user.send({ embeds: [embed] });
        logger.info(`Moderation DM sent to ${user.tag} for action: ${action}`);
    } catch (err) {
        logger.warn(`Could not send moderation DM to ${user?.tag ?? user?.id}: ${err.message}`);
    }
}
