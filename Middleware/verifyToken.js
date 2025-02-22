
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
    if (!token)
        return res.status(401).json({ message: "Authentication token not provided." });

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token." });

    req.user = {
      id: payload.userId, 
  
    };
    next();
  });
};
