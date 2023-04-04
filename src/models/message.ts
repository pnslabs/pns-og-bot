import { DataTypes } from "sequelize";
import { db } from "../configs/db";

export const Campaign = db.define(
  "Message",
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    channel: { type: DataTypes.STRING },
    content: { type: DataTypes.STRING },
    guild: { type: DataTypes.STRING },
  },
  { timestamps: true, tableName: "message" }
);