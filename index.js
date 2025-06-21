require("dotenv").config();

const express = require("express");
const cors = require("cors");

const subscribeRoute = require("./routes/subscribe");

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "https://pureglowy.com"],
  methods: ["POST", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use("/api/subscribe", subscribeRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
