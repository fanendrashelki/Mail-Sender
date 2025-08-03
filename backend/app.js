const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const mailRoutes = require("./routes/mailRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/mails", mailRoutes);
app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});

const PORT = process.env.PORT || 8000;
sequelize.sync().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});
