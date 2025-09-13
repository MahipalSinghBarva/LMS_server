const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { userRouter } = require("./routes/routes");
const connectDB = require("./config/db");
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
    
    res.json({ message: "Server is working" })
})


app.use("/user",userRouter )

app.listen(process.env.PORT, ()=>{
    connectDB();
    console.log(`Server is working on port: ${process.env.PORT}`)
})

