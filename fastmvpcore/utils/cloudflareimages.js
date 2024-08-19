const FormData = require("form-data");
const CF = require("../config/cloudflareImg");
const { customAlphabet } = require('nanoid');
const fs = require("fs");

module.exports = {
  async upload({ file },project) {
    let configDev = require("../../config/configDb.json");
    if(configDev.hasOwnProperty(project)){
      if(configDev[project].hasOwnProperty("cloudflareimages")){

      }else{
        console.error("Module: CloudFlareImages - No hay credenciales en json");
      }
    }else{
      console.error("Module: CloudFlareImages - No hay proyecto con ese nombre");
    }
    const fetch = require("node-fetch");
    const domain = require("../config/config.js")
    const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);
    const body = new FormData();
    let result = null;

    let documentname = nanoid();
    let filename = documentname + "." + file.mimetype.split("/")[1];
    let url = require("path").join(__dirname, "../public/tmp/" + filename);

    try {
      file.mv(url, (err) => {
        if (err) {
          console.error("==> ERROR al subir imagen al servidor", err);
          return null;
        } else {
          console.log("OK se subió con éxito");
        }
      });
    } catch (err) {
      console.error("Something wrong happened removing the file", err);
    }

    body.append("url", domain.URI + "/tmp/" + filename);

    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF.CF_IMAGES_ACCOUNT_ID}/images/v1`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${CF.CF_IMAGES_API_KEY}`
          },
          body,
        }
      );


      if (res && res.status) {
        if (res.status === 200) {
          const response = await res.json();
          if (response && response.result) {
            result = response.result;
            console.log("CF image say: Upload with success");
          }
        } else if (res.status === 409) {
          console.log("Already exist: " + imagename);
        } else {
          throw new Error("HTTP " + res.status + " : " + await res.text());
        }
      }
    } catch (e) {
      console.error("ERROR:" + e);
    }

    try {
      fs.unlinkSync(__dirname + "/../public/tmp/" + filename);
      console.log("File removed");
    } catch (err) {
      console.error("Something wrong happened removing the file", err);
    }
    return result;
  },

  async delete(idimage) {
    const fetch = require("node-fetch");
    console.log(`Deleting Cloudflare Image: ${idimage}`);
    let result = null;
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF.CF_IMAGES_ACCOUNT_ID}/images/v1/${idimage}`,
        {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${CF.CF_IMAGES_API_KEY}` },
        }
      ).catch((err) => {
        console.error("Error en delete image", err);
      });
      if (res.status === 200) {
        const response = await res.json();
        console.log("The image was successfully removed")
        result = response.result;
      }
      throw new Error(`${idimage}: HTTP ` + res.status + " : " + await res.text());
    } catch (e) {
      console.log(e.toString());
    }
    return result;
  }
}