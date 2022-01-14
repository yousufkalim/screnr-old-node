/**
 * User Therapist controllers
 * @author Shuja Naqvi
 */
const Therapists = require("../models/Therapists"); //Accessing model
const Patients = require("../models/Patients"); //Accessing model
const bcrypt = require("bcryptjs"); //npm module to encrypt password
const bcryptSalt = process.env.BCRYPT_SALT || 10;

/**
 * Create Therapist - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
     let { email, password, confirmPassword } = req.body; // Getting required fields from body
    if (password !== confirmPassword) {
      // Passwords not same
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password are not the same.",
      });
    }
    const existingTherapist = await Therapists.findOne({ email }); // Finding already existing Therapist
    const existingPatient = await Patients.findOne({ email }); // Finding already existing Patients
    if (existingTherapist || existingPatient) {
      // If we found existing patient / therapist as email should be unique for every role
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    } 
    // Getting url of the image
    if (req.file) {
      req.body.avatar = req.file.path; // Creating a new property called avatar in body object
    }
    // Creating User
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
    const user = await Therapists.create(req.body); // Adding user in db
    // Done
    res.json({ success: true, user }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Get all therapist
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const users = await Therapists.find(); // Finding all the therapists from db
    if (users.length > 0) return res.json({ success: true, Therapist: users });
    // Success
    else  res.json({ success: true, message: "No therapist foud" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err); //console error
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Get user by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const therapistId= req.params.therapistId; // Getting user id from URL parameter
    const user = await Therapists.findById(therapistId); // Finding user by id
    if (user) return res.status(200).json({ success: true, therapist: user });
    // Success
    else res.status(400).json({ success: false, message: "Invalid ID" });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Update user
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    if (req.file) {
      req.body.avatar = req.file.path; // Creating a new property called photo in body object
    }
    const user = await Therapists.findByIdAndUpdate(userId, req.body, {
      new: true,
    }); // Updating the user
    if (user) return res.status(200).json({ success: true, user });
    // Success
    else res.status(400).json({ success: false, message: "Unable to update" }); //failure
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Delete Therapist
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const therapistID = req.params.therapistID; // Getting therapist id from URL parameter
    const user = await Therapists.findByIdAndDelete(therapistID); // Deleting the Therapist
    if (user) return res.json({ success: true, user });
    // Success
    else res.json({ success: false, message: "Invalid ID" }); //failure
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
