/**
 * Questions schema
 * @codeBy Shuja Naqvi
 */
const mongoose = require("mongoose");

const QuestionsSchema = new mongoose.Schema(
  {
    title: String, //it will store questions asked by therapist  e.g What do you feel?
    description: String, //question description
    type: {
      type: String,
      enum: ["text", "mcqs", "checkboxes"],
    }, //type of the question asked
    answers: [String], //store the content of answers if its multiple type
    value: String, //answer to question in text
    feedback: String, //feedback given by on doctor to the each answer
    screenshots: [String], //screenshots  of exercise
    assessment: {
      //link each question to an assessment
      type: mongoose.Schema.Types.ObjectId,
      ref: "assessments",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("questions", QuestionsSchema);
