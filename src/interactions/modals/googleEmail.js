import { EmbedBuilder, MessageFlags } from 'discord.js';
import { setUserGoogleEmail, getUserGoogleEmail } from '../../services/googleGroupsService.js';
import { logger } from '../../utils/logger.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
    name: 'google_email_modal',
    async execute(interaction) {
        const email = interaction.fields.getTextInputValue('google_email')?.trim().toLowerCase();

        if (!EMAIL_REGEX.test(email)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(0xED4245)
                    .setTitle('❌ Invalid Email')
                    .setDescription('That doesn\'t look like a valid email address. Please try again.')
                ],
                flags: MessageFlags.Ephemeral
            });
        }

        const previous = await getUserGoogleEmail(interaction.user.id);
        await setUserGoogleEmail(interaction.user.id, email);

        logger.info(`[GoogleEmail] User ${interaction.user.id} linked Google email (guild: ${interaction.guildId})`);

        const isUpdate = !!previous && previous !== email;

        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle(isUpdate ? '✅ Email Updated' : '✅ Email Linked')
                .setDescription(
                    isUpdate
                        ? `Your Google email has been updated to \`${email}\`.\n\nStaff can now sync your server roles based on your Google Group memberships.`
                        : `Your Google email \`${email}\` has been linked to your account.\n\nStaff can now sync your server roles based on your Google Group memberships.`
                )
                .setFooter({ text: 'Your email is only visible to server staff.' })
            ],
            flags: MessageFlags.Ephemeral
        });
    }
};
