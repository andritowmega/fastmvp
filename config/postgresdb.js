const { Pool } = require("pg");

let optionsConnetion = {};

if (process.env.STR_DB) {
  // CANDENA DE CONEXIÓN SI HAY UNA VARIABLE DE ENTORNO
  optionsConnetion = { connectionString: process.env.STR_DB };
} else {
  // SI ESTA FUNCIONANDO DE MANERA LOCAL
  /* ESTRUCTURA DEL ARCHIVO configDev.json PARA LA CONEXIÓN DE MANERA DE DESARROLLO
  { 
        user: "postgres",
        host: "localhost",
        database: "yourdb",
        password: "yourpassword",
        port: 5432
    }
    */
  optionsConnetion = require("./configDb.json");
}

module.exports = (dbFind) => {
  var dbSelected = optionsConnetion[dbFind];
  if(dbSelected?.connection){
    return new Pool(dbSelected.connection);
  }else{
    return null;
  }
};