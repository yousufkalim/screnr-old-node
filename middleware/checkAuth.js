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
    const decoded = jwt.verify(token, tokenSecret);
    if (decoded.patients) {
      req.user = decoded.patients;
      res.set(
        "cache-control",
        "no-cache, no-store, private, must-revalidate, post-check=0, pre-check=0"
      );
      // Done
      next();
    }
    // If user authenticated
    else if (decoded.therapist) {
      req.user = decoded.therapist;
      res.set(
        "cache-control",
        "no-cache, no-store, private, must-revalidate, post-check=0, pre-check=0"
      );
      // Done
      next();
    }
  } catch (err) {
    // If not
    res
      .status(403)
      .json({ success: false, message: "Your session has been expired" });
  }
};
//check Patient
exports.checkPatient = (req, res, next) => {
  try {
    if (req.user.role == "patient") {
      next();
    } else if (req.user.role == "therapist") {
      res
        .status(403)
        .json({ success: false, message: "You are not authorized" });
    }
  } catch (err) {
    // If not
    res
      .status(403)
      .json({
        success: false,
        message: "Your session has been expired",
        err: err.message,
      });
  }
};

//Check Therapist
exports.checkTherapist = (req, res, next) => {
  try {
    if (req.user.role == "therapist") {
      next();
    } else if (req.user.role == "patient") {
      res
        .status(403)
        .json({ success: false, message: "You are not authorized" });
    }
  } catch (err) {
    // If not
    res
      .status(403)
      .json({
        success: false,
        message: "Your session has been expired",
        err: err.message,
      });
  }
};