const mongoose = require("mongoose");

const SearchHistorySchema = new mongoose.Schema({
  ingredient: {
    type: String,
    required: true,
  },

  score: Number,

  analysis: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SearchHistory", SearchHistorySchema);