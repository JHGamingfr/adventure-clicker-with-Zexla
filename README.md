# ClipKing 🤖🔥

ClipKing is a Discord bot built with Node.js and discord.js that keeps creators tapped into what is trending right now. It responds only when you ask, and it tailors results based on each user’s platform + content style preferences.

## ✨ Features

- Slash commands to set platforms + styles
- Casual, creator-friendly hype tone
- Bullet lists + quick “why it’s trending” notes
- Mock trend data that can be swapped for real APIs later

## 🧰 Commands

- `/setplatform` → Choose TikTok, YouTube, Shorts, or combined options
- `/setstyle` → Choose content interests (memes, gaming, sports, edits, challenges, commentary)
- `/trending` → Craziest trending memes/videos based on your preferences
- `/whatsviral` → Short, fast summary of what’s blowing up
- `/resetprefs` → Clears saved preferences

## ✅ Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
3. Fill in the values from your Discord Developer Portal:
   ```env
   DISCORD_TOKEN=your-bot-token
   CLIENT_ID=your-application-id
   GUILD_ID=optional-guild-id-for-faster-command-refresh
   ```

## ▶️ Run the bot

```bash
npm start
```

If you provide `GUILD_ID`, commands register instantly for that server. Without it, global registration can take a few minutes.

## 📦 Trend Data

Mock trends live in `src/data/trends.js` and are structured to be swapped for real trend APIs later.

---

🚀 **Why this bot is a W**

- Perfect for creators
- Perfect for Discord servers
- Scales later into real trend APIs, dashboards, daily summaries, and leaderboards
- Feels like a personal internet scout
