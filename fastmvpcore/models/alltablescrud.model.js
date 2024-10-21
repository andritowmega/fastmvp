const connectionDb = require("../../config/postgresdb");
module.exports = {
  async create(project, table, dataJson) {
    return new Promise(async (resolve, reject) => {
      const connection = connectionDb(project); if(!connection){return reject({status: "error", msg: "wrong project", error: {code: "wrongproject"}});}
      const { makeSqlStringInsert } = require("../utils/toassemble");
      const { sanitationStringSql } = require("../utils/functions");
      const queryString =
        `INSERT INTO  ${sanitationStringSql(table)} ` +
        makeSqlStringInsert(dataJson);
      console.log("queryString", queryString);
      //console.log("values",Object.values(dataJson))
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
  async get(project, table, dataJson) {
    return new Promise(async (resolve, reject) => {
      const connection = connectionDb(project); if(!connection){return reject({status: "error", msg: "wrong project", error: {code: "wrongproject"}});}
      const { makeSqlStringSelect,makeSqlStringSelectWhere,makeSqlStringSelectOrder,makeSqlStringSelectLimit } = require("../utils/toassemble");
      const { sanitationStringSql } = require("../utils/functions");
      let queryString = `SELECT ${makeSqlStringSelect(
        dataJson
      )} FROM ${sanitationStringSql(table)} ${makeSqlStringSelectWhere(dataJson)} ${makeSqlStringSelectOrder(dataJson)} ${makeSqlStringSelectLimit(dataJson)}`;
      console.log("queryString", queryString);
      const data = await connection.query(queryString).catch((err) => {
        console.error("MODEL AllTablesCrud: Can not select - ", err);
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
  async update(project, table, dataJson, condition) {
    return new Promise(async (resolve, reject) => {
      const connection = connectionDb(project); if(!connection){return reject({status: "error", msg: "wrong project", error: {code: "wrongproject"}});}
      const { makeSqlStringUpdate } = require("../utils/toassemble");
      const { sanitationStringSql } = require("../utils/functions");
      const queryString = `UPDATE  ${sanitationStringSql(
        table
      )} SET ${makeSqlStringUpdate(dataJson, condition)}`;
      console.log("queryString", queryString);
      const data = await connection
        .query(queryString, Object.values(dataJson))
        .catch((err) => {
          console.error("MODEL AllTablesCrud: Can not update - ", err);
          return {
            status: "error",
            msg: "db",
            error: err,
          };
        });
      connection.end();
      if (
        data?.command &&
        data?.command == "UPDATE" &&
        data.rows.length === 0
      ) {
        return reject({
          status: "error",
          msg: "key out range",
          error: {
            code: "outrange",
          },
        });
      }
      if (data?.rows?.length && data.rows.length > 0)
        return resolve({
          status: "ok",
          msg: "done",
          data: data.rows[0],
        });

      return reject(data);
    });
  },
  async delete(project, table, condition) {
    return new Promise(async (resolve, reject) => {
      const connection = connectionDb(project); if(!connection){return reject({status: "error", msg: "wrong project", error: {code: "wrongproject"}});}
      const { makeSqlStringDelete } = require("../utils/toassemble");
      const { sanitationStringSql } = require("../utils/functions");
      const queryString = `DELETE FROM ${sanitationStringSql(
        table
      )} ${makeSqlStringDelete(condition)}`;
      console.log("queryString", queryString);
      const data = await connection.query(queryString).catch((err) => {
        console.error("MODEL AllTablesCrud: Can't delete' - ", err);
        return {
          status: "error",
          msg: "db",
          error: err,
        };
      });
      connection.end();
      if (
        data?.command &&
        data?.command == "DELETE" &&
        data.rows.length === 0
      ) {
        return reject({
          status: "error",
          msg: "key out range",
          error: {
            code: "outrange",
          },
        });
      }
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
