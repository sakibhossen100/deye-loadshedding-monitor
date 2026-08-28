const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Deye Load Shedding Monitor API Running");
});

app.get("/status", (req, res) => {
  res.json({
    grid: "Normal",
    message: "API is working"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
