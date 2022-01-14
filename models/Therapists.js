/**
 * User schema
 * @author Yousuf Kalim
 */
const mongoose = require("mongoose");
// Schema
const TherapistsSchema = new mongoose.Schema(
  {
    first_name: {
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
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    role:{
      type: String,
      enum: ["therapist"],
      default:'therapist'
    },
    avatar: String,
    dob: Date,
    address: String,
    doc_specailization: String,
    phone: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("therapists", TherapistsSchema);
