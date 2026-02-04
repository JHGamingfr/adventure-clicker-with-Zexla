import "dotenv/config";
import { REST, Routes } from "discord.js";
import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId) {
  throw new Error("DISCORD_TOKEN and CLIENT_ID are required in .env");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadCommands = async () => {
  const commandsPath = path.join(__dirname, "commands");
  const files = (await readdir(commandsPath)).filter((file) => file.endsWith(".js"));
  const commands = [];

  for (const file of files) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if (command?.data?.toJSON) {
      commands.push(command.data.toJSON());
    }
  }

  return commands;
};

const rest = new REST({ version: "10" }).setToken(token);
const commands = await loadCommands();

if (guildId) {
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
  console.log("Guild commands deployed.");
} else {
  await rest.put(Routes.applicationCommands(clientId), { body: commands });
  console.log("Global commands deployed.");
}
