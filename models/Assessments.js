/**
 * Assessment schema
 *  @author Shuja Naqvi
 */
const mongoose = require("mongoose");

const AssessmentsSchema = new mongoose.Schema(
  {
    patient: {
      //id of the patient to whom this  is assigned
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patients", //Reference to the model of patient
    },
    therapist: {
      //id of the Therapist who is taking this assessment
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapists", //Reference to the model of Therapist
    },
    type: {
      //type of assessment
      type: String,
      enum: ["simple", "motion"],
    },
    status: {
      //status of assessment
      type: String,
      enum: ["requested", "accepted","started" ,"submitted",  "reviwed"],
      default:'requested'
    },
    form_title: String, //Title of the Assessment
    form_description: String, //Patient will elobrate his/her problem and will request the doctor to accept assessment request
    sets: Number, //sets for excercise assigned by Therapist
    reps: Number, //reps for excercise assigned by Therapist
    due_date: Date, //deadline to submit assessment
    submission_date: Date, //date of assessment submission
    time_start: Date, //time when assessment started
    time_spent: String, //total time taken by patient to complete assessment
    note: String, //note  from Therapist after reviewing excercise
    questions:
      //This will store ids of all the questions taken by a Therapist
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "questions",
      },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("assessments", AssessmentsSchema);
