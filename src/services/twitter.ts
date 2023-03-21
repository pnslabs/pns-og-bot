require("dotenv").config();
import Twitter from "twitter";
import { IData } from "../types";

import { IntentOptions, roles, variables } from "./config";
import initDiscord from "./services/discord";
import { IMember, IMessage, IMessageCount } from "./types";
import { weeksBetween } from "./utils";

const twitterClient = new Twitter({
  consumer_key: variables.twitterConsumerKey!,
  consumer_secret: variables.twitterConsumerSecret!,
  access_token_key: variables.twitterAccessToken!,
  access_token_secret: variables.twitterAccessTokenSecret!,
});

/// Create an empty object to store data
let data: IData = {};

export const getTwitterUserID = async (username: string): Promise<string> => {
  let userId = "";

  await twitterClient.get(
    "users/lookup",
    { screen_name: username },
    function (error, users, response) {
      if (!error && users.length > 0) {
        var user_id = users[0].id_str;
        userId = user_id;
      } else {
        console.log("Error retrieving user ID: " + error);
      }
    }
  );

  return userId;
};

export const doesUserFollowPNS = async (username: string): Promise<boolean> => {
  let isFollowing = false;

  await twitterClient.get(
    "friendships/show",
    {
      source_screen_name: "pnslabs",
      target_screen_name: username,
    },
    function (error, friendship, response) {
      if (!error && friendship.relationship.target.following) {
        console.log("The other user is following you!");
        isFollowing = true;
      } else {
        console.log("The other user is not following you.");
        isFollowing = false;
      }
    }
  );

  return isFollowing;
};

export const streamTwitter = async () => {
  const PNSID = await getTwitterUserID("pnslabs");
  /// Listen for a follow event
  var stream = twitterClient.stream("statuses/filter", { follow: PNSID });

  stream.on("data", function (event) {
    if (event.event === "follow") {
      console.log("New follower: " + event.source.screen_name);

      for (const key in data) {
        if (data[key].twitterUsername === event.source.screen_name) {
          data[key].isFollowingPNS = true;
          break;
        }
      }
    }
  });

  stream.on("error", function (error) {
    console.log(error);
  });
};