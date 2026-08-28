
const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 8080;

// Deye Cloud Information
const DEYE_EMAIL = "sakibhossen18@gmail.com";
const INVERTER_SN = "2506305647";


app.get("/", (req, res) => {
  res.send("Deye Load Shedding Monitor API Running");
});


app.get("/status", (req, res) => {
  res.json({
    grid: "Normal",
    message: "API is working"
  });
});


// Deye Status API
app.get("/deye/status", async (req, res) => {

  try {

    // এখানে পরে Deye Cloud API connection বসবে
    // এখন test response দিচ্ছে

    res.json({
      inverter: "Deye SUN-8K-SG05LP1-EU-SM2",
      serial: INVERTER_SN,
      account: DEYE_EMAIL,
      status: "Online",
      grid: "Normal",
      battery: "Monitoring Active"
    });


  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
