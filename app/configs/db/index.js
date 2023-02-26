const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.LINK_MOONGOSE, {
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
