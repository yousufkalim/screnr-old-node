/**
 * Questions controllers
 * @author Shuja Naqvi
 */
const Assessments = require("../models/Assessments"); //Accessing Assessments
const Questions = require("../models/Questions"); //Accessing Assessments
/**
 * Create
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    var questions;
    for (var i = 0; i < req.body.question.length; i++) {
      //as we have numbers of questions at a time
      questions = await Questions.create(req.body.question[i]); //at every index there's a new question so we will store each question
      const assessment = await Assessments.findByIdAndUpdate(
        req.body.question[0].assessment,
        { $push: { questions: questions.id } } //Reference of each question with the Assessment
      );
    }
    res
      .status(200)
      .json({ success: true, message: "Question created", questions }); //true
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message); //Server error
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Delete a Question
exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId; //Getting ID from Params
    var delQuestion = await Questions.findById(questionId); //find Question from db
    if (delQuestion) {
      delQuestion = await Questions.findByIdAndDelete(questionId); //delete question
      delQuestion = await Assessments.findByIdAndUpdate(
        delQuestion.assessment, //finding question from assessment
        { $pull: { questions: questionId } }, //Pull question from assessment's array of questions
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: "Successfully deleted.." }); //true
    } else
      return res.status(404).json({ success: false, message: "Invalid ID" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message); //Server error
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Answer to a question
exports.answer = async (req, res) => {
  try {
    var answers;
    for (var i = 0; i < req.body.answer.length; i++) {
      //as we have numbers of questions
      answers = await Questions.findByIdAndUpdate(
        req.body.answer[i].question_id, //find question with id and add answer into it
        { value: req.body.answer[i].value }, //Add answer
        { new: true }
      );
    }
    res.status(200).json({ success: true, answers }); //success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message); //Server error
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Therapist's Feedback
exports.feedback = async (req, res) => {
  try {
    var feedbacks;
    for (var i = 0; i < req.body.feedbacks.length; i++) {
      //feedbacks
      answers = await Questions.findByIdAndUpdate(
        //find question by id
        req.body.feedbacks[i].question_id,
        { feedback: req.body.feedbacks[i].feedback }, //add  feedback to each question
        { new: true }
      );
    }
    res.status(200).json({ success: true, answers }); //success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message); //Server error
    res.status(500).json({ success: false, message: "Internal server error" }); //failure...!
  }
};
