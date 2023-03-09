import mongoose, {Schema} from "mongoose";
import mongooseDelete from "mongoose-delete";

const categorySchema = new Schema({
   "name" : {
       type: String,
       default: '',
   },
    "slug": {
       type: String,
        default: '',
    }
}, {
    timestamps: true,
})

categorySchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });
const category = mongoose.model("category", categorySchema);
module.exports = category;
