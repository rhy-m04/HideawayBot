import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    WebhookClient,
    MessageFlags,
    ChannelType
} from 'discord.js';
import { setInDb, getFromDb } from '../../utils/database.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

async function getWebhooks(guildId) {
    return (await getFromDb(`webhooks_${guildId}`)) || {};
}

async function saveWebhooks(guildId, data) {
    await setInDb(`webhooks_${guildId}`, data);
}

function parseDiscohookJson(raw) {
    let parsed;
    try {
        parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
        throw new Error('Invalid JSON — could not parse the file.');
    }

    // Wrapped Discohook format: { messages: [{ data: {...} }] }
    if (parsed?.messages?.[0]?.data) {
        parsed = parsed.messages[0].data;
    }

    // Validate something usable exists
    if (!parsed.content && (!Array.isArray(parsed.embeds) || parsed.embeds.length === 0)) {
        throw new Error('JSON must contain at least a `content` field or one embed.');
    }

    return parsed;
}

export default {
    data: new SlashCommandBuilder()
        .setName('webhook')
        .setDescription('Create, manage and send custom webhook messages')
        .addSubcommand(sub =>
            sub.setName('create')
                .setDescription('Create a webhook in a channel and save it for reuse')
                .addStringOption(o =>
                    o.setName('name')
                        .setDescription('Short name to identify this webhook (e.g. announcements)')
                        .setRequired(true)
                )
                .addChannelOption(o =>
                    o.setName('channel')
                        .setDescription('Channel to place the webhook in')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                )
        )
        .addSubcommand(sub =>
            sub.setName('send')
                .setDescription('Send a message through a saved webhook (supports Discohook JSON)')
                .addStringOption(o =>
                    o.setName('name')
                        .setDescription('Webhook name to send through')
                        .setRequired(true)
                )
                .addAttachmentOption(o =>
                    o.setName('json')
                        .setDescription('Discohook JSON export file (.json)')
                        .setRequired(false)
                )
                .addStringOption(o =>
                    o.setName('content')
                        .setDescription('Plain text message (if not using a JSON file)')
                        .setRequired(false)
                )
                .addStringOption(o =>
                    o.setName('username')
                        .setDescription('Override the display name shown on this message')
                        .setRequired(false)
                )
                .addStringOption(o =>
                    o.setName('avatar')
                        .setDescription('Override the avatar URL shown on this message')
                        .setRequired(false)
                )
        )
        .addSubcommand(sub =>
            sub.setName('list')
                .setDescription('Show all saved webhooks for this server')
        )
        .addSubcommand(sub =>
            sub.setName('delete')
                .setDescription('Delete a saved webhook')
                .addStringOption(o =>
                    o.setName('name')
                        .setDescription('Name of the webhook to delete')
                        .setRequired(true)
                )
        ),
    category: 'moderation',

    async execute(interaction, config, client) {
        const deferOk = await InteractionHelper.safeDefer(interaction, { flags: MessageFlags.Ephemeral });
        if (!deferOk) return;

        const guildId = interaction.guildId;
        const sub = interaction.options.getSubcommand();

        try {
            if (sub === 'create') {
                const name = interaction.options.getString('name').toLowerCase().replace(/\s+/g, '-');
                const channel = interaction.options.getChannel('channel');

                const webhooks = await getWebhooks(guildId);
                if (webhooks[name]) {
                    return InteractionHelper.safeEditReply(interaction, {
                        content: `❌ A webhook named **${name}** already exists. Delete it first or choose a different name.`
                    });
                }

                let discordWebhook;
                try {
                    discordWebhook = await channel.createWebhook({
                        name: name,
                        reason: `Created by ${interaction.user.tag} via /webhook create`
                    });
                } catch (err) {
                    logger.error('Webhook create error:', err);
                    return InteractionHelper.safeEditReply(interaction, {
                        content: `❌ Failed to create the webhook. Make sure I have the **Manage Webhooks** permission in ${channel.toString()}.`
                    });
                }

                webhooks[name] = {
                    id: discordWebhook.id,
                    token: discordWebhook.token,
                    channelId: channel.id,
                    channelName: channel.name,
                    createdBy: interaction.user.id,
                    createdAt: Date.now()
                };
                await saveWebhooks(guildId, webhooks);

                const embed = new EmbedBuilder()
                    .setColor(0x57F287)
                    .setTitle('✅ Webhook Created')
                    .addFields(
                        { name: 'Name', value: `\`${name}\``, inline: true },
                        { name: 'Channel', value: channel.toString(), inline: true },
                        { name: 'Webhook ID', value: `\`${discordWebhook.id}\``, inline: false }
                    )
                    .setFooter({ text: 'Use /webhook send to post through it' })
                    .setTimestamp();

                return InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
            }

            if (sub === 'list') {
                const webhooks = await getWebhooks(guildId);
                const entries = Object.entries(webhooks);

                if (entries.length === 0) {
                    return InteractionHelper.safeEditReply(interaction, {
                        content: '📭 No webhooks have been configured yet. Use `/webhook create` to add one.'
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor(0x5865F2)
                    .setTitle('🔗 Configured Webhooks')
                    .setDescription(
                        entries.map(([name, data]) => {
                            const ch = interaction.guild.channels.cache.get(data.channelId);
                            return `**${name}** → ${ch ? ch.toString() : `#${data.channelName}`}`;
                        }).join('\n')
                    )
                    .setFooter({ text: `${entries.length} webhook${entries.length === 1 ? '' : 's'} total` })
                    .setTimestamp();

                return InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
            }

            if (sub === 'delete') {
                const name = interaction.options.getString('name').toLowerCase().replace(/\s+/g, '-');
                const webhooks = await getWebhooks(guildId);

                if (!webhooks[name]) {
                    return InteractionHelper.safeEditReply(interaction, {
                        content: `❌ No webhook named **${name}** found. Use \`/webhook list\` to see existing webhooks.`
                    });
                }

                const entry = webhooks[name];
                try {
                    const whClient = new WebhookClient({ id: entry.id, token: entry.token });
                    await whClient.delete();
                    whClient.destroy();
                } catch (err) {
                    logger.warn(`Could not delete webhook from Discord (may already be gone): ${err.message}`);
                }

                delete webhooks[name];
                await saveWebhooks(guildId, webhooks);

                const embed = new EmbedBuilder()
                    .setColor(0xED4245)
                    .setTitle('🗑️ Webhook Deleted')
                    .setDescription(`The webhook **${name}** has been removed.`)
                    .setTimestamp();

                return InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
            }

            if (sub === 'send') {
                const name = interaction.options.getString('name').toLowerCase().replace(/\s+/g, '-');
                const webhooks = await getWebhooks(guildId);

                if (!webhooks[name]) {
                    return InteractionHelper.safeEditReply(interaction, {
                        content: `❌ No webhook named **${name}** found. Use \`/webhook list\` to see existing webhooks.`
                    });
                }

                const jsonAttachment = interaction.options.getAttachment('json');
                const plainContent = interaction.options.getString('content');
                const usernameOverride = interaction.options.getString('username');
                const avatarOverride = interaction.options.getString('avatar');

                if (!jsonAttachment && !plainContent) {
                    return InteractionHelper.safeEditReply(interaction, {
                        content: '❌ Provide either a **Discohook JSON file** or a **content** message (or both).'
                    });
                }

                const entry = webhooks[name];
                const whClient = new WebhookClient({ id: entry.id, token: entry.token });

                try {
                    let payload = {};

                    if (jsonAttachment) {
                        if (!jsonAttachment.name.endsWith('.json') && !jsonAttachment.contentType?.includes('json')) {
                            return InteractionHelper.safeEditReply(interaction, {
                                content: '❌ The attached file must be a `.json` file exported from Discohook.'
                            });
                        }

                        const res = await fetch(jsonAttachment.url);
                        if (!res.ok) throw new Error(`Failed to download attachment (${res.status})`);
                        const raw = await res.text();

                        payload = parseDiscohookJson(raw);
                    }

                    if (plainContent) payload.content = plainContent;
                    if (usernameOverride) payload.username = usernameOverride;
                    if (avatarOverride) payload.avatar_url = avatarOverride;

                    // discord.js WebhookClient.send() expects embeds as EmbedBuilder or raw API objects
                    const sendPayload = {
                        ...(payload.content ? { content: payload.content } : {}),
                        ...(payload.embeds?.length ? { embeds: payload.embeds } : {}),
                        ...(payload.username ? { username: payload.username } : {}),
                        ...(payload.avatar_url ? { avatarURL: payload.avatar_url } : {}),
                        ...(payload.files?.length ? { files: payload.files } : {}),
                    };

                    await whClient.send(sendPayload);
                    whClient.destroy();

                    const channel = interaction.guild.channels.cache.get(entry.channelId);
                    const embed = new EmbedBuilder()
                        .setColor(0x57F287)
                        .setTitle('✅ Message Sent')
                        .addFields(
                            { name: 'Webhook', value: `\`${name}\``, inline: true },
                            { name: 'Channel', value: channel ? channel.toString() : `\`${entry.channelName}\``, inline: true }
                        )
                        .setTimestamp();

                    return InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
                } catch (err) {
                    whClient.destroy();
                    logger.error('Webhook send error:', err);
                    return InteractionHelper.safeEditReply(interaction, {
                        content: `❌ Failed to send: ${err.message}`
                    });
                }
            }
        } catch (err) {
            logger.error('Webhook command error:', err);
            return InteractionHelper.safeEditReply(interaction, {
                content: `❌ Something went wrong: ${err.message}`
            });
        }
    }
};
