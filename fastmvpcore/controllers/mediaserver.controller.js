const path = require("path");
const fs = require("fs").promises;

class MediaServerController {
  static async Mp3Files(req, res) {
    try {
      const { project, level1, level2, name } = req.params;

      const urlConfig = path.join(__dirname, "../../config/configDb.json");
      const optionsConnetion = require(urlConfig);

      // Verificar configuración
      if (!optionsConnetion[project]?.files?.mp3?.free || optionsConnetion[project].files.mp3.free === "") {
        return res.status(404).send("No hay rutas configuradas");
      }

      // Construir ruta absoluta al archivo
      const basePath = optionsConnetion[project].files.mp3.free;
      const filePath = path.join(basePath, level1, level2, name);

      // Verificar existencia
      await fs.access(filePath, fs.constants.F_OK);

      // Enviar el archivo
      res.setHeader("Content-Type", "audio/mpeg");
      return res.sendFile(filePath);
    } catch (err) {
      console.error("Error accediendo al archivo:", err.message);
      return res.status(404).send("Archivo no encontrado.");
    }
  }
}

module.exports = MediaServerController;
