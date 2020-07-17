/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('create 2 new threads(because we end up deleting 1 in the delete test)', function(done) {
        chai.request(server)
        .post('/api/threads/fcc-test')
        .send({text:'testText', delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
        });
        chai.request(server)
        .post('/api/threads/fcc-test')
        .send({text:'testText', delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
        });
        done();
      })
    });
    
    suite('GET', function() {
      test('most recent 10 threads with most recent 3 replies each', function(done) {
        chai.request(server)
        .get('/api/threads/fcc-test')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isBelow(res.body.length, 11);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'replies');
          assert.isArray(res.body[0].replies);
          assert.isBelow(res.body[0].replies.length, 4);
        });
        done();
      });
    });
    
    suite('DELETE', function() {
      test('delete thread with good password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc-test')
        .send({thread_id:"5f1019ad3cda720cfc0b43fd", delete_password:'iloveafrica.'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "success");
        });
        done();
      });
      
      test('delete thread with bad password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc-test')
        .send({thread_id: "5f101a627a59f1073cf0a0c8", delete_password: 'wrong'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
        });
        done();
      });
    });
    
    suite('PUT', function() {
      test('report thread', function(done) {
        chai.request(server)
        .put('/api/threads/fcc-test')
        .send({report_id:"5f1019ad3cda720cfc0b43fd"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
        });
        done();
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('reply to thread', function(done) {
        chai.request(server)
        .post('/api/replies/fcc-test')
        .send({thread_id: "5f101a897a59f1073cf0a0c9", text:'a reply', delete_password:'iloveafrica.'})
        .end(function(err, res){
          assert.equal(res.status, 200);
        });
        done();
      });
    });
    
    suite('GET', function() {
      test('Get all replies for 1 thread', function(done) {
        chai.request(server)
        .get('/api/replies/fcc-test')
        .query({board: "5f10c5e67f4c4306a4e0fd61"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'text');
          assert.property(res.body, 'replies');
          assert.property(res.body, 'delete_password');
          assert.property(res.body, 'reported');
          assert.isArray(res.body.replies);
          assert.equal(res.body.replies[0].text, 'a reply');
        });
        done();
      });
    });
    
    suite('PUT', function() {
      test('report reply', function(done) {
        chai.request(server)
        .put('/api/threads/fcc-test')
        .send({thread_id:"5f1019ad3cda720cfc0b43fd" , reply_id:"5f101b86c92c881294d27660"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
        });
        done();
      });
    });
    
    suite('DELETE', function() {
      test('delete reply with valid password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc-test')
        .send({thread_id: "5f1019ad3cda720cfc0b43fd" ,reply_id: "5f101b86c92c881294d27660", delete_password: 'iloveafrica.'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
        });
        done();
      });
    });
    
  });

});
