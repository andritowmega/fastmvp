const InfoDataBase = require("../models/infodatabase.model");
const viewerService = {
  async getTables(project){
      const create = await InfoDataBase.getTables(project).catch((e) => {
          console.error("SERVICE Viewer service: can not get", e);
          return e;
        });
        if (create?.status && create.status == "ok") {
          return {
            status: "ok",
            msg: "Datos obtenidos",
            data: create.data,
          };
        } else {
          if (create?.error?.code) {
            const { errorControlWithSqlCode } = require("../utils/functions");
            let formatError = errorControlWithSqlCode(create, table);
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
  async getMetaData(project,table){
    const create = await InfoDataBase.getMetaDataTable(project,table).catch((e) => {
        console.error("SERVICE Viewer service: can not get", e);
        return e;
      });
      if (create?.status && create.status == "ok") {
        return {
          status: "ok",
          msg: "Datos obtenidos",
          data: create.data,
        };
      } else {
        if (create?.error?.code) {
          const { errorControlWithSqlCode } = require("../utils/functions");
          let formatError = errorControlWithSqlCode(create, table);
          if (formatError.conditional) return formatError.payload;
        }
        return {
          status: "error",
          msg: "Error desconocido",
          code: 500,
          data: null,
        };
      }
  }

}

module.exports = viewerService;