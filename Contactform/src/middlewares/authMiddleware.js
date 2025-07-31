import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Verificar si el token viene en una cookie
  const cookieToken = req.cookies?.jwt;

  // Verificar si el token viene en el header Authorization
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  const token = cookieToken || headerToken;
  if (!token) {
    return res.status(401).json({
      error: "Token no proporcionado",
      details: "No se encontró ni en cookie ni en encabezado",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (!decoded.id || !decoded.username) {
      return res.status(401).json({ error: "Token inválido: información incompleta" });
    }

    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido", details: "Firma no válida" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado", details: `Expiró en ${new Date(error.expiredAt).toISOString()}` });
    }
    return res.status(500).json({ error: "Error al verificar el token", details: error.message });
  }
};

export default authMiddleware;