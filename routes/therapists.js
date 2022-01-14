/**
 * User CRUD routes
 * @author Yousuf Kalim
 */
const router = require("express").Router();
const therapists = require("../controllers/therapists");
const { upload } = require("../middleware/multer");
const {
  validateTherapists,
  validateUserUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user signup
 * @method get get all users
 * @method get get user by id
 * @method put update user
 * @method delete delete user
 */

// Create - User Signup
router.post(
  "/",
  upload.single("image"),
  validateTherapists,
  isValidated,
  therapists.create
);

// Read
router.get("/", therapists.getAll); // Get all users at once
// router.get("/getPatients", users.getPatients); // Get all users at once
router.get("/:userId", therapists.getById); // Get one user by it's id
// Update
router.put("/:userId",upload.single("image"),  therapists.update); // Update a specific user by it's id
// Delete
router.delete("/:userId", therapists.delete); // delete a specific user by it's id

// Export
module.exports = router;
