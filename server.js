const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 8080;

const DEYE_APP_ID = process.env.DEYE_APP_ID;
const DEYE_APP_SECRET = process.env.DEYE_APP_SECRET;
const INVERTER_SN = process.env.INVERTER_SN;
const DEYE_EMAIL = process.env.DEYE_EMAIL;


app.get("/", (req,res)=>{
    res.send("Deye Load Shedding Monitor API Running");
});


app.get("/deye/status", async(req,res)=>{

    try {

        // Get Access Token
        const tokenResponse = await axios.post(
            "https://eu1-developer.deyecloud.com/v1.0/account/token",
            {
                appId: DEYE_APP_ID,
                appSecret: DEYE_APP_SECRET
            },
            {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        );


        const token = tokenResponse.data?.data?.accessToken;


        if(!token){

            return res.json({
                error:"Token not received",
                response:tokenResponse.data
            });

        }



        // Get inverter latest data

        const inverterResponse = await axios.get(

            `https://eu1-developer.deyecloud.com/v1.0/device/${INVERTER_SN}/latest`,

            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );


        res.json({

            inverter:"Deye SUN-8K-SG05LP1-EU-SM2",

            serial:INVERTER_SN,

            account:DEYE_EMAIL,

            status:"Online",

            data:inverterResponse.data

        });



    } catch(error){


        res.json({

            error:"Deye API Error",

            details:error.response?.data || error.message

        });


    }


});


app.listen(PORT,()=>{

console.log("Server running on port "+PORT);

});