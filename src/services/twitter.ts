import Twitter from "twitter";

import { variables } from "../bot.config";

const twitterClient = new Twitter({
  consumer_key: variables.twitterConsumerKey || "",
  consumer_secret: variables.twitterConsumerSecret || "",
  access_token_key: variables.twitterAccessToken || "",
  access_token_secret: variables.twitterAccessTokenSecret || "",
});

export const getTwitterUserID = async (username: string): Promise<string> => {
  let userId = "";

  await twitterClient.get(
    "users/lookup",
    { screen_name: username },
    function (error, users) {
      if (!error && users.length > 0) {
        const user_id = users[0].id_str;
        userId = user_id;
      } else {
        console.log(`Error retrieving user ID: ${error}`);
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
    function (error, friendship) {
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

export const initTwitter = async () => {
  /// Listen for a follow events
  const stream = twitterClient.stream("user");

  stream.on("data", function (event) {
    /// if it is a follow event
    if (event.event === "follow") {
      console.log("New follower: " + event.source.screen_name);

      // for (const key in data) {
      //   if (data[key].twitterUsernameID === event.source.id_str) {
      //     data[key].isFollowingPNS = true;
      //     break;
      //   }
      // }
    }
    /// if it is an engagement event
    if (
      event.event === "favorite" ||
      event.event === "retweet" ||
      event.event === "reply"
    ) {
      console.log(`New ${event.event} from user ${event.source.screen_name}`);

      // for (const key in data) {
      //   if (data[key].twitterUsernameID === event.source.id_str) {
      //     data[key].twitterEngagementCount = data[key].twitterEngagementCount
      //       ? data[key].twitterEngagementCount++
      //       : 1;

      //     break;
      //   }
      // }
    }
  });

  stream.on("error", function (error) {
    console.log(`An error occured ${error}`);
  });
};
