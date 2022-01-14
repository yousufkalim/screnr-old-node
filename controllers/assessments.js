/**
 * Assessments  controllers
 * @codeBy Shuja Naqvi
 */
const Patients = require("../models/Patients"); //Accessing Patients
const Therapists = require("../models/Therapists"); //Accessing Therapists
const Assessments = require("../models/Assessments"); //Accessing Assessments

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
        var assessments = { assessment: assessment._id };
        therapists = await Therapists.findByIdAndUpdate(
          therapist,
          { $push: { assessments: assessments } },
          { new: true } //Assign therapist id of assessment
        );
        patients = await Patients.findByIdAndUpdate(
          patient,
          { $push: { assessments: assessments } },
          { new: true } //Assign therapist id of assessment
        );
        res.status(200).json({
          success: true,
          message: "Assessment Created",
          Assessment: assessment._id,
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
    let userID = req.params.userID;
    const patient = await Assessments.find({ patient: userID }); //To check wether request by patient
    const therapist = await Assessments.find({ therapist: userID }); //To check wether request by patient
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
    const assessmentID = req.params.assessmentID; //get assessmentID from params
    const assessment = await Assessments.findById(assessmentID).populate('questions') //finding assessment from db
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
    const assessmentID = req.params.assessmentID; //Getting id from param
    const assessment = await Assessments.findByIdAndUpdate(
      assessmentID,
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
exports.startassessment = async (req, res) => {
  try {
    const assessmentID = req.params.assessmentID; //Getting AssessmentID from Params
    var time = new Date(); //Inorder to set starttime getting date of today
    req.body.time_start = time; //Assign time to a body object
    var assessment = await Assessments.findByIdAndUpdate(
      assessmentID,
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
//endassessment
exports.endassessment = async (req, res) => {
  try {
    const assessmentID = req.params.assessmentID; //Getting AssessmentID from Params
    var assessment = await Assessments.findById(assessmentID); //find Assessment by its id
    var time = new Date(); //find  Date today
    var time_spent = time - assessment.time_start; //calculate time spent on excercise
    var minutes = Math.floor((time_spent / (1000 * 60)) % 60); //convering milliseconds into minutes
    var hours = Math.floor((time_spent / (1000 * 60 * 60)) % 24); //convering milliseconds into hours
    hours = hours < 10 ? "0" + hours : hours; //Formatting so that user can get it easily
    minutes = minutes < 10 ? "0" + minutes : minutes; //Formatting so that user can get it easily
    if (hours > 0) {
      time_spent = hours + " hour" + ":" + minutes + "minutes"; //if excercise take more than an hour
    } else {
      time_spent = minutes + " minutes"; //If excercise take only few minutes
    }
    req.body.time_spent = time_spent; //Assigning time spent to time_spent object
    req.body.submission_date = time;
    assessment = await Assessments.findByIdAndUpdate(assessmentID, req.body, {
      new: true,
    }); //update Assessment
    return res
      .status(200)
      .json({ success: true, message: "Assessment Started", assessment }); //Sending resposne towards Front-end
  } catch (err) {
    console.log("Error ----> ", err.message); //server error
    res.status(500).json({ success: false, message: "Internal server error" }); //internal server error
  }
};
