/**
 * Assessments CRUD routes
 * @author Yousuf Kalim
 * @codeBy Shuja Naqvi
 */
 const router = require("express").Router();
 const assessments = require("../controllers/assessments");
 const { upload } = require("../middleware/multer");
 const {
   validateAssessmentrequest,
   isValidated,
 } = require("../middleware/validators");
 
 /**
  * ////////////////////////// Routes /////////////////////////
  * @method post Create Assessment
  * @method get get all users
  * @method get get user by id
  * @method put update user
  * @method delete delete user
  */
 //Create - Assessment
 router.post(
   "/",
   validateAssessmentrequest,
   isValidated,
   assessments.create
 );
 

 module.exports = router;