# HockeyBot

HockeyBot is a fun, non-gambling NHL companion Discord bot for chill predictions, game info, and hype.

## Features

- `/games` and `/tomorrow` for mock NHL schedules
- Fun-only predictions: winner, score, and goal scorer
- `/results` feedback with vibes (no points, no money, no rewards)
- `/mypicks`, `/resetpicks`, and `/hype`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```
3. Register slash commands (use `GUILD_ID` for fast dev registration):
   ```bash
   npm run deploy-commands
   ```
4. Start the bot:
   ```bash
   npm start
   ```

## Notes

- Game data is mock data stored in `src/data/mockNhlData.js` and can be swapped for a real NHL API later.
- Predictions are stored locally in `src/data/predictions.json`.
