let express = require("express");
let userRouter = express.Router();
const bcrypt = require('bcrypt');
let mongoose= require("mongoose")
var jwt = require('jsonwebtoken');
let { Usermodel } = require("../models/models.js");
const quizmiddle = require("../middleware/middleware.js");
let nodemail= require("nodemailer")
let quizrouter = express.Router();
let questionrouter = express.Router();


userRouter.post("/signup", async (req, res) => {
  let { email, password,role } = req.body;
  let myPlaintextPassword = password;
let exituser= await  Usermodel.findOne({email});
if(exituser) return res.status(400).json({ message: 'User already registered with this email.' });
  
  const saltRounds = 10;

  bcrypt.hash(myPlaintextPassword, saltRounds, async function (err, hash) {
    if (err) {
      
      return res.status(500).json({ message: "Hashing failed", error: err.message });
    } else {
      let newuser = new Usermodel({ email, password: hash,role});
      console.log(newuser)
      await newuser.save();
      res.json({ message: "success" ,user:newuser});
    }
  });
});


userRouter.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let myPlaintextPassword = password;
    let user = await Usermodel.findOne({email});

    if (!user) {
      return res.json({ message: "user not found" }); 
    } else {
      let hash = user.password;

      bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
        if (err) {
          res.status(500).json({ message: "error occurred", error: err.message });
        } else {
          if (result) {
            var accesstoken = jwt.sign({ userId: user._id, role: user.role }, 'shhhhh', { expiresIn: 300 });
            var refreshtoken = jwt.sign({ userId: user._id, role: user.role }, 'shhhhh', { expiresIn: "7d" });
            res.json({ message: "login success", accesstoken, refreshtoken,role:user.role});
          } else {
            res.json({ message: "wrong password" });
          }
        }
      });
    }
  } catch (e) {
    res.json({ message: "error occurred", error: e.message });
  }
});







userRouter.post("/reset-password", async (req,res)=>{
try{
  let {newpassword}= req.body
let {token}=req.query;
let decoded= jwt.verify(token, "shhhhh");
if(decoded){
  let salt=10
  let user= await Usermodel.findById(decoded.userId)
let myPlaintextPassword=newpassword
  bcrypt.hash(myPlaintextPassword, salt,async function(err, hash) {
        

if(err){
  res.json({success:false, message:err})
}else{
  user.password=hash
  await user.save()
  res.json({success:true, message:"you password has updated"})
}
    });
}
}catch(e){
  if(e.message=="jwt expired"){
    res.json({success:false, message:"link has expired , password did not changed"})
  }
  else{
    res.json({success:false, message:e.message})
  }
}
})




module.exports = {
  userRouter,
  
};