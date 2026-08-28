const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3000;


// Railway Environment Variables
const APP_ID = process.env.DEYE_APP_ID;
const APP_SECRET = process.env.DEYE_APP_SECRET;
const EMAIL = process.env.DEYE_EMAIL;
const PASSWORD = process.env.DEYE_PASSWORD;
const INVERTER_SN = process.env.INVERTER_SN;


// Deye Cloud India Data Center
const BASE_URL = "https://in1-developer.deyecloud.com";


app.get("/", (req, res) => {
    res.send("Deye Loadshedding Monitor Running");
});


app.get("/deye/status", async (req, res) => {

    try {

        console.log("NEW DEYE SERVER LOADED");


        // Login
        const login = await axios.post(
            `${BASE_URL}/v1.0/account/login`,
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


        if (!login.data.data || !login.data.data.accessToken) {

            return res.json({
                error: "Deye Login Failed",
                response: login.data
            });

        }


        const token = login.data.data.accessToken;


        // Inverter Latest Data
        const inverter = await axios.get(
            `${BASE_URL}/v1.0/device/${INVERTER_SN}/latest`,
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


    } catch (error) {


        console.log(error.message);


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