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

// Removes a specific shortId from the user's history index and deletes its DB record.
export async function removeVettingHistoryEntry(guildId, userId, shortId) {
    const key = historyKey(guildId, userId);
    const ids = await getFromDb(key, []);
    const filtered = ids.filter(id => id !== shortId);
    await setInDb(key, filtered);
    // Remove the record itself so it no longer shows up anywhere
    await setInDb(`vetting_${shortId}`, null);
    return ids.length !== filtered.length; // true if something was actually removed
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
