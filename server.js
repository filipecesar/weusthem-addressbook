var express = require("express");
var app = express();
const multer = require("multer");
const bodyParser = require('body-parser');
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;
var data = require("./data-service.js");

app.use(bodyParser.urlencoded({ extended: true}));


app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

data.initialize()
    .then(function() {
        app.listen(HTTP_PORT, onHttpStart);
    })
    .catch(function(){
        console.log("Error: Server not initialized");
    })

