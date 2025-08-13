const functionsModule = {
  sanitationStringSql(data) {
    if (data && (typeof data === "string" || typeof data === "number")) {
      if (data && typeof data === "number") {
        data = data.toString();
      }
      const cleanData = data
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
      const cleanDataWithoutSqlInjection = cleanData.replace(/(['";])/g, "");
      return cleanDataWithoutSqlInjection;
    }
    return null;
  },
  errorControlWithSqlCode(errJson, table) {
    console.log("errorJson", errJson);
    if (errJson.error.code == "42P01") {
      return {
        conditional: true,
        payload: {
          status: "error",
          msg: "No existe la tabla " + table,
          code: errJson.error.code,
          detail: table,
          data: null,
        },
      };
    } else if (errJson.error.code == "22P02") {
      return {
        conditional: true,
        payload: {
          status: "error",
          msg: "valor invalido para un tipo de dato",
          code: errJson.error.code,
          detail: errJson.error.detail,
          data: null,
        },
      };
    }else if (errJson.error.code == "23505") {
      return {
        conditional: true,
        payload: {
          status: "error",
          msg: "Un dato está duplicado",
          code: errJson.error.code,
          detail: errJson.error.detail,
          data: null,
        },
      };
    } else if (errJson.error.code == "23502") {
      return {
        conditional: true,
        payload: {
          status: "error",
          msg: "Un campo es requerido y está sin datos",
          code: errJson.error.code,
          detail: errJson.error.detail,
          data: null,
        },
      };
    } else if (errJson.error.code == "42703") {
      return {
        conditional: true,
        payload: {
          status: "error",
          msg: "Un campo no existe en la tabla o puede que te refieras a otra tabla",
          code: errJson.error.code,
          detail: errJson.error.detail,
          data: errJson.error.hint,
        },
      };
    } else if (errJson.error.code == "outrange") {
      return {
        conditional: true,
        payload: {
          status: "error",
          msg: "No existe el valor para la condicional",
          code: errJson.error.code,
          detail: errJson.error.detail,
          data: null,
        },
      };
    } else if (errJson.error.code == "valuesJson") {
      return {
        conditional: true,
        payload: {
          status: "error",
          msg: "No se han enviado Valores",
          code: errJson.error.code,
          detail: errJson.error.detail,
          data: null,
        },
      };
    } else if (errJson.error.code == "tableundefined") {
      return {
        conditional: true,
        payload: {
          status: "error",
          msg: "No se ha recibido el nombre de la tabla",
          code: errJson.error.code,
          detail: null,
          data: null,
        },
      };
    } else if (errJson.error.code == "keysundefined") {
      return {
        conditional: true,
        payload: {
          status: "error",
          msg: "No se han recibido las keys para la búsqueda",
          code: errJson.error.code,
          detail: null,
          data: null,
        },
      };
    } else if (errJson.error.code == "valueundefined") {
      return {
        conditional: true,
        payload: {
          status: "error",
          msg: "No se ha enviado value para la consulta",
          code: errJson.error.code,
          detail: null,
          data: null,
        },
      };
    } else if (errJson.error.code == "wrongproject") {
      return {
        conditional: true,
        payload: {
          status: "error",
          msg: "El proyecto no existe",
          code: errJson.error.code,
          detail: null,
          data: null,
        },
      };
    }
    return {
      conditional: false,
      payload: errJson,
    };
  },
  /* Eliminar este código */
  useReplace(singleQuery, responseArray) {
    for (let fieldKey in singleQuery.body) {
      if (singleQuery.body.hasOwnProperty(fieldKey)) {
        let value = singleQuery.body[fieldKey];
        if (typeof value === "string" && value.includes("USE::")) {
          let valueToFind = singleQuery.body[fieldKey].substring(5);
          singleQuery.body[fieldKey] = functionsModule.findKeyFromArrayResponse(
            responseArray,
            valueToFind
          );
        }
      }
    }
    return singleQuery;
  },

  replaceUSE(obj, responseArray) {
    if (typeof obj === "string") {
      if (obj.includes("USE::")) {
        let valueToFind = obj.substring(5);
        obj = functionsModule.findKeyFromArrayResponse(responseArray,valueToFind);;
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(item => functionsModule.replaceUSE(item, responseArray));
    }
    if (typeof obj === "object" && obj !== null) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          obj[key] = functionsModule.replaceUSE(obj[key], responseArray);
        }
      }
    }
    return obj;
  },
  findKeyFromArrayResponse(responseArray, valueToFind) {
    let arrayToFind = new Array();
    if (!valueToFind.includes(".")) return null;
    arrayToFind = valueToFind.split(".");
    if (arrayToFind.length < 2) return null;
    for (let i = 0; i < responseArray.length; i++) {
      if (arrayToFind[0] in responseArray[i]) {
        if (responseArray[i][arrayToFind[0]].status == "error") return null;
        if (Array.isArray(responseArray[i][arrayToFind[0]].data) && responseArray[i][arrayToFind[0]].data.length>0) {
          if (arrayToFind[1] in responseArray[i][arrayToFind[0]].data[0]) {
            return responseArray[i][arrayToFind[0]].data[0][arrayToFind[1]];
          }
        }
        if (arrayToFind[1] in responseArray[i][arrayToFind[0]].data) {
          return responseArray[i][arrayToFind[0]].data[arrayToFind[1]];
        }
      }
    }
    return null;
  },
  isNoEmptyJSON(obj) {
    return (
      typeof obj === "object" && obj !== null && JSON.stringify(obj) !== "{}"
    );
  },
  generateResponse(response, req, res) {
    if (response?.status && response.status == "ok") {
      functionsModule.deleteKey(response.data, "password");
      response.authentication = req.datatoken;
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
  },
  deleteKey(object, keySearch) {
    for (let key in object) {
      if (key === keySearch) {
        delete object[key];
      }
      if (typeof object[key] === "object") {
        functionsModule.deleteKey(object[key], keySearch);
      }
    }
  },
  replaceKeyValue(jsonObj, searchValue, newJsonObj) {
    // Recorrer todas las claves del objeto JSON
    for (let key in jsonObj) {
      // Verificar si el valor de la clave comienza con "AUTH::id_profile"
      if (Array.isArray(jsonObj[key])) {
        functionsModule.replaceKeyValue(jsonObj[key], searchValue, newJsonObj);
      }
      if (
        typeof jsonObj[key] === "string" &&
        jsonObj[key].startsWith(searchValue)
      ) {
        // Reemplazar el valor con el nuevo valor
        const getKey = jsonObj[key].replace(/^AUTH::/, "");
        jsonObj[key] = newJsonObj[getKey];
      }
      // Si el valor es otro objeto JSON, llamar recursivamente a la función para reemplazar dentro de ese objeto
      if (typeof jsonObj[key] === "object") {
        functionsModule.replaceKeyValue(jsonObj[key], searchValue, newJsonObj);
      }
    }
  },
  generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const indexRandom = Math.floor(Math.random() * characters.length);
      result += characters.charAt(indexRandom);
    }
    return result;
  },
};
module.exports = functionsModule;
