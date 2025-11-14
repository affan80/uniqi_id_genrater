// backend/middleware/verifySession.js
import jwt from "jsonwebtoken";

// must match SESSION_SECRET in qrRoutes
const SESSION_SECRET = "JungleMeMungleKareHumSabSOCSsWale";

export function verifySession(req, res, next) {
  // Session token may come in Authorization header or query/body
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : (req.body.sessionToken || req.query.sessionToken);

  if (!token) return res.status(401).json({ error: "Missing session token" });

  try {
    const payload = jwt.verify(token, SESSION_SECRET);
    // attach to request for handler to check
    req.session = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session token" });
  }
}
