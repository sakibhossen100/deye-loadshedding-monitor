const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 8080;

// Deye Cloud Credentials
const DEYE_EMAIL = process.env.DEYE_EMAIL || "sakibhossen18@gmail.com";
const DEYE_PASSWORD = process.env.DEYE_PASSWORD || "";
const INVERTER_SN = process.env.INVERTER_SN || "2506305647";


app.get("/", (req, res) => {
  res.send("Deye Load Shedding Monitor API Running");
});


// Login Test + Live Data
app.get("/deye/status", async (req, res) => {

  try {

    // Deye Cloud API login
    const login = await axios.post(
      "https://eu1-developer.deyecloud.com/v1.0/account/login",
      {
        email: DEYE_EMAIL,
        password: DEYE_PASSWORD
      }
    );


    const token = login.data.accessToken;


    // Get inverter data
    const inverter = await axios.get(
      `https://eu1-developer.deyecloud.com/v1.0/device/${INVERTER_SN}/latest`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );


    res.json({
      inverter: "Deye SUN-8K-SG05LP1-EU-SM2",
      serial: INVERTER_SN,
      data: inverter.data
    });


  } catch(error){

    res.status(500).json({
      error:"Deye Cloud connection failed",
      message:error.response?.data || error.message
    });

  }

});


app.listen(PORT,()=>{
 console.log(`Server running on ${PORT}`);
});
