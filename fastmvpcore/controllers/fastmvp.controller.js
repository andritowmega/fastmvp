class FastMvpController {
  static toResponse = require("../utils/functions").generateResponse;
  static async Create(req, res) {
    const {create} = require("../services/allfunctions.service");
    const response = await create(req.params.project, req.params.table, req.body).catch((e) => {
      console.error("FastMvp Controller: can't create", e);
      return e;
    });
    return FastMvpController.toResponse(response,req,res);
  }
  static async Get(req, res) {
    const { get } = require("../services/allfunctions.service");
    const response = await get(req.params.project, req.params.table, req.body).catch((e) => {
      console.error("FastMvp Controller: can't get", e);
      return e;
    });
    return FastMvpController.toResponse(response,req,res);
  }
  static async Update(req, res) {
    const { update } = require("../services/allfunctions.service");
    let condition = req.params.key
      ? {
          key: req.params.key,
          value: req.params.value,
        }
      : null;
    const response = await update(req.params.project, req.params.table, req.body, condition).catch(
      (e) => {
        console.error("FastMvp Controller: can't update", e);
        return e;
      }
    );
    return FastMvpController.toResponse(response,req,res);
  }
  static async RepetitiveTaskUpdate(req, res) {
    const { update } = require("../services/allfunctions.service");
    let fullResponse = null;
    if(req.body && req.body.tasks){
      const tasks = req.body.tasks;
      let responses = new Array();
      for(let i = 0;i<tasks.length;i++){
        const singleTask = tasks[i];
        const condition = {
          key: singleTask.key,
          value: singleTask.value
        }
        const response = await update(req.params.project, req.params.table, singleTask.body, condition).catch(
          (e) => {
            console.error("FastMvp Controller: can't update", e);
            return e;
          }
        );
        responses.push(response);
      }
      if(responses.length>0){
        fullResponse = {
          status:"ok",
          msg:"Tareas Repetitivas",
          data:responses
        }
      }else{
        fullResponse = {
          status:"ok",
          msg:"No se obtuvo resultados",
          data:responses
        }
      }
      return FastMvpController.toResponse(fullResponse,req,res);
    }
    fullResponse = {
      status:"error",
      msg:"Estructura Json errónea para esta solicitud",
      data:null
    }
    return FastMvpController.toResponse(fullResponse,req,res);
  }
  static async Delete(req, res) {
    const { deletePg } = require("../services/allfunctions.service");
    let condition = req.params.key
      ? {
          key: req.params.key,
          value: req.params.value,
        }
      : null;
    const response = await deletePg(req.params.project, req.params.table, condition).catch((e) => {
      console.error("FastMvp Controller: can't delete", e);
      return e;
    });
    return FastMvpController.toResponse(response,req,res);
  }
  static async InnerJoin(req, res) {
    const { innerJoin } = require("../services/allfunctions.service");
    if (req.params.table1 && req.params.table2) {
      const tables = {
        table1: req.params.table1,
        table2: req.params.table2,
      };
      const response = await innerJoin(req.params.project, tables, req.body).catch((e) => {
        console.error("FastMvp Controller: can't execute InnerJoin", e);
        return e;
      });
      return FastMvpController.toResponse(response,req,res);
    }
    return res
      .json({
        status: "error",
        msg: "Wrong Url",
        data: null,
      })
      .status(404);
  }
  static async InnerJoinLeft(req, res) {
    const { innerJoinLeft } = require("../services/allfunctions.service");
    if (req.params.table1 && req.params.table2) {
      const tables = {
        table1: req.params.table1,
        table2: req.params.table2,
      };
      const response = await innerJoinLeft(req.params.project, tables, req.body).catch((e) => {
        console.error("FastMvp Controller: can't execute InnerJoin", e);
        return e;
      });
      return FastMvpController.toResponse(response,req,res);
    }
    return res
      .json({
        status: "error",
        msg: "Wrong Url",
        data: null,
      })
      .status(404);
  }
  static async InnerJoinRight(req, res) {
    const { innerJoinRight } = require("../services/allfunctions.service");
    if (req.params.table1 && req.params.table2) {
      const tables = {
        table1: req.params.table1,
        table2: req.params.table2,
      };
      const response = await innerJoinRight(req.params.project, tables, req.body).catch((e) => {
        console.error("FastMvp Controller: can't execute InnerJoin", e);
        return e;
      });
      return FastMvpController.toResponse(response,req,res);
    }
    return res
      .json({
        status: "error",
        msg: "Wrong Url",
        data: null,
      })
      .status(404);
  }
  static async OrderedList(req, res) {
    const { orderedList } = require("../services/allfunctions.service");
      const response = await orderedList(req.params.project, req.body).catch((e) => {
        console.error("FastMvp Controller: can't execute OrderedList", e);
        return e;
      });
      return FastMvpController.toResponse(response,req,res);
  }
  static async CheckToken(req,res){
    console.log("check");
    const { loginToken } = require("../services/allfunctions.service");
    const response = await loginToken(req.params.project,req.params.table,req.body).catch((e) => {
      console.error("FastMvp Controller: can't execute LoginToken", e);
      return e;
    });
    return FastMvpController.toResponse(response,req,res);
  }
  static async InfoToken(req,res){
    let response = {};
    if(req.datatoken){
      response = {
        status: "ok",
        msg: "Sesión correcta",
        data: null,
      };
    }else{
      response = {
        status: "error",
        msg: "Error token",
        data: null,
      };
    }

    return FastMvpController.toResponse(response,req,res);
  }
  static async GetInfo(req,res){
    const { innerJoin } = require("../services/allfunctions.service");
    const tables = {
      table1: req.params.table1,
      table2: req.params.table2,
    };
    if(req.body.where?.conditional?.key){
      let tempWhere = JSON.parse(JSON.stringify(req.body.where));
      delete req.body.where
      req.body.where = {};
      req.body.where.type="iqual";
      req.body.where.conditional = {};
      req.body.where.conditional[tempWhere.conditional.key] = req.datatoken[tempWhere.conditional.key];
    }
    const response = await innerJoin(req.params.project,tables,req.body).catch((e) => {
      console.error("FastMvp Controller: can't execute InnerJoin", e);
      return e;
    });
    return FastMvpController.toResponse(response,req,res);
  }
  static async UpdatePassword(req,res){
    const {update,loginToken} = require("../services/allfunctions.service");
    
    let content = {}
    content.where = {}
    content.where.conditional = {}
    if(req.body.where)
    if(req.body.where?.conditional?.key){
      content.where.conditional[req.body.where.conditional.key] = req.datatoken[req.body.where.conditional.key] 
    }
    console.log("password", req.body.password)
    content.password = req.body.password;
    content.lifetimedays="1";

    const response = await loginToken(req.params.project,req.params.table,content).catch((e) => {
      console.error("FastMvp Controller: can't execute LoginToken", e);
      return e;
    });
    if(response?.status && response.status=="ok"){
      let condition = req.body.where.conditional.key
      ? {
          key: req.body.where.conditional.key,
          value: req.datatoken[req.body.where.conditional.key] ,
        }
      : null;
      let nbody = {};
      nbody.password = req.body.newpassword;
      const responseUpdate = await update(req.params.project, req.params.table, nbody , condition).catch(
        (e) => {
          console.error("FastMvp Controller: can't update", e);
          return e;
        }
      );
      return FastMvpController.toResponse(responseUpdate,req,res);
    }
    return FastMvpController.toResponse(response,req,res);
    
  }
  static async UploadImageCF(req,res){
    const {uploadImageCF} = require("../services/allfunctions.service");
    const response = await uploadImageCF(req.params.project,req.files).catch(e=>{
      console.error("FastMvp Controller: can't upload image to cloudflareimages");
      return e;
    });
    console.log("response image",response);
    return FastMvpController.toResponse(response,req,res);
  }
  static async DeleteImageCF(req,res){
    const {deleteImageCF} = require("../services/allfunctions.service");
    const response = await deleteImageCF(req.params.project,req.body).catch(e=>{
      console.error("FastMvp Controller: can't delete image to cloudflareimages",e);
      return e;
    });
    return FastMvpController.toResponse(response,req,res);
  }
}
module.exports = FastMvpController;