import { SlashCommandBuilder, MessageFlags, EmbedBuilder } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import { logger } from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('join-vc')
    .setDescription('Make the bot join your current voice channel.'),
  category: 'utility',

  async execute(interaction) {
    try {
      const voiceChannel = interaction.member?.voice?.channel;

      if (!voiceChannel) {
        return interaction.reply({
          content: ':warning: Join a Voice Chat for this command to work. Right now, you are not in a Voice.',
          flags: MessageFlags.Ephemeral
        });
      }

      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: true,
      });

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setAuthor({
          name: interaction.client.user.username,
          iconURL: interaction.client.user.displayAvatarURL()
        })
        .setDescription(`✅ Joined **${voiceChannel.name}**`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error('Error in join-vc command:', error);
      await interaction.reply({
        content: '❌ Failed to join the voice channel.',
        flags: MessageFlags.Ephemeral
      }).catch(() => {});
    }
  }
};
