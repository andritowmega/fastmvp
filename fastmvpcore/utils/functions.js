module.exports = {
  sanitationStringSql(data) {
    const cleanData = data
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    const cleanDataWithoutSqlInjection = cleanData.replace(/(['";])/g, "");
    return cleanDataWithoutSqlInjection;
  },
  errorControlWithSqlCode(errJson,table){
    console.log("errorJson",errJson);
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
    } else if (errJson.error.code == "23505") {
      return {
        conditional: true,
        payload: {
          status: "error",
          msg: "Un dato está duplicado",
          code: errJson.error.code,
          detail: errJson.error.detail,
          data: null,
        }
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
        }
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
    }
    return {
        conditional: false,
        payload: errJson
      };
  }
};