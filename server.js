const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

const {
  DEYE_APP_ID,
  DEYE_APP_SECRET,
  DEYE_EMAIL,
  DEYE_PASSWORD,
  INVERTER_SN
} = process.env;


// Home Test
app.get("/", (req, res) => {
  res.send("Deye Load Shedding Monitor API Running");
});


// Deye Status API
app.get("/deye/status", async (req, res) => {

  try {

    // Deye Cloud Login
    const login = await axios.post(
      "https://eu1-developer.deyecloud.com/v1.0/account/login",
      {
        appId: DEYE_APP_ID,
        appSecret: DEYE_APP_SECRET,
        email: DEYE_EMAIL,
        password: DEYE_PASSWORD
      }
    );


    const token = login.data.accessToken;


    // Get inverter data
    const inverter = await axios.get(
      `https://eu1-developer.deyecloud.com/v1.0/device/${INVERTER_SN}/latest`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    res.json({
      inverter: "Deye SUN-8K-SG05LP1-EU-SM2",
      serial: INVERTER_SN,
      account: DEYE_EMAIL,
      status: "Online",
      data: inverter.data
    });


  } catch (error) {

    res.status(500).json({
      error: "Deye Cloud connection failed",
      message: error.message,
      details: error.response?.data || null
    });

  }

});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
