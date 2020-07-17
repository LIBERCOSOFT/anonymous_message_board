var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const CONNECTION_STRING = process.env.DB;

function ReplyHandler() {

    this.GetMessages = (req, res) => {
        
      MongoClient.connect(CONNECTION_STRING, function(err, client) {
        if (!err) {
          let db = client.db('AnonymousMessageBoard');
          db.collection("Messages").findOne({_id:ObjectId(req.params.board)}).then((result) => {
            if(result){
              result['replies'].map((val) => {
              delete val.reported;
              delete val.delete_password;
              });
              res.json(result);
              console.log("Reply inputed successfully.")
            }else {
              console.log("Error in Thread ID");
            }
          })
        }
      });

    
    }

    this.PostMessages = (req, res) => {
        
      let newReply = {
        _id : ObjectId(),
        text : req.body.text,
        created_on: Date(),
        delete_password : req.body.delete_password,
        reported : false
      }
      MongoClient.connect(CONNECTION_STRING, function(err, client) {
        if (!err) {
          console.log("connection to input a reply to a thread in the DB successful.");
          let db = client.db('AnonymousMessageBoard');
          db.collection("Messages").findOneAndUpdate({_id:ObjectId(req.body.thread_id)},
          { $set : { bumped_on : Date()}, $push: { replies: newReply}}
          ).then(() => {
            console.log("Reply's been sent.")
            res.redirect(`/b/${req.body.board}/${req.body.thread_id}`);
          })
        }
      });
    
    }

    this.PutMessages = (req, res) => {
        
      MongoClient.connect(CONNECTION_STRING, function(err, client) {
        if (!err) {
          console.log("Connection to delete thread in Database Established.");
          let db = client.db('AnonymousMessageBoard');
          db.collection("Messages").findOne({_id : ObjectId(req.body.thread_id)}).then((result) => {
            result['replies'].map((val) => {
              if(val['_id'] == req.body.reply_id) {
                db.collection("Messages").update({
                  "_id" : ObjectId(req.body.thread_id),
                  "replies._id": ObjectId(req.body.reply_id)
                },
                {'$set' : { 'replies.$.reported' : true}}
                );
                res.jsonp("success");
              }else {
                res.jsonp("No Such Id Found");
              }
            });
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
            result['replies'].map((val) => {
              if(val['_id'] == req.body.reply_id) {
                if(val['delete_password'] === req.body.delete_password){
                  db.collection("Messages").update({
                    "_id" : ObjectId(req.body.thread_id),
                    "replies._id": ObjectId(req.body.reply_id)
                  },
                  {'$set' : { 'replies.$.text' : '[deleted]'}}
                  );
                  res.jsonp("success");
                  console.log("Deletion Successful");
                }else {
                  res.jsonp("Incorrect Password");
                }
              }
            });
          })
        }
      });
    
    }

}

module.exports = ReplyHandler;