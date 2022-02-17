/**
 * Assessments  controllers
 * @codeBy Shuja Naqvi
 */
const Patients = require("../models/Patients"); //Accessing Patients
const Therapists = require("../models/Therapists"); //Accessing Therapists
const Assessments = require("../models/Assessments"); //Accessing Assessments
const Questions = require("../models/Questions"); //Accessing Assessments

const {
  encryptQuestionObj,
  encryptArr,
  encrypt,
  decryptQuestionObj,
} = require("../utils/encrypt");

/**
 * Create Assessments
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { patient_id } = req.body;

    const patientID = patient_id;
    const therapistID = req.user._id;

    req.body.patient = patientID;
    req.body.therapist = therapistID; // This is hugh moment.

    let therapist = await Therapists.findById(therapistID); //To chk id os therapist is valid or not
    let patient = await Patients.findById(patientID); //To chk id os patient is valid or not

    if (therapist && patient) {
      if (!patient._doc.doc_id.equals(therapist._doc._id)) {
        res.status(400).json({
          success: false,
          message: "You are not authorized to perform this action.",
        });
      }
      let assessment = await Assessments.create(req.body); //create Assessment
      if (assessment) {
        therapist = await Therapists.findByIdAndUpdate(
          therapistID,
          { $push: { assessments: assessment._id } },
          { new: true } //Assign therapist id of assessment
        );
        patient = await Patients.findByIdAndUpdate(
          patientID,
          { $push: { assessments: assessment._id } },
          { new: true } //Assign therapist id of assessment
        );
        let tests = "";
        if (req.body.questions_array.length != 0) {
          tests = await postQuestions(req, assessment);
        }
        if (tests) {
          return res.status(200).json({
            success: true,
            message: "Assessment Created",
            tests,
          }); //success
        } else {
          res.status(200).json({
            success: true,
            message: "Motion capture request created",
          });
        }
      } else {
        res
          .status(400)
          .json({ success: false, message: "Unable to create Assessment" }); //Failure Somehow
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid Patient or therapist" }); //incase any of id is invalid
    }
  } catch (err) {
    // Error handling
    console.trace("Error ----> ", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const postQuestions = (req, assessment) => {
  return new Promise((resolve, reject) => {
    const lastIndex = req.body.questions_array.length - 1;
    req.body.questions_array.map(async (question, index) => {
      try {
        question.assessment = assessment._id;
        question = encryptQuestionObj(question);
        let questionObj = await Questions.create(question); //at every index there's a new question so we will store each question
        test = await Assessments.findByIdAndUpdate(
          assessment.id,
          { $push: { questions: questionObj._id } },
          { new: true } //Reference of each question with the Assessment
        ).populate("questions");
        if (lastIndex === index) {
          resolve(test);
        }
      } catch (err) {
        reject(err);
      }
    });
  });
};

//Get All Assessment of a user
exports.getAll = async (req, res) => {
  try {
    let userId = req.params.userId;

    const patient = await Assessments.find({ patient: userId })
      .populate("questions")
      .populate("therapist"); //To check wether request by therapist
    const therapist = await Assessments.find({ therapist: userId })
      .populate("questions")
      .populate("patient"); //To check wether request by patient
    if (patient.length > 0) {
      //If request by patient
      res.status(200).json({ success: true, Assessment: patient }); //success
    } else if (therapist.length > 0) {
      //If request by Therapist
      res.status(200).json({ success: true, Assessment: therapist }); //If request by Therapist
    }
    // If no assessments found.
    else res.status(200).json({ success: true, Assessment: [] });
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
    const user = req.user;
    const assessment = await Assessments.findById(assessmentId)
      .populate("questions")
      .populate("patient")
      .populate("therapist"); //finding assessment from db
    const decryptedQuestions = [];
    assessment.questions.forEach((e) => {
      const decryptedQuestion = decryptQuestionObj(e._doc);
      decryptedQuestions.push(decryptedQuestion);
    });
    assessment._doc.questions = decryptedQuestions;
    if (
      user._id == assessment.therapist.id ||
      user._id == assessment.patient.id
    )
      //check if token belongs to the same patient/therapist
      return res.status(200).json({ success: true, assessment });
    //if assessment is found
    else
      return res
        .status(200)
        .json({ success: false, message: "unauthorized Person" }); //otherwise invalidID
  } catch (err) {
    console.log("Error ----> ", err.message); //server error
    res.status(500).json({ success: false, message: "Internal server error" }); //failure Somehow
  }
};
//update Assessment
exports.updateAssessment = async (req, res) => {
  try {
    let data = req.body;
    if (req.body.broken_rules) {
      if (req.body.broken_rules.length != 0) {
        const brokenRules = req.body.broken_rules;
        data["broken_rules"] = brokenRules;
      }
    }
    if (req.body.final_reps) {
      if (req.body.final_reps.length != 0) {
        const finalReps = req.body.final_reps;
        data["final_reps"] = finalReps;
      }
    }

    const assessmentId = req.params.assessmentId; //Getting id from param
    const assessment = await Assessments.findByIdAndUpdate(
      assessmentId,
      data,
      { new: true } //find Assessment and update it
    )
      .populate("questions")
      .populate("patient")
      .populate("therapist");
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
    )
      .populate("questions")
      .populate("patient")
      .populate("therapist");
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
    var test;
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
    const PostAnswers = () => {
      const lastIndex = req.body.answer.length - 1;
      return new Promise((resolve, reject) => {
        try {
          req.body.answer.map(async (answer, index) => {
            const encryptedValueArr = encryptArr(answer.value);
            test = await Questions.findByIdAndUpdate(
              answer.question_id,
              {
                value: encryptedValueArr,
              },
              { new: true }
            );
            if (lastIndex === index) {
              resolve(test);
            }
          });
        } catch (err) {
          reject(err);
        }
      });
    };
    PostAnswers().then(async (tests) => {
      assessment = await Assessments.findByIdAndUpdate(assessmentId, req.body, {
        new: true,
      }).populate("questions"); //update Assessment
      return res.status(200).json({
        success: true,
        message: "Assessment ended",
        Assessments: assessment,
      }); //success
    });
  } catch (err) {
    console.log("Error ----> ", err.message); //server error
    res.status(500).json({ success: false, message: "Internal server error" }); //internal server error
  }
};
//reviewAssessment
exports.reviewAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.assessmentId; //Getting AssessmentID from Params
    var assessment = await Assessments.findById(assessmentId); //find Assessment by its id

    if (req.body.feedbacks.length > 0) {
      const PostAnswers = () => {
        const lastIndex = req.body.feedbacks.length - 1;
        return new Promise((resolve, reject) => {
          try {
            req.body.feedbacks.map(async (feedback, index) => {
              const encryptedFeedback = encrypt(feedback.feedback);
              test = await Questions.findByIdAndUpdate(
                feedback.question_id,
                {
                  feedback: encryptedFeedback,
                },
                { new: true }
              );
              if (lastIndex === index) {
                resolve(test);
              }
            });
          } catch (err) {
            reject(err);
          }
        });
      };
      PostAnswers().then(async (tests) => {
        assessment = await Assessments.findByIdAndUpdate(
          assessmentId,
          req.body,
          {
            new: true,
          }
        ).populate("questions"); //update Assessment
        return res.status(200).json({
          success: true,
          message: "Assessment reviewed",
          Assessments: assessment,
        }); //success
      });
    } else {
      delete req.body.feedbacks;
      assessment = await Assessments.findByIdAndUpdate(assessmentId, req.body, {
        new: true,
      }).populate("questions"); //update Assessment
      return res.status(200).json({
        success: true,
        message: "Assessment reviewed",
        Assessments: assessment,
      }); //success
    }
  } catch (err) {
    console.log("Error ----> ", err.message); //server error
    res.status(500).json({ success: false, message: "Internal server error" }); //internal server error
  }
};
