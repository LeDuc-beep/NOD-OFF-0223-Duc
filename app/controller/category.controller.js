let categoryService = require("../service/category.service");
class categoryController {
  async updateById(req, res, next) {
    await categoryService.updateById(req, res, next);
  }

  async multipleAction(req, res, next) {
    await categoryService.multipleAction(req, res, next);
  }

  async deleteSoft(req, res, next) {
    await categoryService.deleteSoft(req, res, next);
  }

  async addNewItem(req, res, next) {
    await categoryService.addNewItem(req, res, next);
  }

  async sortGroup(req, res, next) {
    await categoryService.sortGroup(req, res, next);
  }

  async changeOrderingItem(req, res, next) {
    await categoryService.changeOrderingItem(req, res, next);
  }

  async changeStatusItem(req, res, next) {
    await categoryService.changeStatusItem(req, res, next);
  }

  async getItemDependStatus(req, res, next) {
    await categoryService.getItemDependStatus(req, res, next);
  }

  async getFormItem(req, res, next) {
    await categoryService.getFormItem(req, res, next);
  }

  async getHomePage(req, res, next) {
    await categoryService.getHomePage(req, res, next);
  }
}

module.exports = new categoryController();
