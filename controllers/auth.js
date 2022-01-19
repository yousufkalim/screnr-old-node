/**
 * User auth controllers
 * @author Shuja Naqvi
 */
const Therapists = require("../models/Therapists"); //Accessing Therapists schema
const Patients = require("../models/Patients"); //Accessing Patient schema
const bcrypt = require("bcryptjs"); //Hash Password
const jwt = require("jsonwebtoken"); //Validate JWT
const { sendEmail } = require("../utils/sendEmail"); //importing to sendEmail to users
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
    // Getting users from db
    //As we have same login so checking all models :(
    const therapist = await Therapists.findOne({ email }); //chk if request by therapist
    const patients = await Patients.findOne({ email }); //chk if request by patients
    if (therapist != null) {
      //if request by therapist
      // Comparing password
      const isMatched = bcrypt.compareSync(password, therapist.password); //chk if password is correct
      if (!isMatched) {
        // If password not matched
        return res
          .status(400)
          .json({ success: false, message: "Invalid Password" });
      }
      // Creating payload with therapist object
      const payload = { therapist };
      // Generating token
      jwt.sign(
        payload,
        tokenSecret,
        { expiresIn: 360000 },
        async (err, token) => {
          if (err) throw err;
          // done
          const increment = 1;
          // var check_in=+therapist.check_ins + +increment
          therapist.check_ins = therapist.check_ins + increment;
          await therapist.save();
          return res.json({ success: true, therapist, token });
        }
      );
    } else if (patients != null) {
      //if request by Patient
      const isMatched = bcrypt.compareSync(password, patients.password); //chk if password is correct
      if (!isMatched) {
        // If password not matched
        return res
          .status(400)
          .json({ success: false, message: "Invalid Password" });
      }
      // Creating payload with patients object
      const payload = { patients };
      // Generating token
      jwt.sign(
        payload,
        tokenSecret,
        { expiresIn: 360000 },
        async (err, token) => {
          if (err) throw err;
          // done
          const increment = 1;
          patients.check_ins = patients.check_ins + increment;
          await patients.save();
          return res.status(200).json({ success: true, patients, token }); //return patient with token
        }
      );
    } else {
      //If email is not valid
      res.status(500).json({ success: false, message: "Invalid User" }); //email not found
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message); //Server error
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
    let therapists = await Therapists.findById(userId); //To chk if request by therapist
    let patients = await Patients.findById(userId); //To chk if request by patients
    if (therapists != null) {
      //Request by Therapist
      const isMatched = bcrypt.compareSync(oldPassword, therapists.password);
      if (!isMatched) {
        //if password is invalid
        return res
          .status(400)
          .json({ success: false, message: "Invalid old Password" }); //password is invalid
      }
      therapists.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt)); //if password matched then update pswd
      therapists.last_password_changed = new Date();
      await therapists.save(); //update password
      res.json({ success: true, therapists }); //true
    } else if (patients) {
      //Request by Patient
      const isMatched = bcrypt.compareSync(oldPassword, patients.password);
      if (!isMatched) {
        //to chk if password is invalid
        return res
          .status(400)
          .json({ success: false, message: "Invalid old Password" }); //password is invalid
      }
      patients.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt)); //update password of patient
      patients.last_password_changed = new Date();
      await patients.save();
      res.json({ success: true, patients }); //successfully updated...!
    } else {
      //if email not found
      return res
        .status(404)
        .json({ success: false, message: "User not found" }); //invalid criteria
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message); //Server Error
    res.status(500).json({ success: false, message: "Internal server error" }); //server error
  }
};
/**
 * Forgot password
 * @param {object} req
 * @param {object} res
 */
exports.forgot = async (req, res) => {
  try {
    let { email } = req.params; //user's email
    let therapists = await Therapists.findOne({ email }); //to chk request by therapist
    let patients = await Patients.findOne({ email }); //to chk request by therapist
    if (therapists) {
      //if user is therapist
      let randomPassword = Math.random().toString(36).slice(-8); //generate random pswd
      sendEmail(email, randomPassword) // Sending email to therapist
        .then(async () => {
          // If email is sent then we have to update the password in db
          therapists.password = await bcrypt.hash(
            randomPassword,
            parseInt(bcryptSalt)
          );
          therapists.last_password_changed = new Date();
          await therapists.save(); //save updated pswd
          // Done
          res.json({ success: true, message: "Email sent successfully" });
        });
    } else if (patients) {
      //if user is patients
      let randomPassword = Math.random().toString(36).slice(-8); //generate random pswd
      sendEmail(email, randomPassword) //send email to patient with pswd
        .then(async () => {
          // If email is sent then we have to update the password in db
          patients.password = await bcrypt.hash(
            randomPassword,
            parseInt(bcryptSalt)
          );
          patients.last_password_changed = new Date();
          await patients.save(); //save patients pswd
          // Done
          res.json({ success: true, message: "Email sent successfully" }); //email sent
        });
    } else {
      //if email is invalid
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
  // If user authenticated(validate user's token)
  return res.json({ success: true, user: req.user });
};
