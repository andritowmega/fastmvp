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
      if (response?.status && response.status == "ok") {
        return res.json(response).status(200);
      }
      return res.json(response).status(500);
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
    const { loginToken } = require("../services/allfunctions.service");
    const response = await loginToken(req.params.project,req.params.table,req.body).catch((e) => {
      console.error("FastMvp Controller: can't execute LoginToken", e);
      return e;
    });
    return FastMvpController.toResponse(response,req,res);
  }
}
module.exports = FastMvpController;