const AllTablesModel = require("../../models/fastmvp/alltablescrud.model");
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
        if (create.error.code == "42P01") {
          return {
            status: "error",
            msg: "No existe la tabla " + table,
            code: create.error.code,
            detail: table,
            data: null,
          };
        } else if (create.error.code == "23505") {
          return {
            status: "error",
            msg: "Un dato está duplicado",
            code: create.error.code,
            detail: create.error.detail,
            data: null,
          };
        } else if (create.error.code == "23502") {
          return {
            status: "error",
            msg: "Un campo es requerido y está sin datos",
            code: create.error.code,
            detail: create.error.detail,
            data: null,
          };
        }
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
        if (updateResponse.error.code == "42P01") {
          return {
            status: "error",
            msg: "No existe la tabla " + table,
            code: updateResponse.error.code,
            detail: table,
            data: null,
          };
        } else if (updateResponse.error.code == "23505") {
          return {
            status: "error",
            msg: "Un dato está duplicado",
            code: updateResponse.error.code,
            detail: updateResponse.error.detail,
            data: null,
          };
        } else if (updateResponse.error.code == "rangeUpdate") {
          return {
            status: "error",
            msg: "No existe el valor para la condicional",
            code: updateResponse.error.code,
            detail: updateResponse.error.detail,
            data: null,
          };
        }
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
