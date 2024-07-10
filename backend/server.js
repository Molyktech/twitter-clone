import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
app.use(express.json()); // for parsing application/json req.body
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded req.body
app.use(cookieParser());


app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectMongoDB();
});
