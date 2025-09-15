const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const leadRoutes = require("./routes/lead");

app.use(express.json());
app.use(cookieparser());

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Routes
app.get("/", (req, res) => res.send("Backend API is running 🚀"));
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);


app.use((err,req,res,next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", error: err.message });
});

connectDB()
.then(() => {
    console.log("Database connected successfully");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
})
.catch((error) => {
    console.log("Database not connected:", error.message);
});
