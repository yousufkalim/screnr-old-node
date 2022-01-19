/**
 * User auth routes
 * @codeBy Shuja Naqvi
 */
const router = require("express").Router(); //Access to express router module
const auth = require("../controllers/auth"); //Access to auth controller
const { checkAuth,checkPatient } = require("../middleware/checkAuth"); //Middleware to check jwt in header
const {
  validateLogin,
  isValidated,
  changePasswordValidate,
} = require("../middleware/validators"); //validators to validate data coming from body

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user login
 * @method get check auth
 * @method put change password
 * @method post forgot email
 */

// Read
router.post("/login", validateLogin, isValidated, auth.login); // Login of all  user
router.get("/", checkAuth, auth.confirmAuth); //validate jwt in header
router.put(
  "/password/:userId",
  changePasswordValidate, //validating params
  isValidated,
  auth.changePassword // Change password route
);
router.put("/forgot/:email", auth.forgot); //forget password route
// Export
module.exports = router;
