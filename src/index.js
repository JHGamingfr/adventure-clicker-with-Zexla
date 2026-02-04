import "dotenv/config";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error("Missing DISCORD_TOKEN in .env");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadCommands = async () => {
  const commandsPath = path.join(__dirname, "commands");
  const files = (await readdir(commandsPath)).filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if (command?.data?.name && command?.execute) {
      client.commands.set(command.data.name, command);
    }
  }
};

client.once("ready", () => {
  console.log(`HockeyBot logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const message = "Something went sideways. Try that again in a sec.";
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: message, ephemeral: true });
    } else {
      await interaction.reply({ content: message, ephemeral: true });
    }
  }
});

await loadCommands();
await client.login(token);
