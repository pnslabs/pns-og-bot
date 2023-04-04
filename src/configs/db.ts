import { Sequelize, SequelizeScopeError } from "sequelize";
import { variables } from "../bot.config";

const { dbURL, dbSecure } = variables;

export const db: Sequelize = new Sequelize(dbURL, {
  // dialectOptions: dbSecure
  //   ? { ssl: { require: true, rejectUnauthorized: false } }
  //   : {},
  logging: false,
});

export const authenticate = async ({ clear = false }) => {
  await db
    .authenticate()
    .then(async () => {
      console.log("Connection to Database has been established successfully.");
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const models = require("../models");
      const opts = clear ? { force: true } : { alter: true };
      for (const schema in models) await models[schema].sync(opts);
      //   if (clear) await seed(models);
      console.log("Migrated");
    })
    .catch((error: SequelizeScopeError) =>
      console.error("Unable to connect to the database: " + error.message)
    );
};
