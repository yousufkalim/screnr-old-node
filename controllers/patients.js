/**
 * Patient  controllers
 * @codeBy Shuja Naqvi
 */
const Patients = require("../models/Patients"); //Accessing Patient Schema
const Therapists = require("../models/Therapists"); //Accessing Therapist Schema
const Assessments = require("../models/Assessments");
const bcrypt = require("bcryptjs"); //encrypt password
const bcryptSalt = process.env.BCRYPT_SALT || 10;

/**
 * Create Patient - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { email, password } = req.body; // Getting required fields from body
    //Assign id to a patient
    const existingPatient = await Patients.findOne({ email }); // Finding already existing in Patient in db
    const existingTherapist = await Therapists.findOne({ email }); // Finding already existing in therapist in db
    if (existingPatient || existingTherapist) {
      // If we found existing user in db
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    }
    // Getting url of the image
    if (req.file) {
      req.body.avatar = req.file.path; // Creating a new property called avatar in body object
    }
    const patientCount = await Patients.find().sort({ $natural: -1 }).limit(1);
    if (patientCount < 1) {
      req.body.patient_id = 1;
    }
    if (patientCount > 0) {
      const increment = 1;
      req.body.patient_id = +patientCount[0].patient_id + +increment;
    }
    // // Creating User
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
    const user = await Patients.create(req.body); // Adding patient in db
    // Done
    res.json({ success: true, user }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all Patients
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const users = await Patients.find().populate("assessments"); // Finding all the users from db

    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message); //server err
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get Patient by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const patientId = req.params.patientId; // Getting user id from URL parameter
    const patient = await Patients.findById(patientId).populate("assessments"); // Finding user by id
    if (patient) return res.status(200).json({ success: true, patient });
    // Success
    else res.status(400).json({ success: false, message: "Invalid ID" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Update Patient
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const patientId = req.user._id; // Getting user id from URL parameter
    if (req.file) {
      req.body.avatar = req.file.path; // Creating a new property called avatar in body object
    }
    const user = await Patients.findByIdAndUpdate(patientId, req.body, {
      new: true,
    }).populate("assessments"); // Updating the Patient
    if (user) res.status(200).json({ success: true, user });
    // Success
    else res.status(400).json({ success: false, message: "No Patient Found" }); //failure
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message); //server Error
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete patient
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const patientId = req.params.patientId; // Getting Patient id from URL parameter
    const user = await Patients.findByIdAndDelete(patientId); // Deleting the Patient
    if (user) res.status(200).json({ success: true, user });
    // Success
    else res.status(400).json({ success: false, message: "User Not Found" }); //failure
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err); //server error
    res.status(500).json({ success: false, message: "Internal server error" }); //internal server error
  }
};
