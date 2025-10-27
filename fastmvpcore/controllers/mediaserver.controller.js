const path = require("path");
const fs = require("fs").promises;

class MediaServerController {
  static async Mp3Files(req, res) {
    try {
      const { project } = req.params;
      const relativePath = req.params[0]; // <- Express guarda el comodín aquí

      const urlConfig = path.join(__dirname, "../../config/configDb.json");
      const config = require(urlConfig);

      if (!config[project]?.files?.mp3?.free) {
        return res.status(404).send("No hay rutas configuradas");
      }

      const basePath = config[project].files.mp3.free;
      const filePath = path.join(basePath, relativePath);

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
