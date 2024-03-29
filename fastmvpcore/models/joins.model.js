const connectionDb = require("../../config/postgresdb");
module.exports = {
  async innerJoin(tables, dataJson) {
    return new Promise(async (resolve, reject) => {
      if (!tables?.table1 || !tables?.table2 || !dataJson?.keys || Object.values(dataJson.keys).length == 0) {
        return reject({
          status: "error",
          msg: !tables?.table1 ? "tables undefined" : "keys undefined",
          error: {
            code: !tables?.table1 ? "tableundefined" : "keysundefined",
          },
        });
      }
      const connection = connectionDb();
      const { makeSqlStringSelect } = require("../utils/toassemble");
      const { sanitationStringSql } = require("../utils/functions");
      const table1 = sanitationStringSql(tables.table1);
      const table2 = sanitationStringSql(tables.table2);
      let queryString = `SELECT ${makeSqlStringSelect(
        dataJson
      )} FROM ${table1} INNER JOIN ${table2} ON ${table1}.${sanitationStringSql(
        Object.keys(dataJson.keys)[0]
      )} = ${table2}.${sanitationStringSql(Object.values(dataJson.keys)[0])}`;
      console.log("queryString", queryString);
      const data = await connection
        .query(queryString)
        .catch((err) => {
          console.error(
            `MODEL Joins: Can not execute InnerJoin ON ${table1} and ${table2} `,
            err
          );
          return {
            status: "error",
            msg: "db",
            error: err,
          };
        });
      connection.end();
      if (Array.isArray(data.rows))
        return resolve({
          status: "ok",
          msg: "done",
          data: data.rows,
        });
      return reject(data);
    });
  },
  async innerJoinValueRight(tables, dataJson) {
    return new Promise(async (resolve, reject) => {
      if (!tables?.table1 || !tables?.table2) {
        return reject({
          status: "error",
          msg: "tables undefined",
          error: {
            code: "tableundefined",
          },
        });
      }
      if (!dataJson?.keys || Object.values(dataJson.keys).length == 0) {
        return reject({
          status: "error",
          msg: "keys undefined",
          error: {
            code: "keysundefined",
          },
        });
      }
      if (!dataJson?.value) {
        return reject({
          status: "error",
          msg: "value undefined",
          error: {
            code: "valueundefined",
          },
        });
      }
      const connection = connectionDb();
      const { makeSqlStringSelect } = require("../utils/toassemble");
      const { sanitationStringSql } = require("../utils/functions");
      const table1 = sanitationStringSql(tables.table1);
      const table2 = sanitationStringSql(tables.table2);
      let queryString = `SELECT ${makeSqlStringSelect(
        dataJson
      )} FROM ${table1} INNER JOIN ${table2} ON ${table1}.${sanitationStringSql(
        Object.keys(dataJson.keys)[0]
      )} = ${table2}.${sanitationStringSql(
        Object.values(dataJson.keys)[0]
      )} WHERE ${table2}.${sanitationStringSql(
        Object.values(dataJson.keys)[0]
      )}=$1`;
      console.log("queryString", queryString);
      const data = await connection
        .query(queryString, [sanitationStringSql(dataJson.value)])
        .catch((err) => {
          console.error(
            `MODEL Joins: Can not execute InnerJoin ON ${table1} and ${table2} `,
            err
          );
          return {
            status: "error",
            msg: "db",
            error: err,
          };
        });
      connection.end();
      if (Array.isArray(data.rows))
        return resolve({
          status: "ok",
          msg: "done",
          data: data.rows,
        });
      return reject(data);
    });
  },
  async innerJoinValueLeft(tables, dataJson) {
    return new Promise(async (resolve, reject) => {
      if (!tables?.table1 || !tables?.table2) {
        return reject({
          status: "error",
          msg: "tables undefined",
          error: {
            code: "tableundefined",
          },
        });
      }
      if (!dataJson?.keys || Object.values(dataJson.keys).length == 0) {
        return reject({
          status: "error",
          msg: "keys undefined",
          error: {
            code: "keysundefined",
          },
        });
      }
      if (!dataJson?.value) {
        return reject({
          status: "error",
          msg: "value undefined",
          error: {
            code: "valueundefined",
          },
        });
      }
      const connection = connectionDb();
      const { makeSqlStringSelect } = require("../utils/toassemble");
      const { sanitationStringSql } = require("../utils/functions");
      const table1 = sanitationStringSql(tables.table1);
      const table2 = sanitationStringSql(tables.table2);
      let queryString = `SELECT ${makeSqlStringSelect(
        dataJson
      )} FROM ${table1} INNER JOIN ${table2} ON ${table1}.${sanitationStringSql(
        Object.keys(dataJson.keys)[0]
      )} = ${table2}.${sanitationStringSql(
        Object.values(dataJson.keys)[0]
      )} WHERE ${table1}.${sanitationStringSql(
        Object.keys(dataJson.keys)[0]
      )}=$1`;
      console.log("queryString", queryString);
      const data = await connection
        .query(queryString, [sanitationStringSql(dataJson.value)])
        .catch((err) => {
          console.error(
            `MODEL Joins: Can not execute InnerJoin ON ${table1} and ${table2} `,
            err
          );
          console.log("erro.rows",err.rows)
          return {
            status: "error",
            msg: "db",
            error: err,
          };
        });
      connection.end();
      if (Array.isArray(data.rows))
        return resolve({
          status: "ok",
          msg: "done",
          data: data.rows,
        });
      return reject(data);
    });
  },
};