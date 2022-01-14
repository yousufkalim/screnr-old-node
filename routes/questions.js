/**
 * Questions routes
 * @codeBy Shuja Naqvi
 */
const router = require("express").Router(); //Access to express router module
const questions = require("../controllers/questions"); //Access to Quesyions controller
const { validateQuestion,validateAnswer,validateFeedback, isValidated } = require("../middleware/validators"); //validators to validate data coming from body

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Create Questions
 * @method get check Questions
 * @method put  update Question
 */

// Read
router.post("/", validateQuestion, isValidated, questions.create); // Create Questionair
//Delete Question
router.delete("/:questionId", questions.deleteQuestion);    //Delete a question
//Answer to a question 
router.put("/answer",validateAnswer,isValidated,questions.answer); //answer to the questions
//Answer to a question 
router.put("/feedback",validateFeedback,isValidated,questions.feedback); //therapist's feedback
// Export
module.exports = router;
