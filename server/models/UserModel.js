const mongoose = require("mongoose");
const { OrderSchema } = require("./Ordermodels");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileno: {
    type: Number,
    required: true,
  },
  memberSince: {
    type: Date,
    required: true,
  },
  address: {
    type: Array,
    items: {
      id: { type: Number },
      type: { type: Number },
      tag: { type: String },
      address: { type: String },
      area: { type: String },
      city: { type: String },
      pincode: { type: Number },
      location: {
        type: Array,
        items: {
          longitude: { type: Number },
          latitude: { type: Number },
        },
      },
      isDefault: { type: Boolean },
    },
  },
  ordersPlaced: {
    type: Map,
    of: OrderSchema,
    required: false,
  },
  verified: {
    type: Boolean,
  },
  otpToken: {
    type: String,
  },
  otpExpire: {
    type: Date,
  },
  resetPwdToken: {
    type: String,
    default: null,
  },
  resetPwdExpire: {
    type: Date,
    default: null,
  },
});

const userModel = mongoose.model("UsersLogins", userSchema);
module.exports = userModel;
