exports.module = {
    async get(project,table,search){
        const toResponse = require("../../../utils/functions").generateResponse;
        const { get } = require("../../../services/allfunctions.service");
        const response = await get(project,table,search).catch(e=>{
            console.error("Error GetData Functions GPT: ",project,table);
            return e
        })
        return response
    }
}