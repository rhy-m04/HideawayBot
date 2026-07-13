# TitanBot - Discord Community Bot

## Overview
TitanBot is a modular Discord bot (discord.js v14) with moderation, economy,
leveling, tickets, giveaways, birthdays, reaction roles, server stats,
verification, and music features. It uses PostgreSQL for persistent storage
and runs a small Express web server alongside the bot for health checks.

## Stack
- Node.js (ESM), discord.js v14, @discordjs/voice, @discordjs/rest
- Express (health/status endpoints)
- PostgreSQL (Replit's built-in database, via `DATABASE_URL`)

## Running on Replit
- Workflow "Start application" runs `node src/app.js`.
- Required secrets (already configured): `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`.
- Database: uses Replit's built-in PostgreSQL automatically (`pgConfig` in
  `src/config/postgres.js` falls back to `DATABASE_URL`). Tables/indexes are
  auto-created and migrated on startup.
- The bot registers slash commands to the guild in `GUILD_ID` for instant
  testing (guild commands update immediately, unlike global commands).
- Music feature is currently disabled via `features.music = false` in
  `src/config/application.js`; the music command scaffolding and service
  exist but are gated off.

## User preferences
None recorded yet.
