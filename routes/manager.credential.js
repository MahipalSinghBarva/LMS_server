let express= require("express");
const quizmiddle = require("../middleware/middleware");
const { Usermodel, Anouncement } = require("../models/models");
let managerrouter= express.Router()

let arr=["BookAdmin", "student", "admin", "manager"];

let multer=require("multer");
const { videostorage } = require("../cloudinary/cloudcoonfi");



managerrouter.post("/create-admin",quizmiddle(...arr.slice(2)), async(req,res)=>{

try{
    let   newadmin = await new Usermodel({
        ...req.body

    })
 await newadmin.save();
res.json({success:true, mnessage:"admin created successfully "});
}catch(e){
    res.json({success:false, message:e.message})
}

} )

managerrouter.delete("/delete/:id", quizmiddle(...arr.slice(2)),  async(req,res)=>{

try{
let {id}= req.params;
let admin=await  Usermodel.findById(id);
if(admin) return res.json({success:false, message:"admin already deleted or not found "})
let user= await Usermodel.findOneAndDelete(id, {new:true});
res.json({success:true, message:"admin has been deleted",  admin:user });

}catch(e){
res.json({success:false, message:e.message});
}
})


managerrouter.patch("/update-admin/:id", quizmiddle(...arr.slice(2), async(req,res)>{


}))




managerrouter.patch("/update-admin/:id", quizmiddle(...arr(2)), async (req,res)=>{

try{
let {id}= req.params;
let   user = await Usermodel.findById(id)

if(!user) res.json({success:true, message:"user not found"} )

user={
    ...req.body
}
 await user.save()

}catch(e){
res.json({success:true, message:"admin has been update"})
}

} )


const upload = multer({ storage: videostorage });

managerrouter.post("/upload",quizmiddle(...arr),upload.single("videoFile"),async (req, res) => {
    try {
      const { title } = req.body;

      const newAnnouncement = new Anouncement({
        title,
        announcedBy: req.user._id,
        media: [
          {
            url: req.file.path,
            type: req.file.mimetype.startsWith("video") ? "video" : "image"
          }
        ]
      });

      await newAnnouncement.save();
      res.status(201).json({ message: "Announcement created", data: newAnnouncement });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);



