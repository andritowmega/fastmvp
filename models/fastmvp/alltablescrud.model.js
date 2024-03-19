const connectionDb = require("../../config/postgresdb");
module.exports = {
  async create(table, dataJson) {
    return new Promise(async (resolve, reject) => {
      const connection = connectionDb();
      const { makeSqlString } = require("../../core/toassemble");
      const { sanitationStringSql } = require("../../core/functions");
      const queryString =
        `INSERT INTO  ${sanitationStringSql(table)} ` + makeSqlString(dataJson);
      console.log("queryString", queryString);
      const data = await connection
        .query(queryString, Object.values(dataJson))
        .catch((err) => {
          console.error("MODEL AllTablesCrud: Can not create - ", err);
          return {
            status: "error",
            msg: "db",
            error: err,
          };
        });
      connection.end();
      if (data?.rows?.length && data.rows.length > 0)
        return resolve({
          status: "ok",
          msg: "done",
          data: data.rows[0],
        });
      return reject(data);
    });
  },
};
