const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("MongoDB Connection Error:", err.message);
  });

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});