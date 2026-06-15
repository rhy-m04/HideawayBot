import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags
} from 'discord.js';
import { logger } from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Channel management utilities')
        .addSubcommand(sub =>
            sub.setName('redo')
                .setDescription('Delete this channel and instantly recreate it with the same settings and permissions')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    category: 'moderation',

    async execute(interaction, config, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                content: '❌ You need the **Manage Channels** permission to use this.',
                flags: MessageFlags.Ephemeral
            });
        }

        const channel = interaction.channel;

        const snapshot = {
            name: channel.name,
            type: channel.type,
            topic: channel.topic ?? null,
            nsfw: channel.nsfw ?? false,
            rateLimitPerUser: channel.rateLimitPerUser ?? 0,
            position: channel.position,
            parent: channel.parentId ?? null,
            permissionOverwrites: channel.permissionOverwrites.cache.map(ow => ({
                id: ow.id,
                type: ow.type,
                allow: ow.allow.toArray(),
                deny: ow.deny.toArray()
            }))
        };

        try {
            await interaction.reply({
                content: '🔄 Redoing channel...',
                flags: MessageFlags.Ephemeral
            });
        } catch {
            // interaction may fail if channel deletes before reply — that's fine
        }

        try {
            await channel.delete(`/channel redo by ${interaction.user.tag}`);
        } catch (err) {
            logger.error('[channel redo] Delete failed:', err.message);
            return;
        }

        try {
            const newChannel = await interaction.guild.channels.create({
                name: snapshot.name,
                type: snapshot.type,
                topic: snapshot.topic,
                nsfw: snapshot.nsfw,
                rateLimitPerUser: snapshot.rateLimitPerUser,
                position: snapshot.position,
                parent: snapshot.parent,
                permissionOverwrites: snapshot.permissionOverwrites,
                reason: `/channel redo by ${interaction.user.tag}`
            });

            await newChannel.send({
                content: `🔄 Channel recreated by <@${interaction.user.id}>.`
            }).catch(() => {});
        } catch (err) {
            logger.error('[channel redo] Recreate failed:', err.message);
        }
    }
};
