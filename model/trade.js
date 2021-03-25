const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TradeSchema = new Schema({
  tickerSymbol: {
    type: String,
    unique: true,
  },
  avgBuyPrice: {
    type: Number,
    min: 0,
  },
  shares: {
    type: Number,
    min: 0,
  }
});

module.exports = mongoose.model("trade", TradeSchema);
