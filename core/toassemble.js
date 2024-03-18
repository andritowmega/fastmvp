module.exports = {
  makeSqlString(dataJson) {
    if (Object.keys(dataJson)?.length && Object.keys(dataJson)?.length > 0) {
      let namesString = Object.keys(dataJson).join(", ");
      let valuesArray = Object.values(dataJson);
      let response = "(" + namesString + ")";
      response += " VALUES (";
      response += valuesArray.map((value, index) => index === valuesArray.length - 1 ? `$${index + 1}` : `$${index + 1}, `).join("");
      response += ") RETURNING *"
      return response;
    }
    return null;
  },
};
