const FormData = require("form-data");
const fs = require("fs");
let configDev = require("../../config/configDb.json");

module.exports = {
  async upload({ file },project) {
    if(configDev.hasOwnProperty(project)){
      if(!configDev[project].hasOwnProperty("cloudflareimages")){
        console.error("Module: CloudFlareImages - no data for cloudflareimages");
        return {
          status:"error",
          data:null,
          msg:"No data for cloudflareimages"
        };
      }
    }else{
      console.error("Module: CloudFlareImages - This project does not exist");
      return {
        status:"error",
        data:null,
        msg:"This project does not exist"
      };
    }
    console.log("start",configDev[project].cloudflareimages)
    try{
      const fetch = require("node-fetch");
    }
    catch (e){
      console.error("catch",e);
    }
    console.log("start2")
    const CF = configDev[project].cloudflareimages;
    
    const domain = CF.domain;
    const body = new FormData();
    let result = null;

    let documentname = "variable";
    let filename = documentname + "." + file.mimetype.split("/")[1];
    let url = require("path").join(__dirname, "../../public/tmp/" + filename);
    console.log("url",url)
    
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
    console.log("poush",domain.URI + "/tmp/" + filename);

    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF.accountId}/images/v1`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${CF.apiKey}`
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
      fs.unlinkSync(__dirname + "../../public/tmp/" + filename);
      console.log("File removed");
    } catch (err) {
      console.error("Something wrong happened removing the file", err);
    }
    return result;
  },

  async delete(idimage,project) {
    const fetch = require("node-fetch");
    const CF = configDev[project].cloudflareimages;
    console.log(`Deleting Cloudflare Image: ${idimage}`);
    let result = null;
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF.accountId}/images/v1/${idimage}`,
        {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${CF.apiKey}` },
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