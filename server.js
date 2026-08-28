const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3000;


// Railway Variables
const APP_ID = process.env.DEYE_APP_ID;
const APP_SECRET = process.env.DEYE_APP_SECRET;
const INVERTER_SN = process.env.INVERTER_SN;


// Deye API
const BASE_URL = "https://api.deyecloud.com";


app.get("/", (req, res) => {
    res.send("Deye Loadshedding Monitor Running");
});


// Deye Status API
app.get("/deye/status", async (req, res) => {

    try {

        console.log("Starting Deye Login...");


        // Get Access Token
        const login = await axios.post(
            `${BASE_URL}/v1.0/account/login`,
            {
                appId: APP_ID,
                appSecret: APP_SECRET
            },
            {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        );


        console.log("Login Response:", login.data);


        if (
            !login.data ||
            !login.data.data ||
            !login.data.data.accessToken
        ){

            return res.json({
                error:"Login Failed",
                response:login.data
            });

        }


        const token = login.data.data.accessToken;



        // Get Inverter Data

        const inverter = await axios.get(
            `${BASE_URL}/v1.0/device/${INVERTER_SN}/latest`,
            {
                headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type":"application/json"
                }
            }
        );


        res.json({

            inverter: INVERTER_SN,

            status:"Online",

            data: inverter.data

        });



    } catch(error){

        console.log(error.message);


        res.json({

            error:"Deye API Error",

            message:
            error.response
            ? error.response.data
            : error.message

        });