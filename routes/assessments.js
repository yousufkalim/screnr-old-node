/**
 * Assessments routes
 * @codeBy Shuja Naqvi
 */
const router = require("express").Router();
const assessments = require("../controllers/assessments");

const {
  validateAssessmentrequest,
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
  validateAssessmentrequest, //Validate require data from body
  isValidated, //if validate/not
  assessments.create //create Assessment
);
router.get("/getassessment/:assessmentID", assessments.getAssessment); //get an assessment
router.get("/:userID", assessments.getAll); //get All Assessments of a patient/Therapist
router.put("/update/:assessmentID", assessments.updateAssessment); //update Assessment
router.put("/startassessment/:assessmentID", assessments.startassessment); //start assessment
router.put("/endassessment/:assessmentID", assessments.endassessment); //end assessment
module.exports = router;
