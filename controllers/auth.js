/**
 * User auth controllers
 * @author Yousuf Kalim
 */
const Therapists = require("../models/Therapists");
const Patients = require("../models/Patients");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.JWT_SECRET;

/**
 * Login
 * @param {object} req
 * @param {object} res
 */
exports.login = async (req, res) => {
  try {
    // Getting email and password
    const { email, password } = req.body;
    console.log(req.body,"REQ")
    // Getting user from db
    const therapist = await Therapists.findOne({ email });
    const patients = await Patients.findOne({ email });
    if(therapist!=null){
     // Comparing password
    const isMatched = bcrypt.compareSync(password, therapist.password);
    if (!isMatched) {
      // If password not matched
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }
    // Creating payload with user object
    const payload = { therapist };
    console.log(payload,"PAYLOAD")
    // Generating token
    jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      // done
      res.json({ success: true, therapist, token });
    });
  }
  else if(patients!=null){
    const isMatched = bcrypt.compareSync(password, patients.password);
    if (!isMatched) {
      // If password not matched
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }
    // Creating payload with user object
    const payload = { patients };
    // Generating token
    jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      // done
      res.json({ success: true, patients, token });
    });
  }
  else{
    res.status(500).json({ success: false, message: "Invalid User"});
  } 
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Change Password
 * @param {object} req
 * @param {object} res
 */
exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are not same",
      });
    }

    let therapists = await Therapists.findById(userId);
    let patients = await Patients.findById(userId);
     if(therapists!=null){
     const isMatched = bcrypt.compareSync(oldPassword, therapists.password);
     if (!isMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid old Password" });
    }
    // Generate token
    therapists.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt));
    await therapists.save();
    res.json({ success: true, therapists });
  }
  else if(patients){
    const isMatched = bcrypt.compareSync(oldPassword, patients.password);
    if (!isMatched) {
     return res
       .status(400)
       .json({ success: false, message: "Invalid old Password" });
   }
   // Generate token
   therapists.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt));
   await therapists.save();
   res.json({ success: true, patients });
  }
  else {
    return res
      .status(404)
      .json({ success: false, message: "User not found" });
  }
 } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Forgot password
 * @param {object} req
 * @param {object} res
 */
exports.forgot = async (req, res) => {
  try {
    let { email } = req.params;
    let therapists = await Therapists.findOne({ email });
    let patients = await Patients.findOne({ email });
    if(therapists){
      let randomPassword = Math.random().toString(36).slice(-8);
      // Sending email to user
      sendEmail(email, randomPassword)
        .then(async () => {
          // If email is sent then we have to update the password in db
          therapists.password = await bcrypt.hash(randomPassword, parseInt(bcryptSalt));
          await therapists.save();
          // Done
          res.json({ success: true, message: "Email sent successfully" });
        })
        .catch((err) => {
          // Error handling
          console.log("Error ----> ", err);
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        });
    }
    else if(patients){
      let randomPassword = Math.random().toString(36).slice(-8);
      // Sending email to user
      sendEmail(email, randomPassword)
        .then(async () => {
          // If email is sent then we have to update the password in db
          patients.password = await bcrypt.hash(randomPassword, parseInt(bcryptSalt));
          await patients.save();
          // Done
          res.json({ success: true, message: "Email sent successfully" });
        })
        .catch((err) => {
          // Error handling
          console.log("Error ----> ", err);
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        });
    }
    else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Confirm auth
 * @param {object} req
 * @param {object} res
 */
exports.confirmAuth = async (req, res) => {
  // If user authenticated
  res.json({ success: true, user: req.user });
};
