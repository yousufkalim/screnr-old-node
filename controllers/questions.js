/**
 * Questions controllers
 * @author Shuja Naqvi
 */
const Assessments = require("../models/Assessments"); //Accessing Assessments
const Questions = require("../models/Questions"); //Accessing Assessments
const { updateAssessment } = require("./assessments");
/**
 * Create
 * @param {object} req
 * @param {object} res
 */
//Delete a Question
exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId; //Getting ID from Params
    var delQuestion = await Questions.findByIdAndDelete(questionId); //find Question from db and delete
    if (delQuestion) {
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
//Therapist's Feedback
exports.feedback = async (req, res) => {
  try {
    var test;
    const PostFeedback = () => {
      let lastindex = req.body.feedbacks.length - 1;
      return new Promise((resolve, reject) => {
        try {
          req.body.feedbacks.map(async (feedback, index) => {
            test = await Questions.findByIdAndUpdate(
              //find question by id
              feedback.question_id,
              { feedback: feedback.feedback }, //add  feedback to each question
              { new: true }
            ).populate("assessment");
            if (index == lastindex) {
              resolve(test);
            }
          });
        } catch (err) {
          reject(err);
          console.log("errr", err.message);
        }
      });
    };
    PostFeedback().then(async (tests) => {
      const updateAssessment = await Assessments.findOneAndUpdate(
        {
          questions: req.body.feedbacks[0].question_id,
        },
        { status: "reviewed" },
        {
          new: true,
        }
      ).populate("questions");
      return res.status(200).json({
        success: true,
        message: "Feedback submitted",
        Assessments: updateAssessment,
      }); //success
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message); //Server error
    res.status(500).json({ success: false, message: "Internal server error" }); //failure...!
  }
};
