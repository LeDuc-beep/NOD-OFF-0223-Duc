const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { messageItemHelper } = require("../../helpers/message");

const itemController = require("../../controller/items.controller");

/* Edit Items */
router.put(
  "/update/:id",
  body("name").isLength({ min: 5 }).withMessage(messageItemHelper.errorName),
  body("ordering").isNumeric().withMessage(messageItemHelper.errorOrdering),
  (req, res, next) => {
    itemController.updateById(req, res, next);
  }
);

/* Multiple Action */
router.post("/multipleAction", (req, res, next) => {
  itemController.multipleAction(req, res, next);
});

/* DELETE SOFT Items */
router.delete("/:id", (req, res, next) => {
  itemController.deleteSoft(req, res, next);
});

/* ADD new items. */
router.post(
  "/add",
  body("name").isLength({ min: 5 }).withMessage(messageItemHelper.errorName),
  body("ordering").isNumeric().withMessage(messageItemHelper.errorOrdering),
  async (req, res, next) => {
    itemController.addNewItem(req, res, next);
  }
);

/* SORT */
router.get("/sort/:sortName/:sortType", (req, res, next) => {
  itemController.sortGroup(req, res, next);
});

/* Change Status Items */
router.get("/changeStatus/:id/:status", (req, res, next) => {
  itemController.changeStatusItem(req, res, next);
});

/* GET item all */
router.get("/status/:status", (req, res, next) => {
  itemController.getItemDependStatus(req, res, next);
});

/* Form item */
router.get("/form(/:id)?", (req, res, next) => {
  itemController.getFormItem(req, res, next);
});

/* GET home page. */
router.get("/", (req, res, next) => {
  itemController.getHomePage(req, res, next);
});

module.exports = router;
