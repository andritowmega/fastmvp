class MediaServerController {
  static async Mp3Files(req, res) {

    //Experimento por Mejorar

    const path = require("path");
    const fs = require("fs").promises; // Usamos la versión Promesa de fs
    const fileName = req.params.name;
    const project = req.params.project;
    const urlConfig = path.join(__dirname,'../../config/configDb.json')
    const optionsConnetion = require(urlConfig);
    if(!optionsConnetion[project]?.files?.mp3?.free || optionsConnetion[project].files.mp3.free==""){
        return res.status(404).send("No hay rutas configuradas");
    }
    // Construir la ruta completa al archivo
    const filePath = path.join(
        optionsConnetion[project].files.mp3.free,
      fileName
    );

    try {
      // Usamos fs.promises.access con await para verificar la existencia del archivo
      await fs.access(filePath, fs.constants.F_OK);

      // Si el archivo existe, lo enviamos
      res.setHeader("Content-Type", "audio/mpeg");
      return res.sendFile(filePath);
    } catch (err) {
      // Si ocurre un error (archivo no encontrado), respondemos con 404
      return res.status(404).send("Archivo no encontrado.");
    }
  }
}
module.exports = MediaServerController;
