require("dotenv").config();

import initDiscord from "./services/discord";
import { initTwitter } from "./services/twitter";

initDiscord();
// initTwitter();
