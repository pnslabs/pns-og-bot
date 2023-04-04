import { DataTypes } from "sequelize";
import { db } from "../configs/db";

export type UserAttributes = {
  userId: string;
  twitterUsernameID?: string;
  twitterUsername?: string;
  twitterEngagementCount: number;
  isFollowingPNS?: boolean;
  discordMessageCount: number;
  date?: Date;
};

export const User = db.define(
  "User",
  {
    userId: { type: DataTypes.UUID, primaryKey: true },
    twitterUsernameID: { type: DataTypes.STRING },
    twitterUsername: { type: DataTypes.STRING },
    twitterEngagementCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    isFollowingPNS: { type: DataTypes.BOOLEAN, defaultValue: false },
    discordMessageCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    date: { type: DataTypes.DATE },
  },
  { timestamps: true, tableName: "user" }
);
