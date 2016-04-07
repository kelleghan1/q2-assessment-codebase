var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET home page. */

router.get('/authors', function(req, res, next) {
  knex('authors')
  .then(function(authors) {
    res.render('authors');
  })
});

router.get('/books', function(req, res, next) {
  knex('books')
  .then(function(books) {
    
    res.render('books', {books: books});
  })
});


router.get('/', function(req, res, next) {
    res.render('index');
});

module.exports = router;
