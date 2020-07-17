/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const ThreadHandler = require('../controllers/threadHandler');
const ReplyHandler = require('../controllers/replyHandler.js');

module.exports = function (app) {

  const threadHandler = new ThreadHandler();
  const replyHandler = new ReplyHandler();
  
  app.route('/api/threads/:board')
      .get(threadHandler.GetMessages)

      .post(threadHandler.PostMessages)

      .put(threadHandler.PutMessages)

      .delete(threadHandler.DeleteMessages);
    
  app.route('/api/replies/:board')
    .get(replyHandler.GetMessages)

    .post(replyHandler.PostMessages)

    .put(replyHandler.PutMessages)

    .delete(replyHandler.DeleteMessages)

};
