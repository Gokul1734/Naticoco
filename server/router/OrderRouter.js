const express = require("express");
const {
  createOrder,
  getOrderAnalytics,
  getOrder,
} = require("../Controller/User/OrderController");

const router = express.Router();

//Place Order
router.post("/placeorder", createOrder);

//Get Order Analytics
router.get("/analytics", getOrderAnalytics);

router.get("/myorder/:userId", getOrder);

module.exports = router;
