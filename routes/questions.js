/**
 * Questions routes
 * @codeBy Shuja Naqvi
 */
const router = require("express").Router(); //Access to express router module
const questions = require("../controllers/questions"); //Access to Quesyions controller
const {
  validateQuestion,
  validateAnswer,
  validateFeedback,
  isValidated,
} = require("../middleware/validators"); //validators to validate data coming from body

/**
 * ////////////////////////// Routes /////////////////////////
 * @method get check Questions
 * @method put  update Question
 */
//Delete Question
router.delete("/:questionId", questions.deleteQuestion);
//Answer to a question
router.put("/feedback", validateFeedback, isValidated, questions.feedback); //therapist's feedback
// Export
module.exports = router;
