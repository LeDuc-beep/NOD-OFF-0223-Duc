let itemsService = require("../service/items.service");
class ItemsController {
  async updateById(req, res, next) {
    await itemsService.updateById(req, res, next);
  }

  async multipleAction(req, res, next) {
    await itemsService.multipleAction(req, res, next);
  }

  async deleteSoft(req, res, next) {
    await itemsService.deleteSoft(req, res, next);
  }

  async addNewItem(req, res, next) {
    await itemsService.addNewItem(req, res, next);
  }

  async sortGroup(req, res, next) {
    await itemsService.sortGroup(req, res, next);
  }

  async changeStatusItem(req, res, next) {
    await itemsService.changeStatusItem(req, res, next);
  }

  async getItemDependStatus(req, res, next) {
    await itemsService.getItemDependStatus(req, res, next);
  }

  async getFormItem(req, res, next) {
    await itemsService.getFormItem(req, res, next);
  }

  async getHomePage(req, res, next) {
    await itemsService.getHomePage(req, res, next);
  }
}

module.exports = new ItemsController();
