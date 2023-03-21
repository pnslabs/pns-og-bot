require("dotenv").config();
import Twitter from "twitter";

import { IntentOptions, roles, variables } from "./config";
import initDiscord from "./services/discord";
import { IMember, IMessage, IMessageCount } from "./types";
import { weeksBetween } from "./utils";

// const twitterClient = new Twitter({
//   consumer_key: variables.twitterConsumerKey!,
//   consumer_secret: variables.twitterConsumerSecret!,
//   access_token_key: variables.twitterAccessToken!,
//   access_token_secret: variables.twitterAccessTokenSecret!,
// });

initDiscord();
