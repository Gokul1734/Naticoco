require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3500;
const MONGODB_URL = process.env.MONGO_URL;

//Routes
const authRoutes = require("./router/AuthRouter");
const paymentRoutes = require("./router/PaymentRouter");
const orderRoutes = require("./router/OrderRouter");
const DelPersonRouter = require("./router/DelPersonRoutes");
const addtocartRouter = require("./router/CartRouter");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect("mongodb://localhost:27017/Naticoco")
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("updateLocation", (data) => {
    console.log("Location update received:", data);
    io.to(data.orderId).emit("locationUpdate", data.location);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// API Routes.

//Login.
app.use("/auth", authRoutes);

//Register.
app.use("/payment", paymentRoutes);

//Order list get post And Pending Order.
app.use("/api/orders", orderRoutes);

app.use("/api/addtocart", addtocartRouter);

//Admin API

//Add Delivery Person and Get locatio and for admin and user.
app.use("/api/delivery", DelPersonRouter);

server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Server running on port 3500");
});
