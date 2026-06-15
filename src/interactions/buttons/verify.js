import { EmbedBuilder, MessageFlags } from 'discord.js';
import { logger } from '../../utils/logger.js';

const VERIFIED_ROLE_ID = '1511500090165039264';

export default [
    {
        name: 'verify',
        async execute(interaction, client) {
            const { member, guild } = interaction;

            if (member.roles.cache.has(VERIFIED_ROLE_ID)) {
                return interaction.reply({
                    content: '✅ You are already verified!',
                    flags: MessageFlags.Ephemeral
                });
            }

            const role = guild.roles.cache.get(VERIFIED_ROLE_ID)
                || await guild.roles.fetch(VERIFIED_ROLE_ID).catch(() => null);

            if (!role) {
                logger.error(`[Verify] Verified role ${VERIFIED_ROLE_ID} not found in guild ${guild.id}`);
                return interaction.reply({
                    content: '❌ Verification role not found. Please contact a staff member.',
                    flags: MessageFlags.Ephemeral
                });
            }

            try {
                await member.roles.add(role, 'Self-verified via panel');
            } catch (err) {
                logger.error(`[Verify] Failed to add role to ${member.id}:`, err.message);
                return interaction.reply({
                    content: '❌ Failed to assign your role. Please contact a staff member.',
                    flags: MessageFlags.Ephemeral
                });
            }

            const dmEmbed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle('Verification Notice')
                .setDescription(
                    `You have been verified in the Hideaway Community Server. ` +
                    `This means you now have access to our community channels, and lots of others available to all members of the community.`
                )
                .setTimestamp();

            await member.user.send({ embeds: [dmEmbed] }).catch(() => {});

            const confirmEmbed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle('✅ Verified!')
                .setDescription(`You've been verified and now have full access to **${guild.name}**. Welcome!`)
                .setTimestamp();

            await interaction.reply({ embeds: [confirmEmbed], flags: MessageFlags.Ephemeral });
        }
    }
];
