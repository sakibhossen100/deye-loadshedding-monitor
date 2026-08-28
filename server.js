const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req,res)=>{
  res.send("Deye Load Shedding Monitor API Running");
});

app.get("/status", async (req,res)=>{
  res.json({
    grid:"Normal",
    message:"API is working"
  });
});

app.get("/deye/status", async (req,res)=>{

  try {

    const response = await axios.post(
      "https://api.deyecloud.com/api/v1/inverter/status",
      {
        sn: process.env.INVERTER_SN
      },
      {
        headers:{
          "Authorization": process.env.DEYE_APP_SECRET,
          "App-Id": process.env.DEYE_APP_ID
        }
      }
    );

    res.json(response.data);

  } catch(error){

    res.json({
      error:true,
      message:error.message
    });

  }

});


app.listen(PORT,()=>{
 console.log("Server running on "+PORT);
});
