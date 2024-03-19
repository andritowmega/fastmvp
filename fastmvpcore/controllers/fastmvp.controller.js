class FastMvpController {
  static async Create(req, res) {
    const { create } = require("../services/allfunctions.service");
    const response = await create(req.params.table, req.body).catch((e) => {
      console.error("FastMvp Controller: can't create", e);
      return e;
    });
    if (response?.status && response.status == "ok") {
      return res.json(response).status(200);
    } else if (
      response?.status &&
      response.code &&
      response.status == "error"
    ) {
      if (response.code == "42P01") {
        return res.json(response).status(404);
      } else if (response.code == "23505") {
        return res.json(response).status(400);
      }
    }
    return res.json(response).status(500);
  }
  static async Update(req, res) {
    const { update } = require("../services/allfunctions.service");
    let condition = req.params.key
      ? {
          key: req.params.key,
          value: req.params.value,
        }
      : null;
    const response = await update(req.params.table, req.body, condition).catch(
      (e) => {
        console.error("FastMvp Controller: can't update", e);
        return e;
      }
    );
    if (response?.status && response.status == "ok") {
      return res.json(response).status(200);
    }
    return res.json(response).status(500);
  }
  static async Delete(req, res) {
    const { deletePg } = require("../services/allfunctions.service");
    let condition = req.params.key
      ? {
          key: req.params.key,
          value: req.params.value,
        }
      : null;
    console.log("condition",condition);
    const response = await deletePg(req.params.table, condition).catch(
      (e) => {
        console.error("FastMvp Controller: can't delete", e);
        return e;
      }
    );
    if (response?.status && response.status == "ok") {
      return res.json(response).status(200);
    }
    return res.json(response).status(500);
  }
}
module.exports = FastMvpController;
