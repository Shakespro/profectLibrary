/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let bookID;

describe('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  it('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        if (!res.body[0]) {
          done ();
          return;
        }
        assert.property(res.body[0], 
        'commentcount',
        'Books in array should contain commentcount'
      );
        assert.property(res.body[0],
       'title',
       'Books in array should contain title'
        );
        assert.property(res.body[0], 
        '_id',
        'Books in array should contain _id'
        );
        done();
      });
  }).timeout(timeout);
  /*
  * ----[END of EXAMPLE TEST]----
  */

  describe('Routing tests', function() {
    this.timeout(10000);

    describe('POST /api/books with title => create book object/expect book object', function() {
      it('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .send({ title: "test-title" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            bookID = res.body._id;
            assert.equal(res.body.title, "test-title");
            done();
          })
          .timeout(timeout);
      });
      
      it('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .post("/api/books")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, "missing required field title");
          done();
        })
        .timeout(timeout);
      });
    });

    describe('GET /api/books => array of books', function(){
      
      it('Test GET /api/books',  function(done){
        chai
        .request(server)
        .get("/api/books")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "it is an array");
          done();
        })
        .timeout(timeout);
      });
    });


    describe('GET /api/books/[id] => book object with [id]', function(){
      
      it('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .get("/api/books/invalidID")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists");
          done();
        })
        .timeout(timeout);
      });

      it('Test GET /api/books/[id] with valid id in db',  function(done){
       chai
        .request(server)
        .post("/api/books/" + bookID)
        .get(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, "test-title");
          done();
        })
        .timeout(timeout);
      });
    });


    describe('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      it('Test POST /api/books/[id] with comment', function(done){
        chai
        .request(server)
        .post("/api/books/" + bookID)
        .send({ comment: "test-comment" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.comments[0], "test-comment");
          done();
        })
        .timeout(timeout);
      });

      it('Test POST /api/books/[id] without comment field', function(done){
        chai
        .request(server)
        .post("/api/books/" + bookID)
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field comment");
          done();
        })
        .timeout(timeout);
      });

      it('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
        .request(server)
        .post("/api/books/" + "invalidID")
        .send({ comment: "test-comment" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists");
          done();
        })
        .timeout(timeout);
      });
    });

    describe('DELETE /api/books/[id] => delete book object id', function() {

      it('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
        .request(server)
        .delete("/api/books/" + bookID)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "delete successful");
          done();
        })
        .timeout(timeout);
      });

      it('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .delete("/api/books/" + "invalidID")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists");
          done();
        })
        .timeout(timeout);
      });
    });
  });
});
