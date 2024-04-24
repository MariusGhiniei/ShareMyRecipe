const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtToken = ''

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
    const token = req.cookies.jwt

    if(!token){
      return res.status(401).json({ message: "Unauthorized token" })
    }
    res.cookie('token',req.cookies.jwt, {
      httpOnly: true,
       maxAge: 3*24*60*60*1000
    })
    const decryptToken = await jwt.verify(token, "secret")

    if(!decryptToken){
      return res.status(401).json({ message: "Unauthorized decrypted" });
    }

    //jwt token its valid

    const user = await User.findOne({ _id: decryptToken._id})
    
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userData} = user.toObject()
    res.status(200).json(userData)
  }
  catch(err){
    console.error(err)
    res.status(500).json({
      message : "Interval server error"
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
    const token = req.cookies.jwt
    if(!token){
      return res.status(401).json({
        message : "Unauthorized"
      })
    }

    const decryptedToken = jwt.verify(token, "secret")
    const userId = decryptedToken._id

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {title, content, imageUrl} = req.body
    const post = new Post({ title, content, user: userId})

    //check if the image exists
    if(imageUrl) post.imageUrl = imageUrl;
    console.log(imageUrl);

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

const checkImage = async (url) => {
  try {
    const res = await fetch(url);
    const buff = await res.blob();
    return url
  } catch (error) {
    console.error('Error checking image:', error);
    return false;
  }
};

router.get("/getPosts", async(req, res)=>{
  try {
    const posts = await Post.find().populate({
      path: 'user',
      select: '-password'
    }).exec()

    if(!posts || posts.length === 0){
      return res.status(404).json({ message: "No posts found" })
    }

    

    const formatPosts = posts.map(post => ({
      title : post.title,
      content : post.content,
      imageUrl : post.imageUrl,
      firstName : post.user.firstName,
      lastName : post.user.lastName,
      country : post.user.country
    }))

    res.status(200).json(formatPosts)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" })
  }
})
module.exports = router;
