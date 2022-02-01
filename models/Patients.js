/**
 * Patient's Schema schema
 * @author Shuja Naqvi
 *
 */
const mongoose = require("mongoose");
// Schema
const PatientsSchema = new mongoose.Schema(
  {
    patient_id: {
      type: Number,
      required: true,
      unique: true,
    },
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
    // gender: {
    //   type: String,
    //   enum: ["male", "female", "other"],
    // }, // This has been gotten ride of.
    role: {
      type: String,
      enum: ["patient"],
      default: "patient",
    },
    last_password_changed: Date,
    check_ins: { type: Number, default: 0 }, //Total times login
    assessments:
      //This will store ids of all the assessments assigned to a patient
      [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "assessments",
        },
      ],
    avatar: String, //profile_picture of user
    dob: Date, //Date of birth
    address: String, //address of patient
    problem_name: String, //Patient's problem (chest-pain,back-pain etc)
    problem_description: String, //Patient's will elborate his problem
    phone: String,
  },
  {
    timestamps: true,
  }
);
// Model
module.exports = mongoose.model("patients", PatientsSchema);
