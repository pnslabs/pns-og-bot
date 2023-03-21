require("dotenv").config();
import { Client } from "discord.js";

import { IntentOptions, roles, variables } from "./config";
import { IMember, IMessage, IMessageCount } from "./types";
import { weeksBetween } from "./utils";

const client = new Client({
  intents: IntentOptions,
});

/// Create an empty object to store message counts
let messageCount: IMessageCount = {};
let currentMonth = new Date().getMonth();

// Function to manage user roles
const manageRole = (
  member: IMember,
  roleId: string,
  message: IMessage,
  userId: string,
  role: string
) => {
  member.roles
    .add(roleId)
    .then(() => {
      /// Send a confirmation message
      message.channel.send(
        `Congratulations <@${userId}>, you've been promoted to ${role}!!`
      );
    })
    .catch((err: any) => {
      console.error(err);
      message.channel.send("An error occurred while assigning the role.");
    });
};

/// When the bot is ready, log "Bot is ready!" to the console
client.on("ready", () => {
  console.log("Bot is ready!");
});

/// Listen for message events
client.on("message", (message: IMessage) => {
  const messageDate = message.createdAt;
  const isNewMonth = messageDate.getMonth() !== currentMonth;

  /// Ignore messages from bots
  if (message.author.bot) return;

  const userId = message.author.id;
  const twitterChannel = client.channels.cache.find(
    (channel: any) => channel.name === variables.twitterChannel
  );

  /// only handle messages from a specific channel
  if (twitterChannel && message.channel.id === twitterChannel.id) {
    messageCount[userId].twitterUsername = message.content;
  }

  /// Increment the user's message count and update the date if it's a new month or if user does not exist
  if (isNewMonth || !messageCount[userId]) {
    messageCount[userId].count = 1;
    messageCount[userId].date = messageDate;
    currentMonth = messageDate.getMonth();
  } else {
    messageCount[userId].count++;
    messageCount[userId].date = messageDate;
  }

  /// Get the guild, member objects
  const guild = message.guild;
  const member = guild.members.cache.get(userId);

  const joinedAt: Date = member.joinedAt;
  const currentDate = new Date();
  const weeksSinceJoined = weeksBetween(currentDate, joinedAt);

  /// Check if the user qualifies for Pioneer
  if (weeksSinceJoined >= 2 && messageCount[userId].count === 30) {
    // get the pioneer role
    const role = guild.roles.cache.find(
      (r: { name: string }) => r.name === variables.pioneerRole
    );
    const roleId = role ? role.id : roles.pioneer;

    manageRole(member, roleId, message, userId, "Pioneer");
  }
  /// Check if the user qualifies for Vanguard
  else if (weeksSinceJoined >= 4 && messageCount[userId].count === 70) {
    /// get the vanguard role
    const role = guild.roles.cache.find(
      (r: { name: string }) => r.name === variables.vanguardRole
    );
    const roleId = role ? role.id : roles.vanguard;

    manageRole(member, roleId, message, userId, "Vanguard");
  }
  /// Check if the user qualifies for Luminary
  else if (weeksSinceJoined >= 8 && messageCount[userId].count === 150) {
    /// get the luminary role
    const role = guild.roles.cache.find(
      (r: { name: string }) => r.name === "PNS Luminary"
    );
    const roleId = role ? role.id : roles.luminary;

    manageRole(member, roleId, message, userId, "Luminary");
  }
});

// Log in the bot using the bot token
client.login(process.env.DISCORD_BOT_TOKEN);
