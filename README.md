# Fusion Solar Telegram Bot

A Telegram bot that queries the Huawei FusionSolar API to deliver real-time solar plant stats — power generation, house load, grid import/export, and daily energy balance.

## Requirements

- Node.js
- MongoDB running at `mongodb://localhost:27017`
- A Telegram bot token (from [@BotFather](https://t.me/BotFather))
- A Huawei FusionSolar account with API access

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:
   ```
   BOT_TOKEN=your_telegram_bot_token
   ```

3. Start MongoDB locally, then run the bot:
   ```bash
   npm start
   ```

## Bot Commands

| Command | Description |
|---|---|
| `/status` | Real-time solar yield, house load, and grid import/export |
| `/dailybalance` | Today's total imported and exported energy (kWh) |
| `/plants` | List your registered solar plants |
| `/devices` | List devices associated with a plant |

If your account has multiple plants, the bot will present an inline keyboard to select which plant to query.

## Architecture

The bot is built with [Telegraf](https://telegraf.js.org/) and TypeScript. User sessions and FusionSolar authentication tokens are persisted in MongoDB. Plants and devices are cached in the database after the first API call.

Authentication uses XSRF-TOKEN session tokens issued by the FusionSolar API. Tokens are stored per user and automatically refreshed when they expire.
