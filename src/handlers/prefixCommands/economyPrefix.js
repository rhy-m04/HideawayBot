import { formatCurrency, getEconomyData, setEconomyData } from '../../utils/economy.js';
import { getGuildConfig } from '../../services/guildConfig.js';
import { logger } from '../../utils/logger.js';

// cooldowns & base amounts (kept small and consistent with existing commands)
const INCOME_COOLDOWN = 24 * 60 * 60 * 1000; // daily
const BASE_DAILY = 100;
const WORK_COOLDOWN = 30 * 60 * 1000;
const WORK_MIN = 50;
const WORK_MAX = 300;
const MINE_COOLDOWN = 60 * 60 * 1000;
const MINE_MIN = 400;
const MINE_MAX = 1200;

function safeRandomInt(min, max) {
  if (typeof min !== 'number' || typeof max !== 'number') return 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function handlePrefixEconomy(message, client) {
  try {
    if (!message || !message.guild || !message.content) return false;
    const guildId = message.guild.id;

    // get prefix from guild config, fallback to '!'
    const guildConfig = await getGuildConfig(client, guildId).catch(() => ({}));
    const prefix = (guildConfig && guildConfig.prefix) ? guildConfig.prefix : '!';

    if (!message.content.startsWith(prefix)) return false;

    const withoutPrefix = message.content.slice(prefix.length).trim();
    if (!withoutPrefix) return false;

    const parts = withoutPrefix.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Only handle a limited, explicit set of economy commands to reduce risk
    const allowed = new Set(['income','balance','pay','work','mine','inventory','eleaderboard','bal']);
    if (!allowed.has(command)) return false;

    // Quick guard: ignore bots
    if (message.author.bot) return true;

    // Handlers
    if (command === 'income') {
      const userId = message.author.id;
      const now = Date.now();

      const userData = await getEconomyData(client, guildId, userId);
      const lastIncome = userData.lastIncome || 0;
      if (now - lastIncome < INCOME_COOLDOWN) {
        const remaining = lastIncome + INCOME_COOLDOWN - now;
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        await message.reply(`❌ You already claimed income. Try again in ${hours}h ${minutes}m.`);
        return true;
      }

      const roleIncomeMap = (guildConfig && guildConfig.roleIncome) ? guildConfig.roleIncome : {};
      // compute role bonuses
      let roleBonus = 0;
      const breakdown = [];
      const member = await message.guild.members.fetch(userId).catch(() => null);
      if (member) {
        for (const [roleId, amt] of Object.entries(roleIncomeMap || {})) {
          const val = Number(amt) || 0;
          if (val > 0 && member.roles.cache.has(roleId)) {
            roleBonus += val;
            const role = message.guild.roles.cache.get(roleId);
            breakdown.push(`${role ? role.name : `<role:${roleId}>`}: ${formatCurrency(val)}`);
          }
        }
      }

      const total = (guildConfig?.economy?.dailyAmount) ? Number(guildConfig.economy.dailyAmount) + roleBonus : BASE_DAILY + roleBonus;
      userData.wallet = (userData.wallet || 0) + total;
      userData.lastIncome = now;
      await setEconomyData(client, guildId, userId, userData);

      const lines = [
        `✅ You received ${formatCurrency(total)}!`,
        `• Base: ${formatCurrency((guildConfig?.economy?.dailyAmount) ? Number(guildConfig.economy.dailyAmount) : BASE_DAILY)}`
      ];
      if (breakdown.length) lines.push(`• Role bonuses:\n${breakdown.join('\n')}`);
      lines.push(`• New Balance: ${formatCurrency(userData.wallet)}`);

      await message.reply(lines.join('\n'));
      return true;
    }

    if (command === 'balance' || command === 'bal') {
      // !balance [@user]
      const target = message.mentions.users.first() || message.author;
      const data = await getEconomyData(client, guildId, target.id);
      const wallet = data?.wallet || 0;
      const bank = data?.bank || 0;
      await message.reply(`${target.username}'s balance: Cash ${formatCurrency(wallet)}, Bank ${formatCurrency(bank)} (Total ${formatCurrency(wallet + bank)})`);
      return true;
    }

    if (command === 'pay') {
      // !pay @user amount
      const target = message.mentions.users.first();
      if (!target) {
        await message.reply('Usage: !pay @user <amount>');
        return true;
      }
      const amountArg = args.find(a => /^\d+$/.test(a));
      const amount = amountArg ? Number(amountArg) : 0;
      if (!amount || amount <= 0) {
        await message.reply('Please specify a valid amount to pay, e.g. `!pay @user 100`');
        return true;
      }
      if (target.id === message.author.id) {
        await message.reply("You can't pay yourself.");
        return true;
      }

      // transfer (simple)
      const senderData = await getEconomyData(client, guildId, message.author.id);
      if ((senderData?.wallet || 0) < amount) {
        await message.reply(`You don't have enough cash. Your wallet: ${formatCurrency(senderData?.wallet || 0)}`);
        return true;
      }
      senderData.wallet -= amount;
      await setEconomyData(client, guildId, message.author.id, senderData);

      const receiverData = await getEconomyData(client, guildId, target.id);
      receiverData.wallet = (receiverData.wallet || 0) + amount;
      await setEconomyData(client, guildId, target.id, receiverData);

      await message.reply(`✅ Successfully paid ${formatCurrency(amount)} to ${target.username}. Your new balance: ${formatCurrency(senderData.wallet)}`);
      return true;
    }

    if (command === 'work') {
      const userId = message.author.id;
      const now = Date.now();
      const userData = await getEconomyData(client, guildId, userId);
      const lastWork = userData.lastWork || 0;
      if (now - lastWork < WORK_COOLDOWN) {
        const remaining = lastWork + WORK_COOLDOWN - now;
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        await message.reply(`You're on cooldown. Try again in ${hours}h ${minutes}m.`);
        return true;
      }
      const earned = safeRandomInt(WORK_MIN, WORK_MAX);
      userData.wallet = (userData.wallet || 0) + earned;
      userData.lastWork = now;
      await setEconomyData(client, guildId, userId, userData);
      await message.reply(`💼 You worked and earned ${formatCurrency(earned)}! New balance: ${formatCurrency(userData.wallet)}`);
      return true;
    }

    if (command === 'mine') {
      const userId = message.author.id;
      const now = Date.now();
      const userData = await getEconomyData(client, guildId, userId);
      const lastMine = userData.lastMine || 0;
      if (now - lastMine < MINE_COOLDOWN) {
        const remaining = lastMine + MINE_COOLDOWN - now;
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        await message.reply(`Your pickaxe is cooling down. Try again in ${hours}h ${minutes}m.`);
        return true;
      }
      const earned = safeRandomInt(MINE_MIN, MINE_MAX);
      userData.wallet = (userData.wallet || 0) + earned;
      userData.lastMine = now;
      await setEconomyData(client, guildId, userId, userData);
      await message.reply(`⛏️ You mined and gained ${formatCurrency(earned)}! New balance: ${formatCurrency(userData.wallet)}`);
      return true;
    }

    if (command === 'inventory') {
      const userId = message.author.id;
      const data = await getEconomyData(client, guildId, userId);
      const inv = data.inventory || {};
      if (Object.keys(inv).length === 0) {
        await message.reply('Your inventory is empty.');
      } else {
        const lines = Object.entries(inv).map(([k,v]) => `• ${k}: ${v}x`);
        await message.reply(`📦 Your inventory:\n${lines.join('\n')}`);
      }
      return true;
    }

    if (command === 'eleaderboard') {
      // reuse the same approach as the slash version (list economy:<guildId>: keys)
      try {
        const prefixKey = `economy:${guildId}:`;
        let allKeys = [];
        if (client.db && typeof client.db.list === 'function') {
          allKeys = await client.db.list(prefixKey);
        }
        if (!Array.isArray(allKeys) || allKeys.length === 0) {
          await message.reply('No economy data available for this server yet.');
          return true;
        }
        const allData = [];
        for (const k of allKeys) {
          const uid = k.replace(prefixKey, '');
          const d = await client.db.get(k).catch(() => null);
          if (d) allData.push({ userId: uid, net: (d.wallet || 0) + (d.bank || 0) });
        }
        allData.sort((a,b) => b.net - a.net);
        const top = allData.slice(0,10);
        const lines = top.map((u,i) => `${i+1}. <@${u.userId}> — ${formatCurrency(u.net)}`);
        await message.reply(`🏆 Top ${top.length} Users:\n${lines.join('\n')}`);
      } catch (err) {
        logger.warn('eleaderboard prefix error', err?.message || err);
        await message.reply('Failed to fetch leaderboard.');
      }
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Prefix economy handler error:', error);
    // fail quietly so messageCreate proceeds
    return false;
  }
}
