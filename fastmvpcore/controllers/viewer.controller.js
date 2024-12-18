class ViewerController{
    static async Projects(req,res){
        let projects = require("../../config/configDb.json");
        const projectsNames = Object.keys(projects);
        return res.render('fmvp/index', { title: 'FastMVP View', projects:projectsNames });
    }
}
module.exports = ViewerController;