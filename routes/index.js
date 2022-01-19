/**
 * All api routes handle here
 * @codeBy Shuja Naqvi
 */
const router = require("express").Router(); //Access to express router module

// Parent Routes
router.use("/therapists", require("./therapists")); // All the Therapist routes
router.use("/patients", require("./patients")); //All the Patients routes
router.use("/assessments", require("./assessments")); //All assessments routes
router.use("/questions",require("./questions"));
router.use("/auth", require("./auth")); // All the auth routes
// Export
module.exports = router;
