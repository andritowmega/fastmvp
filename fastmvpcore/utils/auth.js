const jwt = require("jsonwebtoken");
const moment = require("moment");
const keypass = 30; //cuantos digitos aumentar al token

const authModule = {
  newTokenUser: async function (data,expiration,project) {
    const optionsConnetion = require("../../config/configDb.json");;
    if('password' in data){
      delete data.password;
    }
    return jwt.sign(data, optionsConnetion[project].token_secret,{ expiresIn: expiration+'d' });
  },
  keyDecoded: async function (key) {
    key = key.substring(keypass, key.lenght);
    const text = Buffer.from(key, 'base64').toString('ascii')
    return jwt.verify(
      text,
      configtoken.VERIFYEMAIL_SECRET_USER,
      async (err, decoded) => {
        if (err) {
          console.log("Error for validating user token", err.name);
          return null;
        } else {
          return decoded;
        }
      }
    );
  },
  comparePassword: async function (password, passwordhash) {
    const bcrypt = require("bcryptjs");
    return new Promise(async (resolve, reject) => {
      bcrypt.compare(password, passwordhash, (err, same) => {
        if (err) return reject(err);
        return resolve(same);
      });
    });
  },

  authenticateUser: async function (req, res, next) {
    let needCheck = false;
    const { get } = require("../services/allfunctions.service");
    const response = await get(req.params.project,"accesstoken",{"filters":["tablename","access"]});
    if(response?.status && response.status=="ok" && response.data && Array.isArray(response.data)){
      if(req.body.orderedList){
        if(Array.isArray(req.body.orderedList) && req.body.orderedList.length>0){
          for(let i=0;i<response.data.length;i++){
            for(let x=0;x<req.body.orderedList.length;x++){
              if(response.data[i].tablename==req.body.orderedList[x].in && response.data[i].access) {
                needCheck=true;
                break;
              }
            }
            if(needCheck) break;
          }
        }else{
          return res.status(400).json({
            status: "error",
            msg: "orderedList is not an array",
            data: null,
          });
        }
      }else if(req.params.table1 && req.params.table2){
        for(let i=0;i<response.data.length;i++){
          if(response.data[i].tablename==req.params.table1 && response.data[i].access) {
            needCheck=true;
            break;
          }
          if(response.data[i].tablename==req.params.table2 && response.data[i].access) {
            needCheck=true;
            break;
          }
        }
      }else{
        for(let i=0;i<response.data.length;i++){
          if(response.data[i].tablename==req.params.table && response.data[i].access) {
            needCheck=true;
            break;
          }
        }
      }
      if(!needCheck) {
        if(req.body.dtfmvp) delete req.body.dtfmvp;
        let tokenBrowser =
        req.body.dtfmvp ||
        req.query.dtfmvp ||
        req.headers["authorization"] ||
        req.cookies.dtfmvp;
        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== "undefined")
          tokenBrowser = bearerHeader.split(" ")[1];
        let responseToken = await authModule.checktoken(tokenBrowser,req.params.project).catch(e=>{
          return null;
        });
        req.datatoken = responseToken;
        //console.log("req.data",req.datatoken);
        return next();
      }
      let tokenBrowser =
        req.body.dtfmvp ||
        req.query.dtfmvp ||
        req.headers["authorization"] ||
        req.cookies.dtfmvp;
      const bearerHeader = req.headers["authorization"];
      if (typeof bearerHeader !== "undefined")
        tokenBrowser = bearerHeader.split(" ")[1];
      if(typeof tokenBrowser == "undefined" || tokenBrowser==""){
        return res.status(403).json({
          status: "error",
          msg: "Token not received",
          data: null,
        });
      }
      let responseToken = await authModule.checktoken(tokenBrowser,req.params.project).catch(e=>{
        return null;
      });
      if(typeof bearerHeader !== "undefined" || responseToken){
        req.datatoken = responseToken;
        if(req.body.dtfmvp) delete req.body.dtfmvp;
        return next();
      }
      req.datatoken = null;
      return res.status(403).json({
        status: "error",
        msg: "Invalid token",
        data: null,
      });
    }
    return res.status(500).json({
      status: "error",
      msg: "error accessing to accesstoken",
      data: null,
    });
    
  },
  replaceWithUserData:function (req,res,next){
    const {isNoEmptyJSON,replaceKeyValue} = require("../utils/functions");
    if(req.datatoken && isNoEmptyJSON(req.datatoken)){
      replaceKeyValue(req.body,"AUTH::",req.datatoken);
    }
    return next();
  },
  checktoken: async function (tokenBrowser,project) {
    return new Promise((resolve, reject) => {
      if (!tokenBrowser) {
        resolve(null);
      }
      const jwt = require("jsonwebtoken");
      const optionsConnetion = require("../../config/configDb.json");
      jwt.verify(tokenBrowser, optionsConnetion[project].token_secret, (err, decoded) => {
        if (err) {
          console.log("err",err)
          resolve(null);
        } else {
          resolve(decoded);
        }
      });
    });
  }
};
module.exports = authModule;