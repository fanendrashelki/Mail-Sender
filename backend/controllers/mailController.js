const XLSX = require("xlsx");
const MailRecord = require("../models/MailRecord");
const sendMail = require("../utils/sendMail");
exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const emails = XLSX.utils.sheet_to_json(sheet);

    for (const row of emails) {
      const email = row.email;

      if (!email) continue;

      const record = await MailRecord.findOne({ where: { email } });
      console.log(record);

      if (!record) {
        console.log("email");

        await MailRecord.create({ email });
      }
    }
    res.json({ message: "Emails imported successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMails = async (req, res) => {
  try {
    const pendingMails = await MailRecord.findAll({
      where: { status: "PENDING" },
    });

    for (const mail of pendingMails) {
      await sendMail(mail.email, mail.id); // Pass mail.id for tracking
      mail.status = "SENT";
      await mail.save();
    }
    res.json({ message: "All pending mails sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecord = async (req, res) => {
  try {
    const records = await MailRecord.findAll(); // Fetch all mail records
    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching records",
    });
  }
};
