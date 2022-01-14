/**
 * Patients  routes
 * @codeBy Shuja Naqvi
 */
const router = require("express").Router(); //Access to express router module
const patients = require("../controllers/patients"); //Access to Patients controller
const { upload } = require("../middleware/multer"); //Multer to upload profile_picture(avatar)
const { validatePatients, isValidated } = require("../middleware/validators"); //validating for the front-end according to the schema
const { checkAuth, checkPatient } = require("../middleware/checkAuth"); //Middleware to check jwt in header
/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Patients signup
 * @method get get all Patients
 * @method get get Patient by id
 * @method put update Patients
 * @method delete delete Patients
 */

// Create - Patients Signup
router.post(
  "/",
  upload.single("image"), //This will check if avatar is coming from body and store to a specific folder
  validatePatients, //Validate all the data coming from body
  isValidated, //if data is validated
  patients.create //move to controller to create Patient
);
// Read
router.get("/", checkAuth, checkPatient, patients.getAll); // Get all Patient at once
router.get("/:patientId", patients.getById); // Get one Patient by it's id
// Update
router.put("/:patientId", upload.single("image"), patients.update); // Update a specific Patient by it's id
// Delete
router.delete("/:patientId", patients.delete); // delete a specific user by it's id

// Export
module.exports = router;
