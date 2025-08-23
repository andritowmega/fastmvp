class GptController {
    static async SingleChat(req,res){
        const {chat} = require("../functions/chat.function");
        console.log("req.body",req.body);
        const response = await chat(req.params.project,req.body)
        if(response?.error){
            return res.json(response).status(500);
        }
        return res.json(response).status(200)
    }
    static async SellerChat(req,res){
        const {chat} = require("../functions/chat.function");
        console.log("req.body",req.body);
        const response = await chat(req.params.project,req.body)
        if(response?.error){
            return res.json(response).status(500);
        }
        return res.json(response).status(200)
    }
}
module.exports = GptController;