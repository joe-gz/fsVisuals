// express dependency for our application
var express = require('express')
// loads mongoose dependency
var mongoose = require('mongoose')
// loads dependency for middleware for paramters
var bodyParser = require('body-parser')
// loads dependency that allows put and delete where not supported in html
var methodOverride = require('method-override')
// loads module containing all authors contrller actions. not defined yet...
var commentsController = require("./controllers/commentsController")
// connect mongoose interfaces to reminders mongo db
mongoose.connect('mongodb://localhost/reminders')
var app = express()

// allows for parameters in JSON and html
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
// allows for put/delete request in html form
app.use(methodOverride('_method'))
// connects assets like stylesheets
app.use(express.static(__dirname + '/public'))

// define controller/route
app.use("/", commentsController)

// app server located on port 4000
app.listen(4000, function(){
  console.log("app listening on port 4000")
})
