const express = require("express");
const router = express.Router();

// GET /api/status
router.get("/status", (req, res) => res.json({ status: "ok" }));

module.exports = router;
