import { Client } from "discord.js";

import { IntentOptions, roles, variables } from "../config";
import { data } from "../database";
import { IMember, IMessage } from "../types";
import { weeksBetween } from "../utils";
import { doesUserFollowPNS, getTwitterUserID } from "./twitter";

const discordClient = new Client({
  intents: IntentOptions,
});

let currentMonth = new Date().getMonth();

const initDiscord = () => {
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
  discordClient.on("ready", () => {
    console.log("Bot is ready!");
  });

  /// Listen for message events
  discordClient.on("message", async (message: IMessage) => {
    const messageDate = message.createdAt;
    const isNewMonth = messageDate.getMonth() !== currentMonth;

    /// Ignore messages from bots
    if (message.author.bot) return;

    const userId = message.author.id;
    const twitterChannel = discordClient.channels.cache.find(
      (channel: any) => channel.name === variables.twitterChannel
    );

    /// only handle messages from a specific channel
    if (twitterChannel && message.channel.id === twitterChannel.id) {
      const twitterUserName = message.content;

      const twitterUsernameId = await getTwitterUserID(twitterUserName);
      const isFollowingPns = await doesUserFollowPNS(twitterUserName);

      data[userId].twitterUsername = twitterUserName;
      data[userId].twitterUsernameID = twitterUsernameId;
      data[userId].isFollowingPNS = isFollowingPns;
    }

    /// Increment the user's message count and update the date if it's a new month or if user does not exist
    if (isNewMonth || !data[userId]) {
      data[userId].count = 1;
      data[userId].date = messageDate;
      currentMonth = messageDate.getMonth();
    } else {
      data[userId].count++;
      data[userId].date = messageDate;
    }

    /// Get the guild, member objects
    const guild = message.guild;
    const member = guild.members.cache.get(userId);

    const joinedAt: Date = member.joinedAt;
    const currentDate = new Date();
    const weeksSinceJoined = weeksBetween(currentDate, joinedAt);
    const isFollowingPNS = data[userId].isFollowingPNS;
    const twitterEngagementCount = data[userId].twitterEngagementCount;

    /// Check if the user qualifies for Pioneer
    if (isFollowingPNS && weeksSinceJoined >= 2 && data[userId].count === 30) {
      const role = guild.roles.cache.find(
        (r: { name: string }) => r.name === variables.pioneerRole
      );
      const roleId = role ? role.id : roles.pioneer;

      manageRole(member, roleId, message, userId, "Pioneer");
    }
    /// Check if the user qualifies for Vanguard
    else if (
      isFollowingPNS &&
      twitterEngagementCount > 5 &&
      weeksSinceJoined >= 4 &&
      data[userId].count === 70
    ) {
      const role = guild.roles.cache.find(
        (r: { name: string }) => r.name === variables.vanguardRole
      );
      const roleId = role ? role.id : roles.vanguard;

      manageRole(member, roleId, message, userId, "Vanguard");
    }
    /// Check if the user qualifies for Luminary
    else if (
      isFollowingPNS &&
      twitterEngagementCount > 20 &&
      weeksSinceJoined >= 8 &&
      data[userId].count === 150
    ) {
      const role = guild.roles.cache.find(
        (r: { name: string }) => r.name === variables.luminaryRole
      );
      const roleId = role ? role.id : roles.luminary;

      manageRole(member, roleId, message, userId, "Luminary");
    }
  });

  // Log in the bot using the bot token
  discordClient.login(variables.discordBotToken);
};

export default initDiscord;
