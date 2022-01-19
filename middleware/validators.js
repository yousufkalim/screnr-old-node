/**
 * All the validation
 * @codeBy Shuja Naqvi
 */
const { check, validationResult } = require("express-validator");

/*
====================
Validations
====================
*/

// You can create multiple validations strategies (Read express-validator documentation for more details)
// Therapist Signup Validation
exports.validateTherapists = [
  check("first_name", "First Name is required.").notEmpty().trim(),
  check("last_name", "Last Name is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("confirmPassword", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("gender", "Gender is required.").notEmpty(),
  check("doc_specailization", "doc_specailization is required.").notEmpty(),
  check("dob", "date of birth is required").notEmpty().trim(),
  check("phone", "Phone is required.").notEmpty().isNumeric().trim(),
];
// Patients Signup Validation
exports.validatePatients = [
  check("first_name", "First Name is required.").notEmpty().trim(),
  check("last_name", "Last Name is required.").notEmpty().trim(),
  check("middle_name", "Middle Name is required.").notEmpty().trim(),
  check("national_id", "national_id is required.").notEmpty().trim(),
  check("patient_id", "patient_id is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("problem_name", "problem_name is required.").notEmpty().trim(),
  check("problem_description", "problem_description is required.")
    .notEmpty()
    .trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("gender", "Gender is required.").notEmpty(),
  check("dob", "date of birth is required").notEmpty().trim(),
  check("phone", "Phone is required.").notEmpty().isNumeric().trim(),
];
// Login validation
exports.validateLogin = [
  check("email", "Email is required").notEmpty().isEmail().trim().toLowerCase(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
];

// Change password validation
exports.changePasswordValidate = [
  check("oldPassword", "Old Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("newPassword", "New password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("confirmPassword", "Confirm password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
];
//validate Assessment
exports.validateAssessmentrequest = [
  check("patient", "patientID is required.").notEmpty().trim(),
  check("therapist", "TherapistID  is required.").notEmpty().trim(),
  check("form_title", "form_title is required").notEmpty().trim(),
  check("form_description", "form_description is required").notEmpty().trim(),
];
//validate Question
exports.validateQuestion = [
  check("question.*.question_text", "Question is required.").notEmpty().trim(),
  check("question.*.type", "Question_Type  is required.").notEmpty().trim(),
  check("question.*.assessment","AssessmenID is required").notEmpty().trim(),
];
//Validate Answer
exports.validateAnswer = [
  check("answer.*.question_id", "Question is required.").notEmpty().trim(),
  check("answer.*.value", "Answer  is required.").notEmpty().trim(),
];
//Validate Feedback
exports.validateFeedback = [
  check("feedbacks.*.question_id", "Question_ID is required.").notEmpty().trim(),
  check("feedbacks.*.feedback", "Feedback is   is required.").notEmpty().trim(),
];
/*
======================
Result
======================
*/

/**
 * To check if request validated successfully or not, according to our validation strategies
 * @param {object} req
 * @param {object} res
 * @param {*} next
 */
exports.isValidated = (req, res, next) => {
  const errors = validationResult(req); // Validating the request by previous middleware's strategy
  if (!errors.isEmpty()) {
    // On error
    res.status(400).send({ success: false, message: errors.array()[0] }); // Sending first error to the client from array of errors
  } else {
    // Validated successfully
    next(); // Pass the request to next middleware or controller
  }
};
