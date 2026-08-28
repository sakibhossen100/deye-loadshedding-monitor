const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3000;


// Railway Variables
const DEYE_APP_ID = process.env.DEYE_APP_ID;
const DEYE_APP_SECRET = process.env.DEYE_APP_SECRET;
const DEYE_EMAIL = process.env.DEYE_EMAIL;
const DEYE_PASSWORD = process.env.DEYE_PASSWORD;
const INVERTER_SN = process.env.INVERTER_SN;


// India Data Center
const DEYE_API = "https://in1-developer.deyecloud.com";


// Test page
app.get("/", (req, res) => {
    res.send("Deye Loadshedding Monitor Running");
});


// Status API
app.get("/deye/status", async (req, res) => {

    try {

        // Login
        const loginResponse = await axios.post(
            `${DEYE_API}/v1.0/account/login`,
            {
                appId: DEYE_APP_ID,
                appSecret: DEYE_APP_SECRET,
                email: DEYE_EMAIL,
                password: DEYE_PASSWORD
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );


        if (!loginResponse.data.data) {

            return res.json({
                error: "Login Failed",
                response: loginResponse.data
            });

        }


        const token = loginResponse.data.data.accessToken;


        // Get inverter information
        const inverterResponse = await axios.get(
            `${DEYE_API}/v1.0/device/${INVERTER_SN}/latest`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        res.json({

            inverter: INVERTER_SN,
            account: DEYE_EMAIL,
            status: "Online",
            data: inverterResponse.data

        });


    } catch (error) {


        res.json({

            error: "Deye API Error",

            message: error.response
                ? error.response.data
                : error.message

        });

    }

});



app.listen(PORT, () => {

    console.log(
        `Deye Monitor running on port ${PORT}`
    );

});