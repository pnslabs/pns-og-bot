import { DataTypes } from "sequelize";
import { db } from "../configs/db";

export const Campaign = db.define(
  "User",
  {
    userId: { type: DataTypes.UUID, primaryKey: true },
    twitterUsernameID: { type: DataTypes.STRING },
    twitterUsername: { type: DataTypes.STRING },
    twitterEngagementCount: { type: DataTypes.INTEGER },
    count: { type: DataTypes.INTEGER },
  },
  { timestamps: true, tableName: "user" }
);
