const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");
const {Types} = require("mongoose");

const itemsSchema = new Schema(
  {
    name: {
        type: String,
        maxLength: 255,
        default: '',
    },
    status: {
        type: String,
        default: '',
    },
    ordering: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        default: '',
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
    },
    image: {
        type: String,
        default: '',
    },
    category: {
        type: Types.ObjectId,
        ref: 'category',
    }
  },
  {
    timestamps: true,
  }
);

itemsSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

const items = mongoose.model("items", itemsSchema);
module.exports = items;
