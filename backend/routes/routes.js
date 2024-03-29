const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    let { firstName, lastName, country, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword;

    const record = await User.findOne({ email: email });

    if (record) {
      return res.status(400).send({
        message: "Email is already registered",
      });
    } else {
      const userData = new User({
        firstName,
        lastName,
        country,
        email,
        password,
      });

      await userData.save();

      const {_id} = await userData.toJSON()
      const token = jwt.sign({_id: _id}, "secret")

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3*24*60*60*1000 //3 days token
      })

      res
        .status(201)
        .json({ message: "User registered successfully", userData });
    }
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
