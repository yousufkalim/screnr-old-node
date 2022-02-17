/**
 * Assessments routes
 * @codeBy Shuja Naqvi
 */
const router = require("express").Router();
const assessments = require("../controllers/assessments");
const { checkAuth } = require("../middleware/checkAuth"); //Middleware to check jwt in header
const {
  ValidateAssessmentRequest,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Create Assessment
 * @method get get all Assessment
 * @method get get assessment by id
 * @method put update assessment
 */
//Create - Assessment
router.post(
  "/",
  checkAuth,
  ValidateAssessmentRequest, //Validate require data from body
  isValidated, //if validate/not
  assessments.create //create Assessment
);
router.get(
  "/getassessment/:assessmentId",
  checkAuth,
  assessments.getAssessment
); //get an assessment
router.get("/:userId", assessments.getAll); //get All Assessments of a patient/Therapist
router.put("/update/:assessmentId", assessments.updateAssessment); //update Assessment
router.put("/startassessment/:assessmentId", assessments.startAssessment); //start assessment
router.put("/endassessment/:assessmentId", assessments.endAssessment); //end assessment
router.put("/reviewassessment/:assessmentId", assessments.reviewAssessment); //review assessment
module.exports = router;
