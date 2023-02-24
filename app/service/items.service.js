const { body, validationResult } = require("express-validator");
const itemsModel = require("../models/items");
const helpers = require("../helpers/utils");
const { messageItemHelper } = require("../helpers/message");
// total item per page
const totalItem = 4;
// number pages display
const pageRange = 3;
// Path view
const pathView = "pages/items";
// Redirect view
const pathRedirectView = "/admin/items";
// Form Single Item
let formSingleItem = {
  name: "",
  status: "",
  ordering: "",
};
class ItemsService {
  async updateById(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errorArr = {};
      errors["errors"].forEach((error) => {
        errorArr[`${error.param}`] = error.msg;
      });
      res.render(`pages/items/form`, {
        item: req.body,
        errorArr,
        message: "",
        title: "Edit",
        link: `/admin/items/update/${req.params.id}?_method=PUT`,
      });
    } else {
      let dataUpdated = req.body;
      dataUpdated.modifiedBy = {
        idUser: "asd1w1213",
        userName: "sdada",
      };
      await itemsModel
        .findByIdAndUpdate(req.params.id, dataUpdated)
        .then(() => {
          req.flash("info", messageItemHelper.flashUpdate);
          res.redirect("/admin/items");
        })
        .catch(next);
    }
  }

  async multipleAction(req, res, next) {
    const modifiedBy = {
      idUser: "test2",
      userName: "test2",
    };
    switch (req.body.action) {
      case "active": {
        await itemsModel
          .updateMany(
            { _id: { $in: req.body.checkItem } },
            {
              status: "active",
              modifiedBy: modifiedBy,
            }
          )
          .then((data) => {
            req.flash(
              "info",
              data.nModified + messageItemHelper.multiFlashStatus
            );
            res.redirect("back");
          })
          .catch(next);
        break;
      }
      case "inactive": {
        await itemsModel
          .updateMany(
            { _id: { $in: req.body.checkItem } },
            {
              status: "inactive",
              modifiedBy: modifiedBy,
            }
          )
          .then((data) => {
            req.flash(
              "info",
              data.nModified + messageItemHelper.multiFlashStatus
            );
            res.redirect("back");
          })
          .catch(next);
        break;
      }
      case "delete": {
        await itemsModel
          .delete({ _id: { $in: req.body.checkItem } })
          .then((data) => {
            req.flash(
              "info",
              data.nModified + messageItemHelper.multtFlashDelete
            );
            res.redirect("back");
          })
          .catch(next);
        break;
      }
      case "changeOrdering": {
        let index = 0;
        let listID = Array.isArray(req.body.checkItem)
          ? req.body.checkItem
          : [req.body.checkItem];
        let listOrder = Array.isArray(req.body.ordering)
          ? req.body.ordering
          : [req.body.ordering];
        for (const value of listID) {
          await itemsModel.findByIdAndUpdate(value, {
            ordering: parseInt(listOrder[index]),
            modifiedBy: modifiedBy,
          });
          index++;
        }
        req.flash("info", `${index} has been changed ordering`);
        res.redirect("back");
        //     .then(() => {
        //     res.redirect('back');
        // })
        //     .catch(next);
        break;
      }
      default: {
        res.send(req.body);
      }
    }
  }

  async deleteSoft(req, res, next) {
    await itemsModel.deleteById(req.params.id).then(() => {
      req.flash("info", messageItemHelper.flashDelete);
      res.redirect("back");
    });
  }

  async addNewItem(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errorArr = {};
      errors["errors"].forEach((error) => {
        errorArr[`${error.param}`] = error.msg;
      });
      res.render(`${pathView}/form`, {
        item: req.body,
        errorArr,
        message: "",
        title: "Add",
        link: `${pathRedirectView}/add`,
      });
    } else {
      await itemsModel.create(req.body);
      req.flash("info", messageItemHelper.flashAdd);
      res.redirect(`${pathRedirectView}`);
    }
  }

  async sortGroup(req, res, next) {
    req.session.sortName = req.params.sortName;
    req.session.sortType = req.params.sortType;
    res.redirect("/admin/items");
  }

  async changeStatusItem(req, res, next) {
    let statusChange = req.params.status === "active" ? "inactive" : "active";
    const modifiedBy = {
      idUser: "test2",
      userName: "test2",
    };
    await itemsModel
      .findByIdAndUpdate(req.params.id, {
        status: statusChange,
        modifiedBy: modifiedBy,
      })
      .lean()
      .then((data) => {
        req.flash("info", messageItemHelper.flashStatus);
        res.redirect(pathRedirectView);
      });
  }

  async getItemDependStatus(req, res, next) {
    let statusFilter = await helpers.createFilterStatus(
      req.params.status,
      itemsModel
    );
    let checkStatus = req.params.status !== "all" ? req.params.status : "";
    let sortName = req.session.sortName ? req.session.sortName : "ordering";
    let sortType = req.session.sortType ? parseInt(req.session.sortType) : 1;
    let sortCondition = {};
    sortCondition[sortName] = sortType;
    let whereQuery;
    let pagination = {
      totalItemsPerpage: totalItem,
      currentPages: req.query.page ? parseInt(req.query.page) : 1,
    };
    if (checkStatus === "") {
      if (req.query.search && req.query.search !== "") {
        whereQuery = { name: { $regex: `${req.query.search}`, $options: "i" } };
      }
    } else {
      if (req.query.search && req.query.search !== "") {
        whereQuery = {
          status: checkStatus,
          name: { $regex: `${req.query.search}`, $options: "i" },
        };
      } else {
        whereQuery = { status: checkStatus };
      }
    }
    Promise.all([
      await itemsModel
        .find(whereQuery)
        .sort({ ordering: 1 })
        .skip((pagination.currentPages - 1) * pagination.totalItemsPerpage)
        .limit(pagination.totalItemsPerpage)
        .lean(),
      await itemsModel.count(whereQuery),
    ])
      .then(([items, countItems]) => {
        let searchValue = req.query.search ? req.query.search : "";
        pagination.countItems = countItems;
        pagination.totalPages = Math.ceil(
          countItems / pagination.totalItemsPerpage
        );
        pagination.pageRange = pageRange > countItems ? countItems : pageRange;
        let message = req.flash("info");
        res.render(`${pathView}/list`, {
          items: items,
          statusFilter: statusFilter,
          statusPath: `/status/${req.params.status}`,
          searchValue,
          pagination,
          message,
          sortName,
          sortType,
        });
      })
      .catch(next);
  }

  async getFormItem(req, res, next) {
    let link;
    let message = req.flash("info");
    if (req.params.id !== undefined) {
      link = `${pathRedirectView}/update/${req.params.id}?_method=PUT`;
      await itemsModel
        .findById(req.params.id)
        .lean()
        .then((data) => {
          res.render(`${pathView}/form`, {
            title: "Edit",
            item: data,
            link,
            message,
          });
        });
    } else {
      link = `${pathRedirectView}/add`;
      res.render(`${pathView}/form`, {
        title: "Add",
        item: formSingleItem,
        link,
        message,
      });
    }
  }

  async getHomePage(req, res, next) {
    let statusFilter = await helpers.createFilterStatus("all", itemsModel);
    let sortName = req.session.sortName ? req.session.sortName : "ordering";
    let sortType = req.session.sortType ? parseInt(req.session.sortType) : 1;
    let sortCondition = {};
    sortCondition[sortName] = sortType;
    let whereQuery = {};
    let pagination = {
      totalItemsPerpage: totalItem,
      currentPages: req.query.page ? parseInt(req.query.page) : 1,
    };
    if (req.query.search && req.query.search !== "") {
      whereQuery = {
        name: { $regex: `${req.query.search}`, $options: "i" },
      };
    }
    Promise.all([
      await itemsModel
        .find(whereQuery)
        .sort(sortCondition)
        .skip((pagination.currentPages - 1) * pagination.totalItemsPerpage)
        .limit(pagination.totalItemsPerpage)
        .lean(),
      await itemsModel.count(whereQuery),
    ])
      .then(([items, countItems]) => {
        let searchValue = req.query.search ? req.query.search : "";
        pagination.countItems = countItems;
        pagination.totalPages = Math.ceil(
          countItems / pagination.totalItemsPerpage
        );
        pagination.pageRange = pageRange > countItems ? countItems : pageRange;
        let message = req.flash("info");
        res.render(`${pathView}/list`, {
          items: items,
          statusFilter: statusFilter,
          statusPath: "",
          searchValue,
          pagination,
          message,
          sortName,
          sortType,
        });
      })
      .catch(next);
  }
}

module.exports = new ItemsService();
