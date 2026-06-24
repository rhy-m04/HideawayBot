import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const FORMATS = {
    'mod-log': {
        label: '🔨 Moderation Action Log',
        description: 'Logged when a mod action (ban/kick/mute/warn) is taken',
        build: () => [
            new EmbedBuilder()
                .setColor(0xe74c3c)
                .setTitle('Moderation Action')
                .addFields(
                    { name: 'User', value: '<@314159265358979323>\n`314159265358979323`', inline: true },
                    { name: 'Moderator', value: '<@271828182845904523>\n`271828182845904523`', inline: true },
                    { name: 'Action', value: '🔨 **Ban**', inline: true },
                    { name: 'Duration', value: 'Permanent', inline: true },
                    { name: 'Reason', value: 'Repeated violations of community guidelines after multiple warnings. Harassment of members in DMs.' },
                    { name: 'Evidence', value: '[#mod-evidence › Screenshot 2026-06-24](https://discord.com)' }
                )
                .setFooter({ text: 'Case ID: #0042' })
                .setTimestamp()
        ]
    },

    'vetting-check': {
        label: '🔍 Vetting Check',
        description: 'Sent in #vetting when /vetting check is run on a member',
        build: () => [
            new EmbedBuilder()
                .setColor(0x5865F2)
                .setAuthor({ name: 'Hideaway Moderation Team' })
                .setTitle('Level 2 Vetting Check')
                .setDescription(
                    '> Vetting Level: **Level 2 — Community**\n' +
                    '> Authorisation: <@271828182845904523> — `271828182845904523`\n' +
                    '> Reason: Requested after 30-day activity review and vouches from 3 members.'
                )
                .addFields(
                    { name: 'Member Information', value: '👤 <@314159265358979323>\n`314159265358979323`', inline: true },
                    { name: 'Server Join Date', value: '📅 Jan 15, 2026\n161 days ago', inline: true },
                    { name: 'Account Creation', value: '📅 Mar 22, 2023\n3 years ago', inline: true },
                    { name: '⚠️ Active Moderation Sanctions', value: '• Warn #001 — Spam in #general · expires <t:1751234567:R>\n• No active bans or mutes' },
                    { name: '🥇 Rank History', value: '➕ **Community Member** added by <@271828182845904523> · Mar 1, 2026\n➕ **Level 1 Verified** added by <@987654321098765432> · Feb 10, 2026' },
                    { name: '📋 Google Groups', value: 'Linked: ✅ `member@gmail.com`\ncommunity-announcements@hideaway.gg ✅\nlevel2-resources@hideaway.gg ❌' },
                    { name: '🗒️ Internal Notes', value: '<@271828182845904523> *(Jun 1, 2026):* Good standing, active in events. Recommend approval.' }
                )
                .setFooter({ text: 'Vetting ID: LEV//USR//0023//314159265358979323' })
        ]
    },

    'vetting-pass': {
        label: '✅ Vetting Pass Log',
        description: 'Logged in #vetting-log when a member passes vetting',
        build: () => [
            new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle('Vetting Request – Level 2')
                .addFields(
                    { name: 'User', value: '<@314159265358979323> `314159265358979323`', inline: true },
                    { name: 'Vetting Standard', value: 'Level 2 — Community', inline: true },
                    { name: 'Requesting Member', value: '<@271828182845904523>', inline: true },
                    { name: 'Reason', value: '30-day review, 3 vouches.', inline: true },
                    { name: 'Result', value: '✅ **PASS**' },
                    { name: '✅ Actions Taken', value: '• Role **Level 2 Verified** assigned\n• Google Group `level2-resources@hideaway.gg` enrolled\n• DM notification sent to member' }
                )
                .setFooter({ text: 'Vetting Number: LEV//USR//0023//314159265358979323' })
                .setTimestamp()
        ]
    },

    'vetting-fail': {
        label: '❌ Vetting Fail Log',
        description: 'Logged in #vetting-log when a member fails vetting',
        build: () => [
            new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle('Vetting Request – Level 2')
                .addFields(
                    { name: 'User', value: '<@271828182845904000> `271828182845904000`', inline: true },
                    { name: 'Vetting Standard', value: 'Level 2 — Community', inline: true },
                    { name: 'Requesting Member', value: '<@987654321098765432>', inline: true },
                    { name: 'Reason', value: 'Insufficient activity period.', inline: true },
                    { name: 'Result', value: '❌ **FAIL**' },
                    { name: 'Fail Reason', value: 'Member has only been in the server for 12 days. Minimum is 30 days. Additionally, two of the three vouch members do not meet eligibility criteria (Level 3+ required).' },
                    { name: 'ℹ️ No Actions Taken', value: 'Member roles unchanged. May reapply after 30-day minimum is met.' }
                )
                .setFooter({ text: 'Vetting Number: LEV//USR//0024//271828182845904000' })
                .setTimestamp()
        ]
    },

    'rank-log': {
        label: '🎖️ Rank Change Log',
        description: 'Posted to the rank webhook when a role is added or removed',
        build: () => [
            new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle('Rank Changed — Addition')
                .addFields(
                    { name: '👤 User', value: 'CoolMember\n`314159265358979323`', inline: true },
                    { name: '🎖️ Role Added', value: '**Level 2 Verified**', inline: true },
                    { name: '🛡️ Issued By', value: 'Sr_Moderator\n→ mod_sr', inline: true },
                    { name: '🗑️ Roles Removed', value: 'Level 1 Verified', inline: true },
                    { name: '📋 Reason', value: 'Passed Level 2 vetting process.', inline: true },
                    { name: '📊 Status', value: '✅ **SUCCESS**', inline: true }
                )
                .setTimestamp(),
            new EmbedBuilder()
                .setColor(0xFEE75C)
                .setTitle('🔴 Rank Changed — Removal')
                .addFields(
                    { name: '👤 User', value: 'ProblematicUser\n`271828182845904000`', inline: true },
                    { name: '🎖️ Role Removed', value: '**Level 2 Verified**', inline: true },
                    { name: '🛡️ Issued By', value: 'Admin_Lead\n→ admin_lead', inline: true },
                    { name: '✅ Authorisation', value: 'Council vote #2026-06-24', inline: true },
                    { name: '📋 Reason', value: 'Repeated conduct violations.', inline: true },
                    { name: '📊 Status', value: '✅ **SUCCESS**', inline: true }
                )
                .setTimestamp()
        ]
    },

    'cases-view': {
        label: '📋 Cases View',
        description: 'Paginated case list shown by /cases',
        build: () => [
            new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle('📋 Cases — The Hideaway')
                .setDescription('Showing 5 of 42 total cases · Filter: All types')
                .addFields(
                    { name: '⚠️ Warn #0001 · Jan 5, 2026', value: 'Spam in #general — multiple rapid messages.\n👤 @OffenderA · 🛡️ @Mod_Alpha' },
                    { name: '🔇 Mute #0012 · Feb 14, 2026', value: 'Heated argument in #debate — 2h mute.\n👤 @OffenderB · 🛡️ @Mod_Beta' },
                    { name: '👢 Kick #0028 · Mar 30, 2026', value: 'Alt account confirmed by IP check.\n👤 @OffenderC · 🛡️ @Mod_Alpha' },
                    { name: '🔨 Ban #0041 · May 2, 2026', value: 'NSFW content posted in main channels. No prior warnings.\n👤 @OffenderD · 🛡️ @Admin_Lead' },
                    { name: '⚠️ Warn #0042 · Jun 20, 2026', value: 'Minor rule violation — first offence.\n👤 @OffenderE · 🛡️ @Mod_Beta' }
                )
                .setFooter({ text: 'Page 1 / 9 · Use /case <id> for full details' })
        ]
    },

    'ticket-log': {
        label: '🎫 Ticket Event Log',
        description: 'All ticket lifecycle events (open/claim/close/delete etc.)',
        build: () => [
            new EmbedBuilder().setColor(0x2ecc71).setTitle('🎫 Report Ticket Opened')
                .addFields(
                    { name: '🪪 Ticket ID', value: '1234567890-001-1', inline: true },
                    { name: '🔢 Ticket Ref', value: 'report-001', inline: true },
                    { name: '🌐 Server', value: '1234567890' },
                    { name: '👤 Opened by', value: '<@314159265358979323> at <t:1750760400:F>' },
                    { name: '📋 Reason', value: '```Harassment from user @Problematic in #general — screenshots attached.```' }
                ).setTimestamp(),
            new EmbedBuilder().setColor(0x3498db).setTitle('🙋 Ticket Claimed')
                .addFields(
                    { name: '🪪 Ticket ID', value: '1234567890-001-1', inline: true },
                    { name: '🔢 Ticket Ref', value: 'report-001', inline: true },
                    { name: '🙋 Claimed by', value: '<@271828182845904523> at <t:1750760820:F>' }
                ).setTimestamp(),
            new EmbedBuilder().setColor(0x9b59b6).setTitle('🎯 Priority Updated')
                .addFields(
                    { name: '🪪 Ticket ID', value: '1234567890-001-1', inline: true },
                    { name: '🔢 Ticket Ref', value: 'report-001', inline: true },
                    { name: '📋 Reason', value: '```Escalated — involves banned alt account.```' }
                ).setTimestamp(),
            new EmbedBuilder().setColor(0x1abc9c).setTitle('📜 Transcript Created')
                .addFields(
                    { name: '🪪 Ticket ID', value: '1234567890-001-1', inline: true },
                    { name: '🔢 Ticket Ref', value: 'report-001', inline: true }
                ).setTimestamp(),
            new EmbedBuilder().setColor(0xe74c3c).setTitle('🔓 Report Ticket Closed')
                .addFields(
                    { name: '🪪 Ticket ID', value: '1234567890-001-1', inline: true },
                    { name: '🔢 Ticket Ref', value: 'report-001', inline: true },
                    { name: '🕐 Closed by', value: '<@271828182845904523> at <t:1750761900:F>' },
                    { name: '📋 Reason', value: '```Resolved. User issued 7-day ban. Evidence archived.```' }
                ).setTimestamp(),
            new EmbedBuilder().setColor(0x8b0000).setTitle('🗑️ Report Ticket Deleted')
                .addFields(
                    { name: '🪪 Ticket ID', value: '1234567890-001-1', inline: true },
                    { name: '🔢 Ticket Ref', value: 'report-001', inline: true },
                    { name: '🗑️ Deleted by', value: '<@271828182845904523> at <t:1750761960:F>' }
                ).setTimestamp()
        ]
    }
};

const SELECT_OPTIONS = Object.entries(FORMATS).map(([value, { label, description }]) =>
    new StringSelectMenuOptionBuilder()
        .setValue(value)
        .setLabel(label)
        .setDescription(description)
);

export default {
    data: new SlashCommandBuilder()
        .setName('format')
        .setDescription('Preview a TitanBot webhook or embed format')
        .addStringOption(o =>
            o.setName('type')
                .setDescription('Which format to preview')
                .setRequired(true)
                .addChoices(
                    { name: '🔨 Moderation Action Log', value: 'mod-log' },
                    { name: '🔍 Vetting Check', value: 'vetting-check' },
                    { name: '✅ Vetting Pass Log', value: 'vetting-pass' },
                    { name: '❌ Vetting Fail Log', value: 'vetting-fail' },
                    { name: '🎖️ Rank Change Log', value: 'rank-log' },
                    { name: '📋 Cases View', value: 'cases-view' },
                    { name: '🎫 Ticket Event Log', value: 'ticket-log' }
                )
        ),
    category: 'utility',

    async execute(interaction) {
        const type = interaction.options.getString('type');
        const format = FORMATS[type];

        if (!format) {
            return interaction.reply({ content: '❌ Unknown format type.', ephemeral: true });
        }

        const embeds = format.build();

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('format_select')
            .setPlaceholder('Switch format…')
            .addOptions(SELECT_OPTIONS);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
            content: `### 📐 Format Preview — ${format.label}\n-# Showing example output only · values shown are illustrative`,
            embeds,
            components: [row],
            ephemeral: true
        });
    }
};
