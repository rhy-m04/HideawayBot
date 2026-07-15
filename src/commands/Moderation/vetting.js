import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} from 'discord.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { getModerationCases } from '../../utils/moderation.js';
import { getFromDb, setInDb } from '../../utils/database.js';
import { addVettingHistoryEntry, getVettingHistory } from '../../utils/vettingHistory.js';
import { classifyActionSeverity, isCaseActive, computeVettingRecommendation } from '../../utils/vettingCriteria.js';

const LEVEL_PREFIX = {
    Moderation: 'MOD',
    Executive: 'EXE',
    Enhanced: 'ENH',
    Management: 'MAN'
};

export default {
    data: new SlashCommandBuilder()
        .setName('vetting')
        .setDescription('Vetting management commands')
        .addSubcommand(sub =>
            sub.setName('check')
                .setDescription('Perform a vetting check on a user')
                .addStringOption(o =>
                    o.setName('level')
                        .setDescription('Level of vetting')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Moderation', value: 'Moderation' },
                            { name: 'Executive', value: 'Executive' },
                            { name: 'Enhanced', value: 'Enhanced' },
                            { name: 'Management', value: 'Management' }
                        )
                )
                .addUserOption(o =>
                    o.setName('username')
                        .setDescription('The user to vet')
                        .setRequired(true)
                )
                .addStringOption(o =>
                    o.setName('reason')
                        .setDescription('Reason for the vetting request')
                        .setRequired(true)
                )
                .addUserOption(o =>
                    o.setName('requesting_member')
                        .setDescription('The member requesting the vetting')
                        .setRequired(true)
                )
        ),
    category: 'moderation',

    async execute(interaction, config, client) {
        const deferSuccess = await InteractionHelper.safeDefer(interaction);
        if (!deferSuccess) return;

        try {
            const sub = interaction.options.getSubcommand();
            if (sub === 'check') await handleVettingCheck(interaction, client);
        } catch (error) {
            logger.error('Vetting command error:', error);
            await InteractionHelper.safeEditReply(interaction, {
                content: '❌ An error occurred while processing the vetting request.'
            });
        }
    }
};

async function handleVettingCheck(interaction, client) {
    const level = interaction.options.getString('level');
    const targetUser = interaction.options.getUser('username');
    const reason = interaction.options.getString('reason');
    const requestingMember = interaction.options.getUser('requesting_member');
    const guild = interaction.guild;

    const member = await guild.members.fetch(targetUser.id).catch(() => null);

    const levelPrefix = LEVEL_PREFIX[level] || level.slice(0, 3).toUpperCase();
    const userPrefix = targetUser.username.slice(0, 3).toUpperCase();

    const vettingCountKey = `vetting_count_${guild.id}_${targetUser.id}`;
    const currentCount = await getFromDb(vettingCountKey, 0);
    const newCount = currentCount + 1;
    await setInDb(vettingCountKey, newCount);

    const vettingId = `${levelPrefix}//${userPrefix}//${newCount}//${targetUser.id}`;
    const shortId = `${Date.now().toString(36).toUpperCase()}`;

    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    const [cases, notes, vettingHistory] = await Promise.all([
        getModerationCases(guild.id, { userId: targetUser.id, limit: 100 }),
        getFromDb(`moderation_user_notes_${guild.id}_${targetUser.id}`, []),
        getVettingHistory(guild.id, targetUser.id),
    ]);

    // Work out which bans/timeouts have since been reversed, so they don't count as active.
    const unbanTimestamps = cases.filter(c => c.action === 'Member Unbanned').map(c => new Date(c.createdAt).getTime());
    const untimeoutTimestamps = cases.filter(c => c.action === 'Member Untimeouted').map(c => new Date(c.createdAt).getTime());

    const sanctionCases = cases.filter(c => ['Member Banned', 'Member Kicked', 'Member Timed Out', 'User Warned'].includes(c.action));
    const classifiedCases = sanctionCases.map(c => ({
        ...c,
        severity: classifyActionSeverity(c.action)
    }));

    const activeCases = classifiedCases.filter(c => {
        const reversals = c.action === 'Member Banned' ? unbanTimestamps
            : c.action === 'Member Timed Out' ? untimeoutTimestamps
            : [];
        return isCaseActive(c, c.severity, now, reversals);
    });

    const moderationHistoryText = activeCases.length > 0
        ? activeCases.slice(0, 10).map(c => {
            const expiry = c.metadata?.expiryDate || c.metadata?.timeoutEnds;
            const expiryText = expiry ? ` — Expires: <t:${Math.floor(new Date(expiry).getTime() / 1000)}:R>` : '';
            return `- **${c.action}** *(${c.severity})* — ${(c.reason || 'No reason').slice(0, 80)}${expiryText}`;
        }).join('\n')
        : '- No active moderation actions';

    const vettingHistoryText = vettingHistory.length > 0
        ? vettingHistory.slice(0, 8).map(v => {
            const statusEmoji = v.status === 'PASS' ? '✅' : v.status === 'FAIL' ? '❌' : '⏳';
            const date = `<t:${Math.floor(new Date(v.createdAt).getTime() / 1000)}:D>`;
            return `- ${statusEmoji} **${v.level}** — ${v.status} — ${date}`;
        }).join('\n')
        : '- No previous vetting conducted';

    const notesText = Array.isArray(notes) && notes.length > 0
        ? notes.slice(0, 8).map(n => {
            const date = `<t:${Math.floor(new Date(n.timestamp).getTime() / 1000)}:d>`;
            const content = (n.content || n.note || '').slice(0, 150);
            return `- ${date} - **${n.type}** - \`${content}\``;
        }).join('\n')
        : '- No internal notes';

    const joinDate = member?.joinedAt
        ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:F>`
        : 'Not in server';

    const accountCreated = `<t:${Math.floor(targetUser.createdAt.getTime() / 1000)}:F>`;

    const accountAgeDays = Math.floor((now - targetUser.createdAt.getTime()) / DAY_MS);
    const serverJoinDays = member?.joinedAt ? Math.floor((now - member.joinedAt.getTime()) / DAY_MS) : 0;

    const lastFailed = vettingHistory.find(v => v.status === 'FAIL');
    const lastFailedAt = lastFailed ? new Date(lastFailed.processedAt || lastFailed.createdAt).getTime() : null;

    const { recommendation, failReasons } = computeVettingRecommendation({
        level,
        accountAgeDays,
        serverJoinDays,
        activeCases,
        notes,
        lastFailedAt,
        now
    });

    const suggestedFailReason = failReasons.join('\n');

    const recommendationText = recommendation === 'PASS'
        ? `Upon the vetting, it is recommended to **PASS** this user for **${level}** Vetting.`
        : `Upon the vetting, it is recommended to **FAIL** this user for **${level}** Vetting.\n**Suggested Fail Reason:**\n${failReasons.map(r => `- ${r}`).join('\n')}`;

    await setInDb(`vetting_${shortId}`, {
        level,
        vettingId,
        vettingCount: newCount,
        targetUserId: targetUser.id,
        targetUserTag: targetUser.tag,
        requestingMemberId: requestingMember.id,
        reason,
        guildId: guild.id,
        issuerId: interaction.user.id,
        status: 'PENDING',
        suggestedRecommendation: recommendation,
        suggestedFailReason,
        createdAt: new Date().toISOString()
    });

    await addVettingHistoryEntry(guild.id, targetUser.id, shortId);

    const embed = new EmbedBuilder()
        .setColor(recommendation === 'PASS' ? 0x57F287 : 0xED4245)
        .setAuthor({ name: 'Hideaway Moderation Team' })
        .setTitle(`${level} Vetting Check`)
        .setDescription(
            `Vetting Level: ${level}\n` +
            `Vetting Authorisation: <@${requestingMember.id}> - \`${requestingMember.id}\`\n` +
            `Vetting Reason: ${reason}`
        )
        .addFields(
            {
                name: 'Member Information',
                value:
                    `User: <@${targetUser.id}> - \`${targetUser.id}\`\n` +
                    `Server Join Date: ${joinDate} - ${serverJoinDays}d ago\n` +
                    `Account Creation Date: ${accountCreated} - ${accountAgeDays}d ago`
            },
            {
                name: 'Moderation History',
                value: moderationHistoryText
            },
            {
                name: 'Vetting History',
                value: vettingHistoryText
            },
            {
                name: 'Internal Notes',
                value: notesText
            },
            {
                name: 'Recommendation',
                value: recommendationText
            }
        )
        .setFooter({ text: `Vetting ID: ${vettingId} - Conducted at` })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`vetting_pass:${shortId}`)
            .setLabel('PASS')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`vetting_fail:${shortId}`)
            .setLabel('FAIL')
            .setStyle(ButtonStyle.Danger)
    );

    await InteractionHelper.safeEditReply(interaction, { embeds: [embed], components: [row] });
}
