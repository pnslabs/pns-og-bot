require("dotenv").config();
import { IMessage, IMessageCount } from "./types";

// Import Discord.js library and create a new client
const Discord = require("discord.js");
const client = new Discord.Client();

// Create an empty object to store message counts
let messageCount: IMessageCount = {};

// Set the role ID for auto-assignment
const roles = {
  pioneer: process.env.PNS_PIONEER_ROLE_ID,
  vanguard: process.env.PNS_VANGUARD_ROLE_ID,
  luminary: process.env.PNS_LUMINARY_ROLE_ID,
};

// When the bot is ready, log "Bot is ready!" to the console
client.on("ready", () => {
  console.log("Bot is ready!");
});

// Listen for message events
client.on("message", (message: IMessage) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Get the user's ID
  const userId = message.author.id;

  // Increment the user's message count
  if (!messageCount[userId]) {
    messageCount[userId] = 1;
  } else {
    messageCount[userId]++;
  }

  // Check if the user has sent 30 messages
  if (messageCount[userId] === 30) {
    // Get the guild, member and role objects
    const guild = message.guild;
    const member = guild.members.cache.get(userId);
    const role = guild.roles.cache.find(
      (r: { name: string }) => r.name === "PNS Pioneer"
    );
    const roleId = role ? role.id : roles.pioneer;

    // Add the role to the member
    member.roles
      .add(roleId)
      .then(() => {
        // Send a confirmation message
        message.channel.send(
          `Congratulations <@${userId}>, you've been promoted to Pioneer!!`
        );
      })
      .catch((err: any) => {
        console.error(err);
        message.channel.send("An error occurred while assigning the role.");
      });
  }
});

// Log in the bot using the bot token
client.login(process.env.DISCORD_BOT_PUBLIC_KEY);
