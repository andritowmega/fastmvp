exports.module = {
    async get(project,table,search){
        const toResponse = require("../../../utils/functions").generateResponse;
        const { get } = require("../../../services/allfunctions.service");
        const response = await get(project,table,search).catch(e=>{
            console.error("Error GetData Functions GPT: ",project,table);
            return e
        })
        return response
    },
    async getWeather(latitude, longitude) {
        try {
          const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`);
          const data = response.data;
          return data.current.temperature_2m;
        } catch (error) {
          throw new Error('No se pudo obtener el clima.');
        }
      }
}