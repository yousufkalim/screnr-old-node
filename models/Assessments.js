/**
 * Assessment schema
 * @author Yousuf Kalim
 */
 const mongoose = require("mongoose");
 // Schema
 const AssessmentsSchema = new mongoose.Schema(
   { 
     patients:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patients",
     },
     therapists:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Therapists",
     },
     form_title: String,
     form_description: String,
     sets:Number,
     reps:Number,
     due_date:Date,
     submission_date:Date,
     time_start:Date,
     time_spent:Date,
     note: String,
     type:{
         type: String,
         enum:['simple','motion']
     },
     status:{
         type: String,
       enum:['requested','pending','completed','incomplete','reviwed']
    },
    questions:[
        {
     question_text: String,
     type: String,
     answers:{
       type:Array,
       value: String,
       feedback:String,
       screenshots:Array,
     media_pipe:{
        info:String
     },
    }
   },
  ],
},
   {
     timestamps: true,
   }
 );
 
 // Model
 module.exports = mongoose.model("assessments", AssessmentsSchema);
 