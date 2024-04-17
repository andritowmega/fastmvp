const jwt = require("jsonwebtoken");
const configtoken = require("../../config/token");
const moment = require("moment");
const keypass = 30; //cuantos digitos aumentar al token

module.exports = {
  newTokenUser: async function (data,expiration) {
    if('password' in data){
      delete data.password;
    }
    data.exp = moment().add(expiration, "days").unix();
    return jwt.sign(data, configtoken.TOKEN_SECRET_USER);
  },

  newTokenAdmin: async function (admin) {
    const payload = {
      idAdmin: admin.idloginadmin,
      emailprofile: admin.email,
      fullname: admin.names,
      exp: moment().add(180, "days").unix(),
    };
    return jwt.sign(payload, configtoken.TOKEN_SECRET_ADMIN);
  },

  newKeyUser: async function (user) {
    const payload = {
      idprofile: user.idprofile,
      email: user.email,
      fullname: user.names + " " + user.surnames
    };
    const tk = jwt.sign(payload, configtoken.VERIFYEMAIL_SECRET_USER);
    const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ$abcdefghijklmnopqrstu", keypass);
    return nanoid() + Buffer.from(tk).toString('base64');
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
    if(response?.code && response.code=="42P01"){
      if(req.body.dtfmvp) delete req.body.dtfmvp;
      return next();
    }
    if(response?.status && response.status=="ok" && response.data && Array.isArray(response.data)){
      for(let i=0;i<response.data.length;i++){
        if(response.data[i].tablename==req.params.table && response.data[i].access) {
          needCheck=true;
          break;
        }
      }
    }
    if(!needCheck) {
      if(req.body.dtfmvp) delete req.body.dtfmvp;
      return next();
    }
    let tokenBrowser =
      req.body.dtfmvp ||
      req.query.dtfmvp ||
      req.headers["authorization"] ||
      req.cookies.dtfmvp;

    if (!tokenBrowser) {
      req.datatoken = null;
      return res.status(403).json({
        status: "error",
        msg: "Do not provide your token",
        data: null,
      });
    }

    const configToken = require("../../config/token");
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined")
      tokenBrowser = bearerHeader.split(" ")[1];

    jwt.verify(
      tokenBrowser,
      configToken.TOKEN_SECRET_USER,
      async (err, decoded) => {
        if (err) {
          console.log("Error for validating user token", err.name);
          req.datatoken = null;
          return res.status(403).json({
            status: "error",
            msg: "Invlid token",
            data: null,
          });
        } else {
          req.datatoken = decoded;
          if(req.body.dtfmvp) delete req.body.dtfmvp;
          return next();
        }
      }
    );
  },
};