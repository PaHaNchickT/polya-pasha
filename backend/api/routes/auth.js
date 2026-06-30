const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/auth");
const { checkRevoked, addRevokedToken } = require("../middleware/revoke");

const router = express.Router();

// ---------- Пользователи из .env ----------
const USERS = [
  {
    login: process.env.USER1_LOGIN,
    password: process.env.USER1_PASSWORD,
    role: "admin",
  },
  {
    login: process.env.USER2_LOGIN,
    password: process.env.USER2_PASSWORD,
    role: "user",
  },
].filter((user) => user.login && user.password);

// POST /api/login
router.post("/login", (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.status(400).json({ error: "Укажите логин и пароль" });
  }
  const user = USERS.find((u) => u.login === login && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }
  const token = jwt.sign(
    { login: user.login, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  res.json({ token, user: { login: user.login, role: user.role } });
});

// POST /api/logout
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    await addRevokedToken(req.token);
    res.json({ success: true, message: "Токен отозван" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при выходе" });
  }
});

// GET /api/verify-token
router.get("/verify-token", authMiddleware, checkRevoked, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});

module.exports = router;
