/**
 * Assessments CRUD controllers
 * @author Yousuf Kalim
 * @codeBy Shuja Naqvi
 */
 const Patients = require("../models/Patients");
 const Therapists = require("../models/Therapists");
 const Assessments = require("../models/Assessments");
 const bcrypt = require("bcryptjs");
 const bcryptSalt = process.env.BCRYPT_SALT || 10;
 
 /**
  * Create User - Signup
  * @param {object} req
  * @param {object} res
  */
 exports.create = async (req, res) => {
   try {
     
   } catch (err) {
     // Error handling
     console.log("Error ----> ", err.message);
     res.status(500).json({ success: false, message: "Internal server error" });
   }
 };