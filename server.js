const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 8080;

// Railway Variables
const DEYE_EMAIL = process.env.DEYE_EMAIL;
const DEYE_PASSWORD = process.env.DEYE_PASSWORD;
const DEYE_APP_ID = process.env.DEYE_APP_ID;
const DEYE_APP_SECRET = process.env.DEYE_APP_SECRET;
const INVERTER_SN = process.env.INVERTER_SN;


// Home route
app.get("/", (req, res) => {
    res.send("Deye Load Shedding Monitor API Running");
});


// Deye Status API
app.get("/deye/status", async (req, res) => {

    try {

        // Login Deye Cloud
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


        if (!token) {
            return res.json({
                error: "Login failed",
                response: login.data
            });
        }



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

            inverter:"Deye SUN-8K-SG05LP1-EU-SM2",

            serial: INVERTER_SN,

            account: DEYE_EMAIL,

            status:"Online",

            data: inverter.data

        });



    } catch(error){

        res.json({

            error:"Deye Cloud connection failed",

            message:error.response?.data || error.message

        });

    }

});



app.listen(PORT,()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});
