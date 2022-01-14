/**
 * Questions schema
 * @codeBy Shuja Naqvi
 */
const mongoose = require("mongoose");

const QuestionsSchema = new mongoose.Schema(
  {
    question_text: String, //it will store questions asked by therapist  e.g What do you feel?
    type: String, //type of the answer asked  multiple choice,checkbox,short-answer
    answers: Array, //store the content of answers if its multiple type
    value: String, //answer to question in text
    feedback: String, //feedback given by on doctor to the each answer
    screenshots: Array, //screenshots  of excercise
    assessment: {      //link each question to an assessment
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessments",
      },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("questions", QuestionsSchema);
