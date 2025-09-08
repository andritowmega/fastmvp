const ExcelJS = require("exceljs");

class Excel {
  constructor() {
    this.workbook = new ExcelJS.Workbook();
  }

  async create(data) {
    if (!data.data || data.data.length === 0) {
      return null;
    }

    const sheet = this.workbook.addWorksheet(
      data.excel.sheet.name,
      data.excel.sheet.properties
    );

    // obtener headers dinámicos
    const headers = Object.keys(data.data[0]);
    sheet.addRow(headers);

    // recorrer cada fila y mantener el orden de headers
    data.data.forEach(row => {
      const values = headers.map(h => row[h] ?? "");
      sheet.addRow(values);
    });

    // 👇 Ajustar ancho de columnas
    sheet.columns.forEach((column, i) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength + 2;
    });

    // exportar como buffer
    const buffer = await this.workbook.xlsx.writeBuffer();
    return buffer;
  }
}

module.exports = Excel;
