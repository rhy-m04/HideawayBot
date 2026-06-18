import { MessageFlags } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { getMappings } from '../../services/googleGroupsService.js';

export default [
    {
        name: 'google_link_check',
        async execute(interaction) {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            try {
                const mappings = await getMappings(interaction.guildId);

                if (!mappings.length) {
                    return interaction.editReply({
                        embeds: [createEmbed({
                            title: '📋 Google Groups',
                            description: 'No Google Group mappings have been configured for this server yet.\n\nCheck back later or contact a staff member.',
                            color: 'primary',
                        })],
                    });
                }

                const memberRoles = interaction.member.roles.cache;
                const myGroups = mappings.filter(m => memberRoles.has(m.roleId));

                if (!myGroups.length) {
                    return interaction.editReply({
                        embeds: [createEmbed({
                            title: '📋 Your Google Groups',
                            description: 'None of your current roles are mapped to a Google Group.\n\nOnce you\'re verified and assigned your roles, come back here to see which groups apply to you.\n\nIf you think this is wrong, contact a staff member.',
                            color: 'primary',
                        })],
                    });
                }

                const groupLines = myGroups.map(m => {
                    const name = m.groupName && m.groupName !== m.groupEmail ? m.groupName : m.groupEmail;
                    const slug = m.groupEmail.split('@')[0];
                    return `**${name}**\n📧 \`${m.groupEmail}\`\n🔗 [Open on groups.google.com](https://groups.google.com/g/${slug})`;
                });

                return interaction.editReply({
                    embeds: [createEmbed({
                        title: '📋 Your Google Groups',
                        description: `Based on your roles, you should be a member of the following Google Group${myGroups.length !== 1 ? 's' : ''}:\n\n${groupLines.join('\n\n')}\n\n**How to join:** Click the link above, sign in with your linked Gmail, and request to join.`,
                        color: 'success',
                    })],
                });
            } catch (err) {
                return interaction.editReply({
                    embeds: [createEmbed({
                        title: '❌ Error',
                        description: 'Something went wrong. Please try again or contact a staff member.',
                        color: 'error',
                    })],
                });
            }
        }
    }
];
