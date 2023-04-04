import { Sequelize, SequelizeScopeError } from "sequelize";
import { variables} from "../bot.config";

const {dbURL, dbSecure } = variables;

export let db: Sequelize = new Sequelize(dbURL, {
  dialectOptions: dbSecure
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  logging: false,
});


export const authenticate = ({ clear = false, secure = false }) => {
  db.authenticate()
    .then(async () => {
      console.log("Connection to Database has been established successfully.");
      const models = require("../models");
      const opts = clear ? { force: true } : { alter: true };
      for (let schema in models) await models[schema].sync(opts);
    //   if (clear) await seed(models);
      console.log("Migrated");
    })
    .catch((error: SequelizeScopeError) =>
      console.error("Unable to connect to the database: " + error.message)
    );
};
