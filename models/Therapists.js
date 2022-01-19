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
      [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "assessments",
        },
      ],
    avatar: String, //profile_picture
    check_ins: { type: Number, default: 0 },
    dob: Date, //Date of birth
    address: String, //address of doctor
    doc_specialization: String, //This attribute will store doctor's specialization(Neurology or Orthopedics etc)
    last_password_changed: Date, //last time password changed
    phone: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("therapists", TherapistsSchema);
