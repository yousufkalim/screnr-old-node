/**
 * Therapists schema
 * @codeBy Shuja Naqvi
 */
const mongoose = require("mongoose");

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
    role: {
      type: String,
      enum: ["therapist"],
      default: "therapist",
    },
    assessments:
      //This will store ids of all the assessments taken by a Therapist
      {
        assessment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Assessments",
        },
      },
    avatar: String, //profile_picture
    dob: Date, //Date of birth
    address: String, //address of doctor
    doc_specailization: String, //This attribute will store doctor's specialization(Neurology or Orthopedicsetc)
    phone: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("therapists", TherapistsSchema);
