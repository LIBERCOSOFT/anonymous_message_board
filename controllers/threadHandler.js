var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const CONNECTION_STRING = process.env.DB;

function ThreadHandler() {

    this.GetMessages = (req, res) => {
        
        let board = req.params.board;

        if(board == 'general'){
          MongoClient.connect(CONNECTION_STRING, function(err, client) {
            if (!err) {
              console.log("connection to log recent threads in the DB successful.");
              let db = client.db('AnonymousMessageBoard');
              db.collection("Messages").find({}).toArray().then((result) => {
                result.map((val) => {
                  delete val.reported;
                  delete val.delete_password;
                  val['replycount'] = val['replies'].length;
                  val['replies'] = val['replies'].slice(0, 3);
                })
                if (result.length > 10){
                  res.json(result.slice(0,10));
                }else{
                  res.json(result);
                }
              })
            }
          });
        }else{
          MongoClient.connect(CONNECTION_STRING, function(err, client) {
            if (!err) {
              console.log("connection to print recent threads in the DB successful.");
              let db = client.db('AnonymousMessageBoard');
              db.collection("Messages").find({board: board}).toArray().then((result) => {
                result.map((val) => {
                  delete val.reported;
                  delete val.delete_password;
                  val['replycount'] = val['replies'].length;
                  val['replies'] = val['replies'].slice(0, 3);
                })
                if (result.length > 10){
                  res.json(result.slice(0,10));
                }else{
                  res.json(result);
                }
              })
            }
          });
        }

      
    }

    this.PostMessages = (req, res) => {
        
        let newThread = {
            board: req.body.board,
            text: req.body.text,
            created_on : Date(),
            bumped_on : Date(),
            reported : false,
            delete_password : req.body.delete_password,
            replies : []
          }
          MongoClient.connect(CONNECTION_STRING, function(err, client) {
            if (!err) {
              console.log("Connection to input new thread in Database Established.");
              let db = client.db('AnonymousMessageBoard');
              db.collection("Messages").insertOne(newThread).then(() => {
                console.log("Thread inputed successfully!");
                res.redirect(`/b/${req.body.board}`);
              })
            }
          });
        
    }

    this.PutMessages = (req, res) => {
        
        MongoClient.connect(CONNECTION_STRING, function(err, client) {
            if (!err) {
              console.log("Connection to report thread in Database Established.");
              let db = client.db('AnonymousMessageBoard');
              db.collection("Messages").findOneAndUpdate({_id : ObjectId(req.body.thread_id)}, { $set: { "reported" : true} }).then(() => {
                res.jsonp("success");
              })
            }
          });
        
    }

    this.DeleteMessages = (req, res) => {
        
        MongoClient.connect(CONNECTION_STRING, function(err, client) {
            if (!err) {
              console.log("Connection to delete thread in Database Established.");
              let db = client.db('AnonymousMessageBoard');
              db.collection("Messages").findOne({_id : ObjectId(req.body.thread_id)}).then((result) => {
                if(result.delete_password === req.body.delete_password){
                  db.collection("Messages").findOneAndDelete({_id : ObjectId(req.body.thread_id)}).then(() => {
                    res.jsonp("success");
                    console.log("Deletion successful");
                  });
                }else {
                  res.jsonp('incorrect password');
                }
              })
            }
          });
        
    }

}

module.exports = ThreadHandler;