import { Events } from "discord.js";
import { logger, startupLog } from "../utils/logger.js";
import { logCommandLoadSummary } from '../utils/commandDiagnostics.js';
import config from "../config/application.js";
import { reconcileReactionRoleMessages } from "../services/reactionRoleService.js";
import { getFromDb, setInDb } from "../utils/database.js";

export default {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    try {
      client.user.setPresence(config.bot.presence);

      startupLog(`Ready! Logged in as ${client.user.tag}`);
      startupLog(`Serving ${client.guilds.cache.size} guild(s)`);
      startupLog(`Loaded ${client.commands.size} commands`);

      // Diagnostics: log command load summary (invalid entries, counts)
      try { logCommandLoadSummary(client); } catch (e) { logger.warn('command diagnostics failed', e); }

      const reconciliationSummary = await reconcileReactionRoleMessages(client);
      startupLog(
        `Reaction role reconciliation: scanned ${reconciliationSummary.scannedMessages}, removed ${reconciliationSummary.removedMessages}, errors ${reconciliationSummary.errors}`
      );

      // Delete any pending offline notice messages from the previous shutdown
      for (const [, guild] of client.guilds.cache) {
        try {
          const notice = await getFromDb(`offline_notice_${guild.id}`);
          if (!notice) continue;

          const nowSec = Math.floor(Date.now() / 1000);
          if (notice.expiresAt && nowSec < notice.expiresAt) {
            logger.info(`[Ready] Offline notice in ${guild.name} not yet expired — skipping deletion.`);
            continue;
          }

          await setInDb(`offline_notice_${guild.id}`, null);

          const channel = guild.channels.cache.get(notice.channelId)
            || await guild.channels.fetch(notice.channelId).catch(() => null);
          if (!channel?.isTextBased?.()) continue;

          const message = await channel.messages.fetch(notice.messageId).catch(() => null);
          if (message) {
            await message.delete().catch(() => {});
            logger.info(`[Ready] Deleted expired offline notice in ${guild.name}`);
          }
        } catch (err) {
          logger.warn(`[Ready] Could not clean up offline notice for guild ${guild.id}:`, err.message);
        }
      }
    } catch (error) {
      logger.error("Error in ready event:", error);
    }
  },
};
