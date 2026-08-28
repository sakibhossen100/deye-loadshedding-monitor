const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3000;

// Railway Variables
const APP_ID = process.env.DEYE_APP_ID;
const APP_SECRET = process.env.DEYE_APP_SECRET;
const EMAIL = process.env.DEYE_EMAIL;
const PASSWORD = process.env.DEYE_PASSWORD;
const INVERTER_SN = process.env.INVERTER_SN;


// Home
app.get("/", (req, res) => {
  res.send("Deye Loadshedding Monitor Running");
});


// Deye Status
app.get("/deye/status", async (req, res) => {

  try {

    // Login API
    const login = await axios.post(
      "https://api.deyecloud.com/v1.0/account/login",
      {
        appId: APP_ID,
        appSecret: APP_SECRET,
        email: EMAIL,
        password: PASSWORD
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );


    if (!login.data || !login.data.data) {
      return res.json({
        error: "Deye Login Failed",
        response: login.data
      });
    }


    const token = login.data.data.accessToken;


    // Get inverter data
    const inverter = await axios.get(
      `https://api.deyecloud.com/v1.0/device/${INVERTER_SN}/latest`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );


    res.json({
      inverter: INVERTER_SN,
      account: EMAIL,
      status: "Online",
      data: inverter.data
    });


  } catch(error){

    res.json({
      error: "Deye API Error",
      message: error.response 
        ? error.response.data 
        : error.message
    });

  }

});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});