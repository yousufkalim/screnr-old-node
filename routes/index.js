/**
 * All api routes handles here
 * @author Yousuf Kalim
 */
const router = require("express").Router();

// Parent Routes
router.use("/therapists", require("./therapists")); // All the Therapist routes
router.use("/patients", require("./patients"));    //All the Patients routes
router.use("/assessments", require("./assessments"));   //All assessments routes
router.use("/auth", require("./auth"));           // All the auth routes
// Export
module.exports = router;
