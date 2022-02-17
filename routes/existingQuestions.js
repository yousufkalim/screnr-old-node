/**
 * Assessments routes
 * @codeBy Umar Bin Ayaz
 */
 const router = require("express").Router();
 const existingQuestions = require("../controllers/existingQuestions");
 const {
   ValidateExistingQuestionsRead,
   ValidateExistingQuestionsInsert
 } = require("../middleware/validators");
 
 /**
  * ////////////////////////// Routes /////////////////////////
  * @method post Create Assessment
  * @method post Get Quuestions
  */
 //Create - ExistingQuestion
 router.post(
   "/",
   ValidateExistingQuestionsInsert,
   existingQuestions.create
 );
 router.post(
   "/query",
    ValidateExistingQuestionsRead,
    existingQuestions.getFromQuery
 ); //get all exisitng questions from query
 module.exports = router;
 