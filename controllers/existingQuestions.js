/**
 * Assessments  controllers
 * @codeBy Umar Bin Ayaz
 */
 const Patients = require("../models/Patients"); //Accessing Patients
 const Therapists = require("../models/Therapists"); //Accessing Therapists
 const ExistingQuestions = require("../models/ExistingQuestions"); //Accessing Assessments
 
 /**
  * Create Assessments
  * @param {object} req
  * @param {object} res
  */
 exports.create = async (req, res) => {
   try {
    let existingQuestio;

    existingQuestion = await ExistingQuestions.findOne(req.body); //get aleady existingQuestion

    if(!existingQuestion){
        existingQuestion = await ExistingQuestions.create(req.body); //create existingQuestion
    } else {
        return res.status(200).json({
            success: true,
            message: "Question already exists.",
            data: existingQuestion._doc,
        }); // Success
    }

    if (existingQuestion) {
        return res.status(200).json({
            success: true,
            message: "Question Created.",
            data: existingQuestion._doc,
        }); // Success
    } else {
        res.status(400).json({ success: false, message: "Could not create question successfully." });
    }
   } catch (err) {
     // Error handling
     console.trace("Error ----> ", err.message);
     res.status(500).json({ success: false, message: "Internal server error" });
   }
 };
 
 //Get All Assessment of a user
 exports.getFromQuery = async (req, res) => {
   try {
    const { query } = req.body;
    const existingQuestions = await ExistingQuestions.find({
        title: {
            "$regex": query
        }
    });
    res.status(200).json({ success: true, data: existingQuestions ?? [] }); //success
   } catch (err) {
     // Error handling
     console.trace("Error ----> ", err.message);
     res.status(500).json({ success: false, message: "Internal server error" });
   }
 };
 
 // Get ExistingQuestion by ID
 exports.getExistingQuestion = async (req, res) => {
   try {
    const { id } = req.body;
    let existingQuestion = await ExistingQuestions.findById(id); //create existingQuestion
    if (existingQuestion) {
        return res.status(200).json({
            success: true,
            existingQuestion,
        }); // Success
    } else {
        res.status(400).json({ success: false, message: "Invalid ID" });
    }
   } catch (err) {
     console.log("Error ----> ", err.message); //server error
     res.status(500).json({ success: false, message: "Internal server error" }); //failure Somehow
   }
 };

 //update ExistingQuestion
 exports.updateExistingQuestion = async (req, res) => {
   try {
     const questionId = req.params.questionId; //Getting id from param
     const existingQuestion = await ExistingQuestions.findByIdAndUpdate(
       questionId,
       req.body,
       { new: true } //find ExistingQuestion and update it
     )
     if (existingQuestion) res.status(200).json({ success: true, data: existingQuestion });
     //if data updated Successfully...!
     else res.status(200).json({ success: true, message: "Invalid ID" }); //if id is invalid....!
   } catch (err) {
     console.log("Error ----> ", err.message); //server error
     res.status(500).json({ success: false, message: "Internal server error" }); //failure Somehow
   }
 };

 //update ExistingQuestion
 exports.deteExistingQuestion = async (req, res) => {
    try {
      const questionId = req.params.questionId; //Getting id from param
      const existingQuestion = await ExistingQuestions.deleteOne(
        {_id: questionId}
      )
      if (existingQuestion) res.status(200).json({ success: true, message: "Question deleted successfully." });
      //if data updated Successfully...!
      else res.status(200).json({ success: true, message: "Invalid ID" }); //if id is invalid....!
    } catch (err) {
      console.log("Error ----> ", err.message); //server error
      res.status(500).json({ success: false, message: "Internal server error" }); //failure Somehow
    }
  };

 