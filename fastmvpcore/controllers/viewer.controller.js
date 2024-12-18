class ViewerController{
    static async Projects(req,res){
        let projects = require("../../config/configDb.json");
        const projectsNames = Object.keys(projects);
        return res.render('fmvp/index', { title: 'FastMVP View', projects:projectsNames });
    }
    static async SingleProject(req,res){
        const {getTables} = require("../services/viewer.service");
        const response = await getTables(req.params.project).catch((e) => {
            console.error("FastMvp Controller: can't create", e);
            return e;
          });
        console.log("getTables",response);
        return res.render('fmvp/project/index', { title: req.params.project, tables:response.data });
    }
    static async GetTableInfo(req,res){
        const {getMetaData} = require("../services/viewer.service");
        const response = await getMetaData(req.params.project,req.params.table).catch((e) => {
            console.error("FastMvp Controller: can't create", e);
            return e;
          });
        console.log("getTable nfo",response.data);
        return res.render('fmvp/project/table', { project: req.params.project,table:req.params.table , metadata:response.data });
    }
}
module.exports = ViewerController;