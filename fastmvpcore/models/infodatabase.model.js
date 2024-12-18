const connectionDb = require("../../config/postgresdb");
module.exports = {

  async getTables(project) {
    return new Promise(async (resolve, reject) => {
      const connection = connectionDb(project);
      if (!connection) {
        return reject({
          status: "error",
          msg: "wrong project",
          error: { code: "wrongproject" },
        });
      }

      const { sanitationStringSql } = require("../utils/functions");
      let queryString = `SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE';
        `;
      console.log("queryString", queryString);
      const data = await connection.query(queryString).catch((err) => {
        console.error("MODEL Info Data Base: Can not select - ", err);
        return {
          status: "error",
          msg: "db",
          error: err,
        };
      });
      connection.end();
      if (data?.rows)
        return resolve({
          status: "ok",
          msg: "done",
          data: data.rows,
        });
      return reject(data);
    });
  },
  async getMetaDataTable(project,table) {
    return new Promise(async (resolve, reject) => {
      const connection = connectionDb(project);
      if (!connection) {
        return reject({
          status: "error",
          msg: "wrong project",
          error: { code: "wrongproject" },
        });
      }

      const { sanitationStringSql } = require("../utils/functions");
      let queryString = `SELECT column_name, data_type, is_nullable, character_maximum_length
                          FROM information_schema.columns
                          WHERE table_name = '${sanitationStringSql(table)}';`;
      console.log("queryString", queryString);
      const data = await connection.query(queryString).catch((err) => {
        console.error("MODEL get metadata table: Can not select - ", err);
        return {
          status: "error",
          msg: "db",
          error: err,
        };
      });
      connection.end();
      if (data?.rows)
        return resolve({
          status: "ok",
          msg: "done",
          data: data.rows,
        });
      return reject(data);
    });
  },
};

