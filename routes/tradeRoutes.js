const router = require("express").Router();

// controller
const tradeController = require("../controllers/tradeController");

router
  .route("/")
  .get(tradeController.getTrades)
  .post(tradeController.addTrade);

router
  .route("/:id")
  .put( tradeController.updateTradeById)
  .delete(tradeController.deleteTradeById);

router.route("/returns").get(tradeController.getReturns);

module.exports = router;
