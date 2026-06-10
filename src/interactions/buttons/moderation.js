import { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { logger } from '../../utils/logger.js';

export default [
  {
    name: 'deactivate_invite',
    async execute(interaction) {
      try {
        const code = interaction.customId.split(':')[1];
        if (!code) {
          return interaction.reply({ content: '❌ Could not determine invite code.', flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const invite = await interaction.guild.invites.fetch(code).catch(() => null);
        if (!invite) {
          return interaction.editReply({ content: '⚠️ Invite not found — it may already be deactivated.' });
        }

        await invite.delete(`Deactivated by ${interaction.user.tag}`);

        const embed = new EmbedBuilder()
          .setColor(0xe74c3c)
          .setTitle('✅ Invite Deactivated')
          .setDescription(`Invite \`${code}\` has been successfully deactivated.`)
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

        const disabledRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`deactivate_invite:${code}`)
            .setLabel('Invite Deactivated')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('✅')
            .setDisabled(true)
        );
        await interaction.message.edit({ components: [disabledRow] }).catch(() => {});
      } catch (error) {
        logger.error('Error in deactivate_invite button:', error);
        const msg = { content: '❌ Failed to deactivate the invite.', flags: MessageFlags.Ephemeral };
        interaction.deferred ? interaction.editReply(msg) : interaction.reply(msg);
      }
    }
  },
  {
    name: 'dl_transcript',
    async execute(interaction) {
      try {
        await interaction.reply({
          content: '📥 The transcript was attached as a file when this ticket was closed. Scroll up to find the attachment in this channel.',
          flags: MessageFlags.Ephemeral
        });
      } catch (error) {
        logger.error('Error in dl_transcript button:', error);
      }
    }
  }
];
