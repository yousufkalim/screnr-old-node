/**
 * User schema
 * @author Yousuf Kalim
 */
 const mongoose = require("mongoose");
 // Schema
 const PatientsSchema = new mongoose.Schema(
   {
     first_name: {
       type: String,
       required: true,
     },
     middle_name: {
        type: String,
        required: true,
      },
     last_name: {
       type: String,
       required: true,
     },
     national_id:{
        type: String,
        required: true,
     },
     email: {
       type: String,
       required: true,
       unique: true,
       lowercase: true,
     },
     password: {
       type: String,
       required: true,
       minlength: 8,
     },
     gender: {
       type: String,
       enum: ["male", "female", "other"],
     },
     role:{
        type: String,
        enum: ["patient"],
        default:'patient'
      },
     avatar: String,
     dob: Date,
     address: String,
     problem_name: String,
     problem_description: String,
     phone: String,
   },
   {
     timestamps: true,
   }
 );
 
 // Model
 module.exports = mongoose.model("patients", PatientsSchema);
 