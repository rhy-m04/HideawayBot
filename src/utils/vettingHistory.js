import { getFromDb, setInDb } from './database.js';

function historyKey(guildId, userId) {
    return `vetting_history_${guildId}_${userId}`;
}

// Appends a shortId to the user's vetting history index (most recent last).
export async function addVettingHistoryEntry(guildId, userId, shortId) {
    const key = historyKey(guildId, userId);
    const ids = await getFromDb(key, []);
    ids.push(shortId);
    if (ids.length > 25) ids.splice(0, ids.length - 25);
    await setInDb(key, ids);
}

// Fetches full vetting records for a user, most recent first.
export async function getVettingHistory(guildId, userId) {
    const key = historyKey(guildId, userId);
    const ids = await getFromDb(key, []);
    const records = await Promise.all(ids.map(id => getFromDb(`vetting_${id}`, null)));
    return records
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
