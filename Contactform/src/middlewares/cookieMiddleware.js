// Middleware para configurar cookies correctamente en producción
export const cookieConfig = (req, res, next) => {
  // Configurar headers para permitir cookies en CORS
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Agregar método helper para configurar cookies de manera consistente
  res.setCookieSecure = (name, value, options = {}) => {
    const defaultOptions = {
      httpOnly: true,
      secure: false, // HTTP en VPS (sin HTTPS)
      sameSite: "Lax", // Menos restrictivo para HTTP
      path: "/",
      domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
    };
    
    res.cookie(name, value, { ...defaultOptions, ...options });
  };
  
  next();
};
