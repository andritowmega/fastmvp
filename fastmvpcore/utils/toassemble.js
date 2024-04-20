const toAssenbleModule = {
  makeSqlStringInsert(dataJson) {
    if (Object.keys(dataJson)?.length && Object.keys(dataJson)?.length > 0) {
      if('password' in dataJson){
        const bcrypt = require("bcryptjs");
        dataJson.password = bcrypt.hashSync(dataJson.password,8);
      }
      let namesString = Object.keys(dataJson).join(", ");
      let valuesArray = Object.values(dataJson);
      let response = "(" + namesString + ")";
      response += " VALUES (";
      response += valuesArray
        .map((value, index) =>
          index === valuesArray.length - 1 ? `$${index + 1}` : `$${index + 1}, `
        )
        .join("");
      response += ") RETURNING *";
      return response;
    }
    return null;
  },
  makeSqlStringUpdate(dataJson, condition) {
    if (Object.keys(dataJson)?.length && Object.keys(dataJson)?.length > 0) {
      let namesString = Object.keys(dataJson);
      let response = namesString
        .map((name, index) => {
            if(typeof dataJson[name] === 'string'){
                if(dataJson[name].includes("PLUS::")){
                    dataJson[name] = dataJson[name].replace("PLUS::","");
                    return `${name}=${name} + $${index + 1}`
                }else if(dataJson[name].includes("MINUS::")){
                    dataJson[name] = dataJson[name].replace("MINUS::","");
                    return `${name}=${name} - $${index + 1}`
                }
            }
            return `${name}=$${index + 1}`
        })
        .join(", ");
      response += condition
        ? ` WHERE ${condition.key} = ${condition.value}`
        : ``;
      response += " RETURNING *";
      return response;
    }
    return null;
 },
  makeSqlStringDelete(condition) {
    let response = ` WHERE ${condition.key} = ${condition.value}`;
    response += " RETURNING *";
    return response;
  },
  makeSqlStringSelect(datayJson) {
    if(datayJson?.functions?.length && datayJson.functions.length > 0){
      for(let i=0; i<datayJson.functions.length;i++){
        if(datayJson.functions[i].includes("SUM::")){
          datayJson.functions[i] = datayJson.functions[i].replace("SUM::","");
          datayJson.functions[i] = `SUM(${datayJson.functions[i]})`;
        }else if(datayJson.functions[i].includes("COUNT::")){
          datayJson.functions[i] = datayJson.functions[i].replace("COUNT::","");
          datayJson.functions[i] = `COUNT(${datayJson.functions[i]})`;
        }else if(datayJson.functions[i].includes("AVG::")){
          datayJson.functions[i] = datayJson.functions[i].replace("AVG::","");
          datayJson.functions[i] = `AVG(${datayJson.functions[i]})`;
        }
      }
      return datayJson.functions.join(", ");
    }
    if (datayJson?.filters?.length && datayJson.filters.length > 0) {
      let namesString = datayJson.filters.join(", ");
      let response = `${namesString}`;
      return response;
    }
    return ` * `;
  },
  makeSqlStringSelectWhere(dataJson) {
    const { isNoEmptyJSON,sanitationStringSql } = require("../utils/functions");
    if (dataJson?.where && isNoEmptyJSON(dataJson.where)) {
      if(Array.isArray(dataJson.where.conditionals)){
        let response = "";
        for(let i=0;i<dataJson.where.conditionals.length;i++){
          if(i%2==0){
            response += ` ${toAssenbleModule.makeWhereConditional(dataJson.where.conditionals[i])} `;
          }else{
            response += ` ${sanitationStringSql(dataJson.where.conditionals[i])} `;
          }
        }
        return " WHERE "+response;
      }
      if(dataJson.where.conditional && isNoEmptyJSON(dataJson.where.conditional)){
        return " WHERE " + toAssenbleModule.makeWhereConditional(dataJson.where);
      }
    }
    return ``;
  },
  makeWhereConditional(conditional){
    const { sanitationStringSql } = require("../utils/functions");
    if(conditional.type){
      if(conditional.type=="iqual"){
        if(conditional.conditional[Object.keys(conditional.conditional)[0]] == "CURRENT_DATE"){
          return `${sanitationStringSql(Object.keys(conditional.conditional)[0])}=CURRENT_DATE`;
        }
        return `${Object.keys(conditional.conditional)[0]}='${sanitationStringSql(conditional.conditional[Object.keys(conditional.conditional)[0]])}'`;
      }else if(conditional.type=="like"){
        return `${Object.keys(conditional.conditional)[0]} LIKE '%${sanitationStringSql(conditional.conditional[Object.keys(conditional.conditional)[0]])}%'`;
      }else if(conditional.type=="ilike"){
        return `${Object.keys(conditional.conditional)[0]} ILIKE '%${sanitationStringSql(conditional.conditional[Object.keys(conditional.conditional)[0]])}%'`;
      }else if("smallerthan"){
        return `${Object.keys(conditional.conditional)[0]} < '${sanitationStringSql(conditional.conditional[Object.keys(conditional.conditional)[0]])}'`;
      }else if("greater than"){
        return `${Object.keys(conditional.conditional)[0]} > '${sanitationStringSql(conditional.conditional[Object.keys(conditional.conditional)[0]])}'`;
      }
    }
  }
};
module.exports = toAssenbleModule;