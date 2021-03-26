const trade = require("../model/trade");
const Joi = require("joi");

exports.getTrades = async (req, res) => {
  try {
    const trades = await trade.find({});
    res.json(trades);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: " server error" });
  }
};

exports.addTrade = async (req, res) => {

  //validating the body
  const Schema=Joi.object().keys({
    tickerSymbol: Joi.string()
    .min(3)
      .required(),
    avgBuyPrice: Joi.number()
      .min(0)
      .required(),
    shares: Joi.number()
      .min(1)
      .required()
  });
  const result = Schema.validate(req.body);
    if (result.error) {
      return res.sendBadRequest(result.error);
    }




  try {
    const { tickerSymbol, avgBuyPrice, shares } = req.body;

    const isTickerExists = await trade.findOne({ tickerSymbol });
    if (isTickerExists)
      return res.sendAlreadyExists({ message: " already exists!" });

    const newTrade = new trade({ tickerSymbol, avgBuyPrice, shares });
    const savedTrade = await newTrade.save();
    res.sendCreated(savedTrade);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: " server error" });
  }
};

exports.updateTradeById = async (req, res) => {
  try {
    const id = req.params.id;
    const method = req.query.method;
    const details = req.body;
    console.log(method);
    
    let currentItem = await trade.findById(id);
    if (!currentItem) {
      return res.sendNotFound();
    }
    let initialBuyPrice = currentItem.avgBuyPrice;
    let initialShares = currentItem.shares;
    if (method === "sell") {

    const schema =  Joi.object().keys({
      shares: Joi.number()
        .min(1)
        .required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
      return res.sendBadRequest(result.error);
    }

    currentItem.shares -= Number.parseInt(details.shares);
      if (currentItem.shares < 0) {
        return res
          .status(400)
          .send({ message: `cannot sell more than ${initialShares}` });
      }
      await currentItem.save();
    } else if (method === "buy") {


      const schema =  Joi.object().keys({
        buyPrice: Joi.number()
          .min(0)
          .required(),
        shares: Joi.number()
          .min(1)
          .required()
      });
      const result = schema.validate(req.body);
      if (result.error) {
        return res.sendBadRequest(result.error);
      }
  
      let sum = initialShares * initialBuyPrice;
      sum =sum+Number.parseInt(details.shares) * Number.parseFloat(details.buyPrice);
      currentItem.shares += Number.parseInt(details.shares);
      currentItem.avgBuyPrice = sum / currentItem.shares;
      await currentItem.save();
    }
    return res.status(200).json(currentItem);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: " server error" });
  }
};

exports.deleteTradeById = async (req, res) => {
  try {
    const tickerId = req.params.id;
    const deletedTicker = await trade.findByIdAndDelete(tickerId);
    if (!deletedTicker) return res.sendNotFound();
    res.json(deletedTicker);
  } catch (err) {
    console.log(err);
    res.sendServerError();
  }
};

exports.getReturns = async (req, res) => {
  try {
    const currentPrice = 100;
    const trades = await trade.find({});
    let returns = 0;
    for (let i = 0; i < trades.length; i++) {
      returns += (currentPrice - trades[i].avgBuyPrice) * trades[i].shares;
    }
    let responsejson = {
      returns
    };
    return res.json(responsejson);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: " server error" });
  }
};
