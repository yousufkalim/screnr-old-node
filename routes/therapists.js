/**
 * Therapists routes
 * @code Shuja Naqvi
 */
const router = require("express").Router();
const therapists = require("../controllers/therapists"); //Access to therapist controller
const { upload } = require("../middleware/multer"); //Multer to upload profile_picture(avatar)
const { validateTherapists, isValidated } = require("../middleware/validators"); //validating for the front-end according to the schema
const { checkAuth, checkPatient } = require("../middleware/checkAuth"); //Middleware to check jwt in header
/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Therapists signup
 * @method get get all Therapists
 * @method get get Therapists by id
 * @method put update Therapists
 * @method delete delete Therapists
 */
// Create - Therapists Signup
router.post(
  "/",
  upload.single("image"), //This will check if avatar is coming from body and store toa specific folder
  validateTherapists, //Validate all the data coming from body
  isValidated, //if data is validate
  therapists.create //move to controller to create Therapist
);
// Read
router.get("/", checkAuth, checkPatient, therapists.getAll); // Get all Therapists at once
router.get("/:therapistId", therapists.getById); // Get one Therapist by it's id
// Update
router.put("/:therapistId", upload.single("image"), therapists.update); // Update a specific Therapist by it's id
// Delete
router.delete("/:therapistId", therapists.delete); // delete a Therapist user by it's id
// Export
module.exports = router;
