const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb+srv://duc123:duc123456@cluster0.xp75a4x.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("Connect successfully");
  } catch (error) {
    console.log("Connect fail");
  }
}

module.exports = { connect };
