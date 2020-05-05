var express = require("express");
var app = express();
const multer = require("multer");
const bodyParser = require('body-parser');
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;
var data = require("./data-service.js");
const fs = require('fs');
const exphbs = require("express-handlebars");

app.use(bodyParser.urlencoded({ extended: true}));

//To fix the navigation bar
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, ""); 
    next();
});

//Setting server to handle handlebars (use .hbs)
app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    defaultLayout: 'main',

    helpers: {

        navLink: function(url, options){ 
            return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>'; 
        },

        equal: function (lvalue, rvalue, options) { 
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters"); 
            if (lvalue != rvalue) {
                return options.inverse(this); 
            } else {
                return options.fn(this); }
            }
    }
}));

app.set("view engine", ".hbs");

app.use("/public", express.static('public'));

//route listening on /home
app.get("/", function(req,res){
    res.render('home');
});

//route listening on /home
app.get("/home", function(req,res){
    res.render('home');
});

app.get("/contacts/add", (req,res)=>{
    res.render('addContact')
})

app.get("/images/add", (req,res)=>{
    res.render('addImage')
})

app.post("/contacts/add", (req, res) =>{
    data.addContact(req.body).then(()=>{
        res.redirect("/contacts");
    }).catch((Error)=>{
    })
});

app.post("/contact/update", (req, res) =>{
    data.updateContact(req.body).then((data)=>{
        res.redirect("/contacts");
    }).catch((Error)=>{
    })
});

app.get('/contact/:contactNum', (req,res)=>{ var num =req.params.contactNum;
    data.getContactByNum(num).then((data)=>{
        res.render("contact", {data : data});
    }).catch((err)=>{
        res.status(404).send("Contact Not Found");
    });
});

    //route to get all contacts
    app.get("/contacts", function(req,res){
        data.getAllContacts().then(function(data){
        res.render("contacts", {contacts: data});
        }).catch(() => {
            res.render({message: "No contacts found"});
        });
    });

     // delete contact   
app.get("/contact/delete/:contactNum", (req,res) => {
    data.deleteContactByNum(req.params.contactNum).then(()=> {
        res.redirect("/contacts");
    }).catch((errorMessage)=> {
        res.status(500).send("Unable to remove contact / contact not found");
    });
});

//Defining Multer and default directory to store pictures
const storage = multer.diskStorage({
    destination: "./public/images/uploaded/",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  // tell multer to use the diskStorage function for naming files instead of the default
  const upload = multer({ storage: storage });

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

function onHttpStart(){
    console.log("Express HTTP server listening on " + HTTP_PORT);
}

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