const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post")
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

router.get("/user",async (req, res) => {
  try{
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, "secret")

    if(!claims){
      return res.status(401).send({
        message:  "unauthenticated"
      })
    }

    const user = await User.findOne({_id:claims._id})

    const{password,...data} = await user.toJSON()

    res.send(data)
  } catch (err){
      return res.status(401).send({
        message:  "unauthenticated"
      })
  }
})

router.post("/logout", (req,res) => {
  res.cookie("jwt","", {maxAge: 0})

  res.send(({
    message: "succes"
  }))
})

router.post("/login", async(req, res) => {
  const user = await User.findOne({email: req.body.email})

  if(!user){
    return res.status(404).send({
      message: "User not Found"
    })
  }

  if(user.email != req.body.email){
    return res.status(404).send({
      message: "Email not Found"
    })
  }

  if(!(await bcrypt.compare(req.body.password, user.password))){
    return res.status(400).send({
      message: "Password is Incorrect"
    })
  }

  const token = jwt.sign({_id:user._id}, "secret")

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 3*24*60*60*1000
  })

  res.send({
    message: "succes"
  })
})

router.post("/post", async (req, res) => {
  try{
    const {title, content, imageUrl, userId} = req.body
    const post = new Post({ title, content, user: userId})

    //check if the image exists
    if(imageUrl) post.imageUrl = imageUrl;

    await post.save()

    await User.findByIdAndUpdate(userId, {$push: {posts: post._id}})

    res.status(201).json({
      message: "Post created successfully", post
    })
  }
  catch(error) {
    console.error("Error on creating post: ", error)
    res.status(500).json({
      message: "Internal server error"
    })
  }
})
module.exports = router;
