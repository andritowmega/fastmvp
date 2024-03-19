module.exports = {
  sanitationStringSql(data) {
    const cleanData = data
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    const cleanDataWithoutSqlInjection = cleanData.replace(/(['";])/g, "");
    return cleanDataWithoutSqlInjection;
  },
};