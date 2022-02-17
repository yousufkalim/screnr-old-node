/**
 * ExistingQuestions schema
 * @codeBy Umar Bin Ayaz
 */
const mongoose = require("mongoose");

const ExistingQuestionsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    }, // it will store questions asked by therapist  e.g What do you feel?
    description: {
      type: String
    }, //question description
    type: {
      type: String,
      enum: ["text", "mcqs", "checkboxes"],
      required: true
    }, //type of the question asked
    answers: {
      type: [String], //store the content of answers if its multiple type
    }
  },
  {
    timestamps: true,
  }
);
 
 // Model
 module.exports = mongoose.model("existing_questions", ExistingQuestionsSchema);
 