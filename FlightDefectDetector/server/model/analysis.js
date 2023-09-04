const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  user: { type: mongoose.Schema.Types.Mixed, required: true },
  analysisSet: { type: mongoose.Schema.Types.Mixed, required: true },
});

const analysisModel = mongoose.model("analysis", analysisSchema);

module.exports = analysisModel;
