import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags } from 'discord.js';
import { getUserGoogleEmail } from '../../services/googleGroupsService.js';

export default [
    {
        name: 'link_google_email',
        async execute(interaction) {
            const existing = await getUserGoogleEmail(interaction.user.id);

            const modal = new ModalBuilder()
                .setCustomId('google_email_modal')
                .setTitle(existing ? 'Update Google Email' : 'Link Google Email');

            const emailInput = new TextInputBuilder()
                .setCustomId('google_email')
                .setLabel('Your Google Email Address')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('example@gmail.com')
                .setRequired(true)
                .setMinLength(6)
                .setMaxLength(254);

            if (existing) emailInput.setValue(existing);

            modal.addComponents(new ActionRowBuilder().addComponents(emailInput));
            await interaction.showModal(modal);
        }
    }
];
