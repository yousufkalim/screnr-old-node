/**
 * User CRUD routes
 * @author Yousuf Kalim
 */
 const router = require("express").Router();
 const patients = require("../controllers/patients");
 const { upload } = require("../middleware/multer");
 const {
    validatePatients,
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
   validatePatients,
   isValidated,
   patients.create
 );
 // Read
 router.get("/", patients.getAll); // Get all users at once
 router.get("/getTherapists", patients.getTherapists); // Get all users at once
 router.get("/:userId", patients.getById); // Get one user by it's id
 // Update
 router.put("/:userId",upload.single("image"), patients.update); // Update a specific user by it's id
 // Delete
 //router.delete("/:userId", users.delete); // delete a specific user by it's id
 
 // Export
 module.exports = router;
 