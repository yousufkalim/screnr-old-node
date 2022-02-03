/**
 * ExistingQuestions schema
 * @codeBy Umar Bin Ayaz
 */
const mongoose = require("mongoose");

const ExistingQuestionsSchema = new mongoose.Schema(
{
    text: {
        type: String,
        required: true
    }, // This will store the contents of already existing questions
   },
   {
        timestamps: true,
   }
);
 
 // Model
 module.exports = mongoose.model("existing_questions", ExistingQuestionsSchema);
 