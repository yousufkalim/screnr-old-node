/**
 * All api routes handles here
 * @author Yousuf Kalim
 */
const router = require("express").Router();

// Parent Routes
router.use("/therapists", require("./therapists")); // All the user routes
router.use("/patients", require("./patients"));
router.use("/auth", require("./auth")); // All the auth routes

// Export
module.exports = router;
