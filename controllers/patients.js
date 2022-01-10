/**
 * User CRUD controllers
 * @author Yousuf Kalim
 */
 const Patients = require("../models/Patients");
 const Therapists = require("../models/Therapists");
 const bcrypt = require("bcryptjs");
 const bcryptSalt = process.env.BCRYPT_SALT || 10;
 
 /**
  * Create User - Signup
  * @param {object} req
  * @param {object} res
  */
 exports.create = async (req, res) => {
   try {
     let { email, password} = req.body; // Getting required fields from body
     const existingUser = await Patients.findOne({ email }); // Finding already existing user
 
     // Extra Validations
     if (existingUser) {
       // If we found existing user in db
       return res
         .status(409)
         .json({ success: false, message: "User already exists." });
     } 
 
     // Getting url of the image
     if (req.file) {
       req.body.avatar = req.file.path; // Creating a new property called photo in body object
     }
 
     // Creating User
     req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
     req.body.role='patient'
     const user = await Patients.create(req.body); // Adding user in db
 
     // Done
     res.json({ success: true, user }); //Success
   } catch (err) {
     // Error handling
     console.log("Error ----> ", err);
     res.status(500).json({ success: false, message: "Internal server error" });
   }
 };
 
 /**
  * Get all users
  * @param {object} req
  * @param {object} res
  */
 exports.getAll = async (req, res) => {
   try {
     const users = await Patients.find(); // Finding all the users from db
     res.json({ success: true, users }); // Success
   } catch (err) {
     // Error handling
     console.log("Error ----> ", err);
     res.status(500).json({ success: false, message: "Internal server error" });
   }
 };
 
 exports.getTherapists = async (req, res) => {
   try {
     const therapists = await Therapists.find() // Finding all the users from db
     res.json({ success: true, therapists }); // Success
   } catch (err) {
     // Error handling
     console.log("Error ----> ", err);
     res.status(500).json({ success: false, message: "Internal server error",err:err.message });
   }
 };
 
 /**
  * Get user by id
  * @param {object} req
  * @param {object} res
  */
 exports.getById = async (req, res) => {
   try {
     const userId = req.params.userId; // Getting user id from URL parameter
     const user = await Patients.findById(userId); // Finding user by id
     if (user) res.status(200).json({ success: true, therapist:user }); // Success
     else res.status(400).json({ success: false, message:"Invalid ID" });
 
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
     const user = await Patients.findByIdAndUpdate(userId, req.body, { new: true }); // Updating the user
     if(user) res.status(200).json({ success: true, user }); // Success
     else res.status(400).json({})
   } catch (err) {
     // Error handling
     console.log("Error ----> ", err);
     res.status(500).json({ success: false, message: "Internal server error" });
   }
 };
 
 /**
  * Delete user
  * @param {object} req
  * @param {object} res
  */
 exports.delete = async (req, res) => {
   try {
     const userId = req.params.userId; // Getting user id from URL parameter
     const user = await Patients.findByIdAndDelete(userId); // Deleting the user
     res.json({ success: true, user }); // Success
   } catch (err) {
     // Error handling
     console.log("Error ----> ", err);
     res.status(500).json({ success: false, message: "Internal server error" });
   }
 };
 