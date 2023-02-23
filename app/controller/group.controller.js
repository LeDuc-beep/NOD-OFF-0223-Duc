let groupService = require('../service/group.service');
class GroupController{
     async updateById(req,res,next) {
         await groupService.updateById(req,res,next);
    };

     async multipleAction(req,res,next) {
       await groupService.multipleAction(req,res,next);
     };

     async deleteSoft(req,res,next) {
         await groupService.deleteSoft(req,res,next);
     }

     async addNewItem(req,res,next) {
         await groupService.addNewItem(req,res,next);
     }

     async changeGroupAcp(req,res,next){
         await groupService.changeGroupAcp(req,res,next);
     }

     async sortGroup(req,res,next){
         await groupService.sortGroup(req,res,next);
     }

     async changeStatusItem(req,res,next){
         await groupService.changeStatusItem(req,res,next);
     }

     async getItemDependStatus(req,res,next){
         await groupService.getItemDependStatus(req,res,next);
     }

     async getFormItem(req,res,next){
         await groupService.getFormItem(req,res,next);
     }

     async getHomePage(req,res,next){
         await groupService.getHomePage(req,res,next);
     }
}

module.exports = new GroupController();

