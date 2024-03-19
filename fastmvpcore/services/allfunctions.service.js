const AllTablesModel = require("../models/alltablescrud.model");
module.exports = {
  async create(table, dataJson) {
    const create = await AllTablesModel.create(table, dataJson).catch((e) => {
      console.error("SERVICE AllFunctions: can not create", e);
      return e;
    });
    if (create?.status && create.status == "ok") {
      return {
        status: "ok",
        msg: "Se insertó correctamente",
        data: create.data,
      };
    } else {
      if (create?.error?.code) {
        const { errorControlWithSqlCode } = require("../utils/functions");
        let formatError = errorControlWithSqlCode(create,table);
        if (formatError.conditional) return formatError.payload;
      }
      return {
        status: "error",
        msg: "Error desconocido",
        code: 500,
        data: null,
      };
    }
  },
  async update(table, dataJson, condition) {
    const updateResponse = await AllTablesModel.update(table, dataJson, condition).catch((e) => {
      console.error("SERVICE AllFunctions: can not update", e);
      return e;
    });
    console.log("update", updateResponse);
    if (updateResponse?.status && updateResponse.status == "ok") {
      return {
        status: "ok",
        msg: "Se actualizo correctamente",
        data: updateResponse.data,
      };
    } else {
      if (updateResponse?.error?.code) {
        const { errorControlWithSqlCode } = require("../utils/functions");
        let formatError = errorControlWithSqlCode(updateResponse,table);
        if(formatError.conditional) return formatError.payload;
      }
      return {
        status: "error",
        msg: "Error desconocido",
        code: 500,
        data: null,
      };
    }
  },
};
