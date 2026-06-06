const jwt = require("jsonwebtoken");

// Функция для проверки токена (будет использоваться как middleware)
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Нет токена авторизации" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // сохраняем данные пользователя для дальнейшего использования
    req.token = token; // сохраняем сам токен для проверки чёрного списка
    next();
  } catch (err) {
    return res.status(401).json({ error: "Токен недействителен или истёк" });
  }
}

module.exports = { authMiddleware };
