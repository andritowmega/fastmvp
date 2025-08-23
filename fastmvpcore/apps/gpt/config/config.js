const { OpenAI } = require('openai');
let configDev = require("../../../../config/configDb.json");
const configGPT = {
    getOpenAi(project, model = null) {
        //nombre del projecto y modelo puede ser opcional si esque necesita reemplazar el de configDb.json
        try {
            const dataOpenAi = configDev[project].openAi
            let modelGpt = "";
            const openai = new OpenAI({
                apiKey: dataOpenAi.apiKey,
            });
            if (model) {
                modelGpt = model;
            }
            modelGpt = dataOpenAi.model;
            return {
                openAi: openai,
                model: modelGpt
            }
        }catch(e){
            console.error("ERROR: cant create openAi",e);
            return null;
        }
    },
}
module.exports = configGPT;