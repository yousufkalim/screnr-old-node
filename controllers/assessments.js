/**
 * Assessments  controllers
 * @codeBy Shuja Naqvi
 */
const Patients = require("../models/Patients"); //Accessing Patients
const Therapists = require("../models/Therapists"); //Accessing Therapists
const Assessments = require("../models/Assessments"); //Accessing Assessments
const Questions = require("../models/Questions"); //Accessing Assessments

/**
 * Create Assessments
 * @param {object} req
 * @param {object} res
 */

exports.create = async (req, res) => {
  try {
    let { patient, therapist } = req.body;
    var therapists = await Therapists.findById(therapist); //To chk id os therapist is valid or not
    var patients = await Patients.findById(patient); //To chk id os patient is valid or not
    if (therapists && patients) {
      const assessment = await Assessments.create(req.body); //create Assessment
      if (assessment) {
        therapists = await Therapists.findByIdAndUpdate(
          therapist,
          { $push: { assessments: assessment._id } },
          { new: true } //Assign therapist id of assessment
        );
        patients = await Patients.findByIdAndUpdate(
          patient,
          { $push: { assessments: assessment._id } },
          { new: true } //Assign therapist id of assessment
        );
        for (var i = 0; i < req.body.question.length; i++) {
          //as we have numbers of questions at a time
          req.body.question[i].assessment = assessment._id;
          var questions = await Questions.create(req.body.question[i]); //at every index there's a new question so we will store each question
          const test = await Assessments.findByIdAndUpdate(
            assessment._id,
            { $push: { questions: questions.id } } //Reference of each question with the Assessment
          );
        }
        res.status(200).json({
          success: true,
          message: "Assessment Created",
          Assessment: assessment,
          Therapist_Assessment: therapists.assessments,
          Patient_Assessment: patients.assessments,
        }); //success
      } else
        res
          .status(400)
          .json({ success: false, message: "Unable to create Assessment" }); //Failure Somehow
    } else
      res
        .status(400)
        .json({ success: false, message: "Invalid Patient or therapist" }); //incase any of id is invalid
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Get All Assessment of a user
exports.getAll = async (req, res) => {
  try {
    let userId = req.params.userId;
    const patient = await Assessments.find({ patient: userId }); //To check wether request by patient
    const therapist = await Assessments.find({ therapist: userId }); //To check wether request by patient
    if (patient.length > 0) {
      //If request by patient
      res.status(200).json({ success: true, Assessment: patient }); //success
    } else if (therapist.length > 0) {
      //If request by Therapist
      res.status(200).json({ success: true, Assessment: therapist }); //If request by Therapist
    } else
      res
        .status(400)
        .json({ success: false, message: "Invalid Patient or therapist" }); //incase any of id is invalid
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Get Assessment by ID
exports.getAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.assessmentId; //get assessmentID from params
    const assessment = await Assessments.findById(assessmentId).populate(
      "questions"
    ); //finding assessment from db
    if (assessment) res.status(200).json({ success: true, assessment });
    //if assessment is found
    else res.status(200).json({ success: false, message: "Invalid ID" }); //otherwise invalidID
  } catch (err) {
    console.log("Error ----> ", err.message); //server error
    res.status(500).json({ success: false, message: "Internal server error" }); //failure Somehow
  }
};
//update Assessment
exports.updateAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.assessmentId; //Getting id from param
    const assessment = await Assessments.findByIdAndUpdate(
      assessmentId,
      req.body,
      { new: true } //find Assessment and update it
    );
    if (assessment) res.status(200).json({ success: true, assessment });
    //if data updated Successfully...!
    else res.status(200).json({ success: true, message: "Invalid ID" }); //if id is invalid....!
  } catch (err) {
    console.log("Error ----> ", err.message); //server error
    res.status(500).json({ success: false, message: "Internal server error" }); //failure Somehow
  }
};
//start Assessment
exports.startAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.assessmentId; //Getting AssessmentID from Params
    var time = new Date(); //inOrder to set start time getting date of today
    req.body.time_start = time; //Assign time to a body object
    var assessment = await Assessments.findByIdAndUpdate(
      assessmentId,
      req.body, //Storing start time of assessment with started status
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Assessment Started", assessment }); //Success
  } catch (err) {
    console.log("Error ----> ", err.message); //server error
    res.status(500).json({ success: false, message: "Internal server error" }); //Failure... :(
  }
};
//endAssessment
exports.endAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.assessmentId; //Getting AssessmentID from Params
    var assessment = await Assessments.findById(assessmentId); //find Assessment by its id
    var time = new Date(); //find  Date today
    var time_spent = time - assessment.time_start; //calculate time spent on exercise
    var minutes = Math.floor((time_spent / (1000 * 60)) % 60); //converting milliseconds into minutes
    var hours = Math.floor((time_spent / (1000 * 60 * 60)) % 24); //converting milliseconds into hours
    hours = hours < 10 ? "0" + hours : hours; //Formatting so that user can get it easily
    minutes = minutes < 10 ? "0" + minutes : minutes; //Formatting so that user can get it easily
    if (hours > 0) {
      time_spent = hours + " hour" + ":" + minutes + "minutes"; //if exercise take more than an hour
    } else {
      time_spent = minutes + " minutes"; //If exercise take only few minutes
    }
    req.body.time_spent = time_spent; //Assigning time spent to time_spent object
    req.body.submission_date = time;
    assessment = await Assessments.findByIdAndUpdate(assessmentId, req.body, {
      new: true,
    }); //update Assessment
    return res
      .status(200)
      .json({ success: true, message: "Assessment Started", assessment }); //Sending response towards Front-end
  } catch (err) {
    console.log("Error ----> ", err.message); //server error
    res.status(500).json({ success: false, message: "Internal server error" }); //internal server error
  }
};
