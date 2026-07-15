// Vetting eligibility rules, derived from the Hideaway vetting standards sheet.
// These are used to generate a PASS/FAIL *suggestion* on the /vetting check panel —
// staff always make the final call via the Pass/Fail buttons.

const DAY_MS = 24 * 60 * 60 * 1000;

// Internal note severity, low -> high. "Resolved" notes never count against a user.
export const NOTE_SEVERITY_RANK = {
    Resolved: 0,
    Minor: 1,
    Moderate: 2,
    Major: 3,
    Critical: 4,
    // Back-compat for notes created before the severity-based types existed
    positive: 0,
    neutral: 1,
    warning: 2,
    alert: 3
};

// Moderation sanction severity, low -> high, with a default "still counts as active for"
// window used when a case has no explicit expiry recorded.
export const ACTION_SEVERITY_RANK = { Minimal: 1, Gross: 2, Severe: 3 };
export const ACTION_DEFAULT_EXPIRY_DAYS = { Minimal: 14, Gross: 30, Severe: 180 };

// Requirements per vetting level, taken directly from the standards sheet.
export const LEVEL_REQUIREMENTS = {
    Moderation: {
        accountAgeDays: 180,
        serverJoinDays: 30,
        noteThreshold: null, // N/A — internal notes aren't checked at this level
        actionThreshold: 'Gross', // fails on active Gross Misconduct or worse
        failWindowDays: 30
    },
    Executive: {
        accountAgeDays: 270,
        serverJoinDays: 90,
        noteThreshold: 'Major',
        actionThreshold: 'Minimal', // fails on any active sanction
        failWindowDays: 60
    },
    Enhanced: {
        accountAgeDays: 360,
        serverJoinDays: 180,
        noteThreshold: 'Moderate',
        actionThreshold: 'Minimal',
        failWindowDays: 120
    },
    Management: {
        accountAgeDays: 360,
        serverJoinDays: 360,
        noteThreshold: 'Minor',
        actionThreshold: 'Minimal',
        failWindowDays: 120
    }
};

// Maps a logged moderation case's action label to a severity bucket.
export function classifyActionSeverity(actionLabel = '') {
    const a = actionLabel.toLowerCase();
    if (a.includes('ban')) return 'Severe';
    if (a.includes('kick')) return 'Gross';
    if (a.includes('timeout') || a.includes('timed out') || a.includes('warn')) return 'Minimal';
    return 'Minimal';
}

// Determines whether a moderation case should still be treated as "active" for
// vetting purposes — either it has an explicit expiry in the future, or it's within
// the default window for its severity, and hasn't been reversed by an unban/untimeout.
export function isCaseActive(c, severity, now, reversalTimestamps = []) {
    const expiryRaw = c.metadata?.expiryDate || c.metadata?.timeoutEnds;
    let expiresAt;
    if (expiryRaw) {
        expiresAt = new Date(expiryRaw).getTime();
    } else {
        const createdAt = new Date(c.createdAt).getTime();
        expiresAt = createdAt + (ACTION_DEFAULT_EXPIRY_DAYS[severity] || 14) * DAY_MS;
    }

    if (expiresAt <= now) return false;

    const createdAt = new Date(c.createdAt).getTime();
    // If a later unban/untimeout exists for this user, treat the original case as reversed.
    if (reversalTimestamps.some(ts => ts > createdAt)) return false;

    return true;
}

/**
 * Computes a suggested PASS/FAIL recommendation for a vetting check.
 * @returns {{ recommendation: 'PASS'|'FAIL', failReasons: string[] }}
 */
export function computeVettingRecommendation({
    level,
    accountAgeDays,
    serverJoinDays,
    activeCases, // [{ action, severity }]
    notes, // raw internal notes array
    lastFailedAt, // ms timestamp of most recent FAILED vetting at any level, or null
    now = Date.now()
}) {
    const req = LEVEL_REQUIREMENTS[level];
    const failReasons = [];

    if (!req) {
        return { recommendation: 'FAIL', failReasons: ['Unknown vetting level.'] };
    }

    if (accountAgeDays < req.accountAgeDays) {
        failReasons.push(`Discord account is only ${accountAgeDays}d old (needs ${req.accountAgeDays}d+).`);
    }

    if (serverJoinDays < req.serverJoinDays) {
        failReasons.push(`Has only been in the server for ${serverJoinDays}d (needs ${req.serverJoinDays}d+).`);
    }

    if (req.noteThreshold) {
        const thresholdRank = NOTE_SEVERITY_RANK[req.noteThreshold];
        const qualifyingNote = (notes || []).find(n => (NOTE_SEVERITY_RANK[n.type] ?? 0) >= thresholdRank);
        if (qualifyingNote) {
            failReasons.push(`Has an internal note at **${qualifyingNote.type}** severity or higher (${req.noteThreshold}+ disqualifies).`);
        }
    }

    if (req.actionThreshold) {
        const thresholdRank = ACTION_SEVERITY_RANK[req.actionThreshold];
        const qualifyingCase = (activeCases || []).find(c => ACTION_SEVERITY_RANK[c.severity] >= thresholdRank);
        if (qualifyingCase) {
            failReasons.push(`Has an active **${qualifyingCase.severity}** sanction (${qualifyingCase.action}) — ${req.actionThreshold}+ disqualifies.`);
        }
    }

    if (lastFailedAt) {
        const daysSinceFail = Math.floor((now - lastFailedAt) / DAY_MS);
        if (daysSinceFail < req.failWindowDays) {
            failReasons.push(`Failed a vetting ${daysSinceFail}d ago (needs ${req.failWindowDays}d since last fail).`);
        }
    }

    return {
        recommendation: failReasons.length > 0 ? 'FAIL' : 'PASS',
        failReasons
    };
}
