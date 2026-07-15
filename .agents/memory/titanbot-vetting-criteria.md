---
name: TitanBot vetting recommendation rules
description: Where the vetting PASS/FAIL suggestion thresholds come from and how they're computed, for future changes to /vetting check.
---

`/vetting check` auto-suggests PASS/FAIL using thresholds from the Hideaway vetting standards sheet (account age, time in server, internal-note severity, active-sanction severity, days since last failed vetting — all per vetting level: Moderation/Executive/Enhanced/Management). Logic lives in `src/utils/vettingCriteria.js`; per-user vetting history index lives in `src/utils/vettingHistory.js`.

**Why:** the sheet's severity buckets (internal notes: Resolved/Minor/Moderate/Major/Critical; moderation actions: Minimal/Gross/Severe) aren't stored explicitly on moderation cases — case "action" is a free-text label like "Member Banned"/"Member Kicked"/"Member Timed Out"/"User Warned", so severity has to be inferred via `classifyActionSeverity()`, and case "active" status is inferred via expiry heuristics (`isCaseActive()`) since there's no explicit active/resolved flag on cases (bans/timeouts are only reversed by a later separate "Member Unbanned"/"Member Untimeouted" case).

**How to apply:** if the standards sheet changes, update `LEVEL_REQUIREMENTS` in `vettingCriteria.js`. If new moderation action types are added, extend `classifyActionSeverity()`'s matching. The recommendation is always a suggestion surfaced in the embed — staff still click Pass/Fail manually.
