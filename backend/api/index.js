require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const placesRoutes = require("./routes/places");
const statusRoutes = require("./routes/status");
const mapRoutes = require("./routes/map");
const reviewsRoutes = require("./routes/reviews");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api", authRoutes);
app.use("/api/places", placesRoutes);
app.use("/api", statusRoutes);
app.use("/api", mapRoutes);
app.use("/api/reviews", reviewsRoutes);

module.exports = app;
