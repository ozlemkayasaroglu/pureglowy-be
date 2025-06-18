require("dotenv").config();
const express = require("express");
const cors = require("cors");

const subscribeRoute = require("./routes/subscribe");

const app = express();
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://pureglowy.com",
    "https://pureglowy-be.vercel.app"
  ],
  methods: ["POST", "OPTIONS"],
  credentials: true
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.use("/api/subscribe", subscribeRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
