const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },

  password: { type: String, required: true },
  role: { type: String, enum: ["BookAdmin", "student", "admin", "manager"], default: "student" },
  feesStatus: { type: String, enum: ["pending", "completed"], default: "pending" }
});

const Usermodel = mongoose.model("Usermodel", userSchema);


const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  authorName: { type: String, required: true },
  status: { type: String, enum: ["borrowed", "available"], default: "available" }
});

const Book = mongoose.model("Book", bookSchema);

const borrowedBookSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  overdue: { type: Boolean, default: false }
}, { timestamps: true });

const Borrowed = mongoose.model("Borrowed", borrowedBookSchema);


const seatSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true }
});

const Seat = mongoose.model("Seat", seatSchema);

const assignSeatSchema = new mongoose.Schema({
  seatId: { type: mongoose.Schema.Types.ObjectId, ref: "Seat", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ["available", "not_available"], default: "not_available" }
}, { timestamps: true });

const AssignSeat = mongoose.model("AssignSeat", assignSeatSchema);


const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Fee = mongoose.model("Fee", feeSchema);







let liberarymaintaince= new mongoose.Schema({
    wificost:{type:Number},
    watercost:{type:Number},
    LightBill:{type:Number},
    otherthings:{type:String} 
})

let Maintance= new mongoose.model("Maintance", liberarymaintaince);




const announcementSchema = new mongoose.Schema(
  {
    announcedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    media: [
      {
        url: { type: String, required: true },
        
        type: { type: String, enum: ["image", "video"], required: true } 
      }
    ]
  },
  { timestamps: true }
);

let Anouncement= mongoose.model("Anounce", announcementSchema);



module.exports = { Usermodel, Book, Borrowed, Seat, AssignSeat, Fee, Maintance, Anouncement};
