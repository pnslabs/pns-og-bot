import dotenv from "dotenv";
import { authenticate } from "./configs/db";
dotenv.config();

import initDiscord from "./services/discord";
// import { initTwitter } from "./services/twitter";

initDiscord();
// initTwitter();
