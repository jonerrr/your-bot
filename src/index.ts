import axios, { AxiosPromise } from "axios";
import { Client, Intents } from "discord.js";
import config from "../config.json";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

type BingResponse = {
  _type: string;
  flaggedTokens: FlaggedToken[];
};
type FlaggedToken = {
  offset: number;
  token: string;
  type: string;
  suggestions: Suggestion[];
};
type Suggestion = {
  suggestion: string;
  score: number;
};

client.on("ready", () => {
  if (!client.user) process.exit(1);
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (
    message.content.toLowerCase().includes("your") ||
    message.content.toLowerCase().includes("you're") ||
    message.content.toLowerCase().includes("youre")
  ) {
    const params = new URLSearchParams();
    params.append("text", message.content);
    params.append("setLang", "en-US");

    const check = await axios.request<BingResponse>({
      method: "POST",
      url: "https://api.bing.microsoft.com/v7.0/SpellCheck?mkt=en-US",
      headers: { "Ocp-Apim-Subscription-Key": config.key },
      data: params,
    });

    for (const suggestion of check.data.flaggedTokens)
      switch (suggestion.token.toLowerCase()) {
        case "you're":
          await message.reply({
            content:
              config.memes1[Math.floor(Math.random() * config.memes1.length)],
          });
          break;
        case "your":
          await message.reply({
            content:
              config.memes2[Math.floor(Math.random() * config.memes1.length)],
          });
          break;
      }
  }
});

client.login(config.token);
