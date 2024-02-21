// Installed Packages
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initializations and variable naming
const app = express();
const port = process.env.PORT;

// App routing
app.get("/", (req, res) => {
    res.send("Let's do this!");
    return;
});

//Running the app
app.listen(port, () => console.log(`app running on port ${port}`));