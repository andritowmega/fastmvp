const AllTablesModel = require("../models/alltablescrud.model");
const JoinsModel = require("../models/joins.model");
const servicesModule = {
  async create(project, table, dataJson) {
    const create = await AllTablesModel.create(project, table, dataJson).catch(
      (e) => {
        console.error("SERVICE AllFunctions: can not create", e);
        return e;
      }
    );
    if (create?.status && create.status == "ok") {
      return {
        status: "ok",
        msg: "Se insertó correctamente",
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
  async get(project, table, data) {
    const create = await AllTablesModel.get(project, table, data).catch((e) => {
      console.error("SERVICE AllFunctions: can not get", e);
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
  async update(project, table, dataJson, condition) {
    const updateResponse = await AllTablesModel.update(
      project,
      table,
      dataJson,
      condition
    ).catch((e) => {
      console.error("SERVICE AllFunctions: can not update", e);
      return e;
    });
    if (updateResponse?.status && updateResponse.status == "ok") {
      return {
        status: "ok",
        msg: "Se actualizo correctamente",
        data: updateResponse.data,
      };
    } else {
      if (updateResponse?.error?.code) {
        const { errorControlWithSqlCode } = require("../utils/functions");
        let formatError = errorControlWithSqlCode(updateResponse, table);
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
  async deletePg(project, table, condition) {
    const deleteResponse = await AllTablesModel.delete(project,table,condition).catch((e) => {
      console.error("SERVICE AllFunctions: can not delete", e);
      return e;
    });
    if (deleteResponse?.status && deleteResponse.status == "ok") {
      return {
        status: "ok",
        msg: "Se elimino correctamente",
        data: deleteResponse.data,
      };
    }
    if (deleteResponse?.error?.code) {
      const { errorControlWithSqlCode } = require("../utils/functions");
      let formatError = errorControlWithSqlCode(deleteResponse, table);
      if (formatError.conditional) return formatError.payload;
    }
    return {
      status: "error",
      msg: "Error desconocido",
      code: 500,
      data: null,
    };
  },
  async innerJoin(project, tables, dataJson) {
    const create = await JoinsModel.innerJoin(project, tables, dataJson).catch(
      (e) => {
        console.error("SERVICE AllFunctions: can not execute innerJoin", e);
        return e;
      }
    );
    if (create?.status && create.status == "ok") {
      return {
        status: "ok",
        msg: "Datos obtenidos",
        data: create.data,
      };
    } else {
      if (create?.error?.code) {
        const { errorControlWithSqlCode } = require("../utils/functions");
        let formatError = errorControlWithSqlCode(create, tables.table1);
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
  async innerJoinLeft(project, tables, dataJson) {
    const create = await JoinsModel.innerJoinValueLeft(project, tables, dataJson).catch(
      (e) => {
        console.error("SERVICE AllFunctions: can not execute innerJoin", e);
        return e;
      }
    );
    if (create?.status && create.status == "ok") {
      return {
        status: "ok",
        msg: "Datos obtenidos",
        data: create.data,
      };
    } else {
      if (create?.error?.code) {
        const { errorControlWithSqlCode } = require("../utils/functions");
        let formatError = errorControlWithSqlCode(create, tables.table1);
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
  async innerJoinRight(project, tables, dataJson) {
    const create = await JoinsModel.innerJoinValueRight(project, tables, dataJson).catch(
      (e) => {
        console.error("SERVICE AllFunctions: can not execute innerJoin", e);
        return e;
      }
    );
    if (create?.status && create.status == "ok") {
      return {
        status: "ok",
        msg: "Datos obtenidos",
        data: create.data,
      };
    } else {
      if (create?.error?.code) {
        const { errorControlWithSqlCode } = require("../utils/functions");
        let formatError = errorControlWithSqlCode(create, tables.table1);
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
  async orderedList(project,data){
    if(data?.orderedList && Array.isArray(data.orderedList)){
      var response = new Array();
      for(let singleQuery of data.orderedList){
        if(!singleQuery?.type) {
          response.push({
            status: "error",
            msg: "El parametro Type no fue enviado",
            data: null,
          });
          continue;
        }
        if(!singleQuery?.body){
          response.push({
            status: "error",
            msg: "El parametro body no fue enviado",
            data: null,
          });
          continue;
        } 
        const { useReplace } = require('../utils/functions');
        data.orderedList = useReplace(singleQuery,response);
        if(singleQuery.type=="create"){
          let createResponse = await servicesModule.create(project,singleQuery.in,singleQuery.body).catch(
            (e) => {
              console.error("SERVICE AllFunctions: can not create on OrderedList", e);
              return e;
            }
          );
          let dataJson = {};
          dataJson[singleQuery.in]=createResponse
          response.push(dataJson);
          continue;
        }else if(singleQuery.type=="get"){
          let getResponse = await servicesModule.get(project,singleQuery.in,singleQuery.body).catch(
            (e) => {
              console.error("SERVICE AllFunctions: can not Get on OrderedList", e);
              return e;
            }
          )
          let dataJson = {};
          dataJson[singleQuery.in]=getResponse;
          response.push(dataJson);
          continue;
        }else if(singleQuery.type=="delete"){
          let deleteResponse = await servicesModule.deletePg(project,singleQuery.in,singleQuery.body).catch(
            (e) => {
              console.error("SERVICE AllFunctions: can not Delete on OrderedList", e);
              return e;
            }
          )
          let dataJson = {};
          dataJson[singleQuery.in]=deleteResponse
          response.push(dataJson);
          continue;
        }
        return response.push({
          status: "error",
          msg: "Error desconocido",
          code: 500,
          data: null,
        });
      };
      return {
        status: "ok",
        msg: "Consultas ordenadas",
        data: response,
      }
    }
    return {
      status: "error",
      msg: "Error desconocido",
      code: 500,
      data: null,
    };
  },
  async loginToken(project,table,body){
    const {isNoEmptyJSON} = require("../utils/functions");
    if(!body?.where && !isNoEmptyJSON(body.where)){
      return {
        status: "error",
        msg: "No se ha enviado los datos correcto en check.where",
        code: 500,
        data: null,
      };
    }
    body.where.type="iqual";
    const get = await AllTablesModel.get(project, table, body).catch((e) => {
      console.error("SERVICE AllFunctions: can not get", e);
      return e;
    });
    if (get?.status && get.status == "ok") {
      if(get.data.length==0) return {
        status:"error",
        msg:"Credenciales incorrectas",
        data: null
      }
      const {newTokenUser,comparePassword} = require("../utils/auth");
      const checkPassword = await comparePassword(body.password,get.data[0].password).catch(e=>{
        console.error("ALLFUNCTIONS Login Module: i can't compare password",e);
        return null;
      })
      if(checkPassword){
        const dataToken = await newTokenUser(get.data[0],body.lifetimedays,project);
        return {
          status: "ok",
          msg: "Bienvenido de nuevo",
          data: {
            token: dataToken
          }
        };
      }
      return {
        status: "error",
        msg: "Contraseña Incorrecta",
        data: null,
      };
    } else {
      if (get?.error?.code) {
        const { errorControlWithSqlCode } = require("../utils/functions");
        let formatError = errorControlWithSqlCode(get, table);
        if (formatError.conditional) return formatError.payload;
      }
      return {
        status: "error",
        msg: "Credenciales incorrectas",
        data: null,
      };
    }
  },
  async uploadImageCF(project,files){
    const imageUtils = require("../utils/cloudflareimages");
    if(files && files.file){
      const image = await imageUtils.upload(files,project).catch(e=>{
        console.error("UPLOAD SERVICE - can not upload image to cloudflare", err);
        return e;
      })
      if (image && image.id) {
        return {
          status: "ok",
          msg: "Imagen subida correctamente",
          data: image
        };
      }
      else {
        console.error("No se subió la imágen");
        return {
          status: "ok",
          msg: "No se subio la imagen a CF, error en la api o formato incorrecto",
          data: null
        };
      }
    }
    return {
      status: "ok",
      msg: "No se recibió la imagen",
      data: null
    };
  },
  async deleteImageCF(project,data){
    const imageUtils = require("../utils/cloudflareimages");
    if(data && data.id){
      const image = await imageUtils.delete(data.id,project).catch(e=>{
        console.error("DELETE SERVICE - can not delete image to cloudflare", e);
        return e;
      })
      if (image && image==true) {
        return {
          status: "ok",
          msg: "Imagen subida correctamente",
          data: null
        };
      }
      else {
        return image
      }
    }
  }
};

module.exports = servicesModule;