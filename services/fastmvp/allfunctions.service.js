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
};
