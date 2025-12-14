import "dotenv/config";
import { Client } from "discord.js-selfbot-v13";
import { isJar, downloadJar, decompileJarAndDeleteWebhooks } from "./util.js";

const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (!message.inGuild()) return;
  if (message.guildId != "1362871078313267240") return;

  message.attachments.forEach(async (attachment) => {
    if (isJar(attachment)) {
      console.log(`JAR file detected: ${attachment.url}`);
      const inputJar = await downloadJar(attachment.url, attachment.name);
      await decompileJarAndDeleteWebhooks(inputJar);
    }
  });
});

const token = process.env.TOKEN;

if (!token) {
  throw new Error("TOKEN is not defined in environment variables");
}

client.login(token);