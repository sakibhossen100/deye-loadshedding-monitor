const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 8080;

const DEYE_APP_ID = process.env.DEYE_APP_ID;
const DEYE_APP_SECRET = process.env.DEYE_APP_SECRET;
const INVERTER_SN = process.env.INVERTER_SN;
const DEYE_EMAIL = process.env.DEYE_EMAIL;


// Deye Developer API
const DEYE_API = "https://developer.deyecloud.com";


app.get("/", (req,res)=>{
    res.send("Deye Load Shedding Monitor API Running");
});


app.get("/deye/status", async(req,res)=>{

try {


const tokenResponse = await axios.post(

`${DEYE_API}/v1.0/account/token`,

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


const token =
tokenResponse.data?.data?.accessToken ||
tokenResponse.data?.accessToken;


if(!token){

return res.json({

error:"Token not received",

response:tokenResponse.data

});

}



const inverter = await axios.get(

`${DEYE_API}/v1.0/device/${INVERTER_SN}/latest`,

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

data:inverter.data

});


}

catch(error){

res.json({

error:"Deye API Error",

message:error.response?.data || error.message

});

}


});


app.listen(PORT,()=>{

console.log("Server running on "+PORT);

});