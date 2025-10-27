const path = require("path");
const fs = require("fs").promises;

class MediaServerController {
  static async Mp3Files(req, res) {
    try {
      const { project, level1, level2, name } = req.params;

      const urlConfig = path.join(__dirname, "../../config/configDb.json");
      const config = require(urlConfig);

      if (!config[project]?.files?.mp3?.free) {
        return res.status(404).send("No hay rutas configuradas");
      }

      const basePath = config[project].files.mp3.free;
      let filePath;

      // Detectar qué parámetros existen
      if (level1 && level2) {
        filePath = path.join(basePath, level1, level2, name);
      } else {
        filePath = path.join(basePath, name);
      }

      await fs.access(filePath, fs.constants.F_OK);
      res.setHeader("Content-Type", "audio/mpeg");
      return res.sendFile(filePath);
    } catch (err) {
      console.error("Error accediendo al archivo:", err.message);
      return res.status(404).send("Archivo no encontrado.");
    }
  }
}

module.exports = MediaServerController;
