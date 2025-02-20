const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    var success = false;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
     
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "sorry a user with this email already exists" });
      }
     
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt)
      
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id
        }
      }
      const JWT_SECRET = "helloiamsecret"
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured")
    }
  }
);
router.post(
  "/login",
  [
    body("email", 'Enter a valid email').isEmail(),
    body("password", 'Password cannot be blank').exists(),
  ],
  async (req, res) => {
    var success = false;
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const { email, password } = req.body;
     try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error: "Please try to login with correct credentials"});
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        success: false;
        return res.status(400).json({success, error: "Please try to login with correct credentials"});
      }
      const data = {
        user: {
          id: user.id
        }
      }
      const JWT_SECRET = "helloiamsecret";
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken});

     } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error")
     }
  });
  router.post( "/getuser", fetchuser, async (req, res) => {

      try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
      }
    });      


module.exports = router;
