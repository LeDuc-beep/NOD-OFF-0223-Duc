const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const categorySchema = new Schema({
   "name" : {
       type: String,
       default: '',
   },
    "slug": {
       type: String,
        slug: "name",
    },
    status: {
        type: String,
        default: '',
    },
    ordering: {
        type: Number,
        default: 0,
    },
    createdBy: {
        idUser: {
            type: String,
            default: '',
        },
        userName: { type: String, default: '' },
    },
    modifiedBy: {
        idUser: { type: String, default: ''},
        userName: {type: String, default: ''},
    }
}, {
    timestamps: true,
})

categorySchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });
const category = mongoose.model("category", categorySchema);
module.exports = category;
