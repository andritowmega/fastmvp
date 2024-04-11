module.exports = {
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
        .map((name, index) => `${name}=$${index + 1}`)
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
    if (datayJson?.filters?.length && datayJson.filters.length > 0) {
      let namesString = datayJson.filters.join(", ");
      let response = `${namesString}`;
      return response;
    }
    return ` * `;
  },
};
