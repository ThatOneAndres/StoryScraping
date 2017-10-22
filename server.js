var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");

// Our scraping tools
// It works on the client and on the server
var cheerio = require("cheerio");
var request = require("request");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/StoryScrape";
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Routes

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    // Make a request for the news section of ycombinator
    request("https://www.latimes.com/local/lanow/", function(error, response, html) {
      if (error) throw error;
      // Load the html body from request into cheerio
      var $ = cheerio.load(html);
      // For each element with a "title" class
      $(".trb_blogroll_post").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Save the text and href of each link enclosed in the current element
        var title = $(element).children(".trb_blogroll_post_title").text();
        var summary = $(element).children(".trb_blogroll_post_description").text();
        var link = $(element).children(".trb_blogroll_post_description").children("a").attr("href");
  
        result.title = title;
        result.summary = summary.replace("Read more").trim();
        result.link = "http://www.latimes.com" + link;
        console.log(result);

        // If this found element had both a title and a link
        if (title && link && summary) {
            // Create a new Article using the `result` object built from scraping
            db.Article
            .create(result)
            .then(function(dbArticle) {
                // If we were able to successfully scrape and save an Article, send a message to the client
                res.send("Scrape Complete");
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
        }
      });
    });
  });

  // Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article
      .find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get("/save", function(req, res) {
        console.log(path.resolve(__dirname + "/public/saved.html"));
         res.sendFile(path.resolve(__dirname + "/public/saved.html"));
    });

  // Route for add Saved articles to db
  app.post("/api/save", function(req,res){
      console.log(req.body)
      db.Save
      .create(req.body)
      .then(function(dbSave){
          res.send("Saved")
      })
      .catch(function(err){
          res.json(err);
      })
  })

    // Route for getting all Save from the db
    app.get("/api/save", function(req, res) {
        // Grab every document in the Save collection
        db.Save
        .find({})
        .populate("note")
        .then(function(dbSave) {
            // If we were able to successfully find Save, send them back to the client
            res.json(dbSave);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    app.delete("/api/save", function(req, res){
        db.Save
        .remove(req.body)
        .then(function(dbSave){
            res.send("Saved")
        })
        .catch(function(err){
            res.json(err);
        })
    });

    // Route for saving/updating an Article's associated Note
app.post("/save/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note
      .create({
          title: req.body.title,
          body: req.body.body
      })
      .then(function(dbNote) {

        return db.Save.findOneAndUpdate({ _id: req.params.id }, { $push: {note: dbNote._id} }, { new: true });
      })
      .then(function(dbSave) {
        // If we were able to successfully update an Save, send it back to the client
        res.json(dbSave);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });



  // Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
