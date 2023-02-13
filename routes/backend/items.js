const express = require("express");
const router = express.Router();

const itemsModel = require("../.././models/items");
const helpers = require("../../helpers/utils");
const {body, validationResult} = require("express-validator");
const {json} = require("express");
const {messageItemHelper} = require("../../helpers/message");

// total item per page
const totalItem = 2;
// number pages display
const pageRange = 3;
// Path view
const pathViewItem = 'pages/items';
// Redirect view
const pathRedirectView = '/admin/items';
// Form Single Item
let formSingleItem = {
    name: "",
    status: "",
    ordering: "",
}

/* Edit Items */
router.put(
    "/update/:id",
    body('name').isLength({min: 5}).withMessage(messageItemHelper.errorName),
    body('ordering').isNumeric().withMessage(messageItemHelper.errorOrdering),
    async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let errorArr = {};
        errors["errors"].forEach((error) => {
            errorArr[`${error.param}`] = error.msg;
        })
        res.render(`pages/items/form`,
            {item: req.body, errorArr, message: "", title: "Edit",link : `/admin/items/update/${req.params.id}?_method=PUT`})
    }
    else
    {
        await itemsModel.findByIdAndUpdate(req.params.id,req.body)
            .then(() => {
                req.flash('info',messageItemHelper.flashUpdate);
                res.redirect("/admin/items");
            })
            .catch(next);
    }

})

/* Multiple Action */
router.post('/multipleAction', async (req,res,next) => {
   switch (req.body.action){
       case "active":{
           await itemsModel.updateMany({_id: {$in: req.body.checkItem}}, {status: "active"})
               .then((data) => {
                   req.flash('info',data.nModified + messageItemHelper.multiFlashStatus);
                   res.redirect('back');
               })
               .catch(next);
           break;
       }
       case "inactive":{
           await itemsModel.updateMany({_id: {$in: req.body.checkItem}}, {status: "inactive"})
               .then((data) => {
                   req.flash('info',data.nModified + messageItemHelper.multiFlashStatus);
                   res.redirect('back');
               })
               .catch(next);
           break;
       }
       case "delete": {
           await  itemsModel.delete({_id: {$in: req.body.checkItem}})
               .then((data) => {
                   req.flash('info',data.nModified + messageItemHelper.multtFlashDelete);
                   res.redirect('back');
               })
               .catch(next);
           break;
       }
       case "changeOrdering": {
           let index = 0;
           let listID = (Array.isArray(req.body.checkItem))?req.body.checkItem:[req.body.checkItem];
           let listOrder = (Array.isArray(req.body.ordering))?req.body.ordering:[req.body.ordering];
           for(const value of listID) {
               await itemsModel.findByIdAndUpdate(value,{ordering: parseInt(listOrder[index])});
               index++;
           }
           req.flash('info',`${index} has been changed ordering`);
           res.redirect('back');
           //     .then(() => {
           //     res.redirect('back');
           // })
           //     .catch(next);
           break;
       }
       default : {
           res.send(req.body);
       }
   }
})

/* DELETE SOFT Items */
router.delete('/:id', async (req,res,next) => {
    await itemsModel.deleteById(req.params.id)
        .then(() => {
        req.flash('info',messageItemHelper.flashDelete);
        res.redirect('back');
        })
})

/* Change Status Items */
router.get("/changeStatus/:id/:status", async (req,res,next) => {
  let statusChange = (req.params.status === "active")?"inactive":"active";
  await itemsModel.findByIdAndUpdate(req.params.id,{status: statusChange})
      .then((data) => {
          req.flash('info',messageItemHelper.flashStatus);
          res.redirect(pathRedirectView);
      })
} )

/* ADD new items. */
router.post(
    "/add",
    body('name').isLength({min: 5}).withMessage(messageItemHelper.errorName),
    body('ordering').isNumeric().withMessage(messageItemHelper.errorOrdering),
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let errorArr = {};
        errors["errors"].forEach((error) => {
            errorArr[`${error.param}`] = error.msg;
        })
        res.render(`${pathViewItem}/form`,{item: req.body, errorArr, message: "", title: "Add",link : `${pathRedirectView}/add`})
    }
    else
    {
        await itemsModel.create(req.body);
        req.flash('info',messageItemHelper.flashAdd);
        res.redirect(`${pathRedirectView}`);
    }

});

/* GET item all */
router.get("/status/:status", async (req, res, next) => {
  let statusFilter = await helpers.createFilterStatus(req.params.status);
  let checkStatus = req.params.status !== "all" ? req.params.status : "";
  let whereQuery;
  let pagination = {
    totalItemsPerpage : totalItem,
    currentPages : (req.query.page)?parseInt(req.query.page):1,
  }
  if (checkStatus === "") {
    if (req.query.search && req.query.search !== "") {
      whereQuery = { name: { $regex: `${req.query.search}`, $options: 'i' } };
    }
  } else {
    if (req.query.search && req.query.search !== "") {
      whereQuery = {
        status: checkStatus,
        name: { $regex: `${req.query.search}`, $options: 'i' },
      };
    } else {
      whereQuery = { status: checkStatus };
    }
  }
  Promise.all(([
    await itemsModel
        .find(whereQuery).sort({ordering: 1})
        .skip((pagination.currentPages-1)*pagination.totalItemsPerpage)
        .limit(pagination.totalItemsPerpage),
    await itemsModel
        .count(whereQuery),
  ]))
    .then(([items,countItems]) => {
      searchValue = req.query.search ? req.query.search : "";
      pagination.countItems = countItems;
      pagination.totalPages = Math.ceil(countItems/pagination.totalItemsPerpage);
      pagination.pageRange = (pageRange > countItems)?countItems:pageRange;
        let message = req.flash('info');
      res.render(`${pathViewItem}/list`, {
        items: items,
        statusFilter: statusFilter,
        statusPath: `/status/${req.params.status}`,
        searchValue,
        pagination,
        message
      });
    })
    .catch(next);
});

/* Form item */
router.get("/form(/:id)?", async (req,res,next) => {
    let link;
    let message = req.flash('info');
    if(req.params.id !== undefined)
    {
        link = `${pathRedirectView}/update/${req.params.id}?_method=PUT`;
        await itemsModel.findById(req.params.id)
            .then((data) => {

                res.render(`${pathViewItem}/form`,{title: "Edit", item: data, link, message});
            })
    }
    else{
        link = `${pathRedirectView}/add`;
        res.render(`${pathViewItem}/form`,{title: "Add", item: formSingleItem, link, message});
    }
})

/* GET home page. */
router.get("/", async function (req, res, next) {
  let statusFilter = await helpers.createFilterStatus();
  let whereQuery = {};
  let pagination = {
    totalItemsPerpage : totalItem,
    currentPages : (req.query.page)?parseInt(req.query.page):1,
  }
  if (req.query.search && req.query.search !== "") {
    whereQuery = {
      name: { $regex: `${req.query.search}`, $options: 'i' },
    };
  }

  Promise.all(([
    await itemsModel
        .find(whereQuery).sort({ordering: 1})
        .skip((pagination.currentPages-1)*pagination.totalItemsPerpage)
        .limit(pagination.totalItemsPerpage),
    await itemsModel
        .count(whereQuery),
  ]))
    .then(([items,countItems]) => {
      searchValue = req.query.search ? req.query.search : "";
      pagination.countItems = countItems;
      pagination.totalPages = Math.ceil(countItems/pagination.totalItemsPerpage);
      pagination.pageRange = (pageRange > countItems)?countItems:pageRange;
      let message = req.flash('info');
      res.render(`${pathViewItem}/list`, {
        items: items,
        statusFilter: statusFilter,
        statusPath: "",
        searchValue,
        pagination,
          message
      });
    })
    .catch(next);
});

module.exports = router;
