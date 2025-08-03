const express = require("express");
const multer = require("multer");
const MailRecord = require("../models/MailRecord");
const {
  uploadExcel,
  sendMails,
  getRecord,
} = require("../controllers/mailController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-excel", upload.single("file"), uploadExcel);
router.post("/send-mails", sendMails);
router.get("/record", getRecord);

router.get("/track", async (req, res) => {
  try {
    const { id } = req.query;
    console.log("Tracking hit for ID:", id);

    if (!id) {
      console.log("No ID provided");
      return res.status(400).send("Missing ID");
    }

    const record = await MailRecord.findByPk(Number(id));
    if (!record) {
      console.log("Record not found for ID:", id);
      return res.status(404).send("Record not found");
    }

    // Update the record
    record.opened = true;
    await record.save();
    console.log("Record updated successfully:", record.toJSON());

    // Send transparent image
    res.set("Content-Type", "image/png");
    const img = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgMBAxWcKwAAAABJRU5ErkJggg==",
      "base64"
    );
    res.send(img);
  } catch (error) {
    console.error("Error in tracker:", error);
    res.status(500).send("Error tracking");
  }
});

module.exports = router;
