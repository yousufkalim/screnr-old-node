/**
 * Check auth middleware
 * @codeBy Shuja Naqvi
 */
const jwt = require("jsonwebtoken"); //JWT
const tokenSecret = process.env.JWT_SECRET;

// Check auth
exports.checkAuth = (req, res, next) => {
  // Get token from Header
  const header = req.get("Authorization");
  // Check if not token
  if (!header || !header.startsWith("Bearer")) {
    return res.status(403).json({
      success: false,
      message: "No token found, Authorization denied",
    });
  }
  try {
    // Decrypting token

    const token = header.split(" ")[1];
    console.log("token is", token);
    console.log("ttokenSecretoken is", tokenSecret);
    const decoded = jwt.verify(token, tokenSecret);
    console.log("decoded is", decoded.user);
    req.user = decoded.user;
    // If user authenticated
    res.set(
      "cache-control",
      "no-cache, no-store, private, must-revalidate, post-check=0, pre-check=0"
    );
    // Done
    next();
  } catch (err) {
    // If not
    res
      .status(403)
      .json({ success: false, message: "Your session has been expired" });
  }
};
