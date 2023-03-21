import { GatewayIntentsString } from "discord.js";

export const IntentOptions: GatewayIntentsString[] = [
  "GuildMembers",
  "GuildMessages",
  "Guilds",
  "MessageContent",
];

export const roles = {
  pioneer: process.env.PNS_PIONEER_ROLE_ID,
  vanguard: process.env.PNS_VANGUARD_ROLE_ID,
  luminary: process.env.PNS_LUMINARY_ROLE_ID,
};

export const variables = {
  twitterChannel: "meeting-plans",
  pioneerRole: "PNS Pioneer",
  vanguardRole: "PNS Vanguard",
  luminaryRole: "PNS Luminary",
  twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
  twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  twitterAccessToken: process.env.TWITTER_ACCESS_TOKEN,
  twitterAccessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  discordBotToken: process.env.DISCORD_BOT_TOKEN,
};
