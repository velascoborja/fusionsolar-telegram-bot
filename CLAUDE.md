# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Run with ts-node (development)
npx tsc            # Compile TypeScript to dist/
```

No tests are configured (`npm test` exits with error).

## Environment

Requires a `.env` file with:
- `BOT_TOKEN` — Telegram bot token

Requires a local MongoDB instance at `mongodb://localhost:27017`, database `fusionsolarbot`.

## Architecture

This is a Telegram bot that queries the [Huawei FusionSolar](https://intl.fusionsolar.huawei.com/thirdData/) solar plant API and delivers real-time stats via Telegraf.

### Request flow

1. `src/app.ts` — Entry point. Connects to MongoDB, then initializes the Telegraf bot and registers all commands.
2. Each file in `src/commands/` exports a single function `command*(bot, fusionsolar)` that registers `bot.command()` and `bot.action()` handlers. Multi-plant users see an inline keyboard to pick a plant before data is fetched.
3. `src/datasource/api/fusionsolar.ts` — `FusionSolar` class wraps all API calls. Plants and devices are cached in MongoDB on first fetch; subsequent calls return the cached version.
4. `src/datasource/api/utils.ts` — `post()` helper attaches the user's XSRF-TOKEN to every request. On `failCode 305` (token expired), it calls `relogin()` to get a new token, persists it in MongoDB, then retries.
5. `src/datasource/db/DatabaseDataSource.ts` — MongoDB operations across three collections: `users` (stores per-user FusionSolar token), `plants`, `devices`.

### Authentication

FusionSolar uses XSRF-TOKEN session tokens. Each Telegram user has their own token stored in MongoDB. Token refresh is automatic (triggered by API `failCode 305`). The `relogin()` function in `utils.ts` currently has hardcoded credentials — this is a known TODO.

### Bot commands

| Command | Handler file | Description |
|---|---|---|
| `/status` | `commands/status.ts` | Real-time solar yield, house load, grid import/export |
| `/dailybalance` | `commands/balance.ts` | Today's imported/exported kWh |
| `/plants` | `commands/plants.ts` | List user's plants |
| `/devices` | `commands/devices.ts` | List devices for a plant |
| `/username` | `commands/user.ts` | Prompt user for their FusionSolar username |
