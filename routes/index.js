var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET home page. */

router.post('/authors/add', function(req, res, next) {
  knex('authors')
  .insert({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    biography: req.body.biography,
    portrait: req.body.portrait
  })
  .then(function(authors){
    res.redirect('/authors')
  })
});

router.get('/authors/add', function(req, res, next) {
  knex('authors')
  .then(function(authors) {
    knex('books')
    .then(function(books) {
      res.render('addauthor', {authors: authors, books: books});
    })
  })
});

router.post('/authors/delete/:id', function(req, res, next) {
  knex('authors')
  .where('id', req.params.id)
  .del()
  .then(function() {
    res.redirect('/authors')
  })
})

router.get('/authors/edit/:id', function(req, res, next) {
  knex('authors')
  .where('id', req.params.id).first()
  .then(function(author) {
    res.render('authoredit', {author: author})
  })
})

router.post('/authors/edit/:id', function(req, res, next) {
  knex('authors')
  .where('id', req.params.id)
  .update({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    portrait: req.body.portrait,
    biography: req.body.biography
  })
  .then(function(authors) {
    res.redirect('/authors')
  })
})

router.get('/authors', function(req, res, next) {
  var authorselect = [];

  knex('authors')
  .orderBy('last_name')
  .then(function(authorresult){
    for (var i = 0; i < authorresult.length; i++) {
      authorselect.push({
        id: authorresult[i].id,
        last_name: authorresult[i].last_name,
        first_name: authorresult[i].first_name,
        portrait: authorresult[i].portrait,
        biography: authorresult[i].biography,
        titles: []
      })
    }
  })

  var bookselect = [];

  knex('books')
  .then(function(bookresult){
    for (var i = 0; i < bookresult.length; i++) {
      bookselect.push({
        id: bookresult[i].id,
        title: bookresult[i].title,
        genre: bookresult[i].genre,
        description: bookresult[i].description,
        cover: bookresult[i].cover,
        names: []
      })
    }
  })

  knex('authors')
  .innerJoin('authors_books', 'authors.id', 'authors_books.author_id')
  .innerJoin('books', 'authors_books.book_id', 'books.id')
  // .select('books.title', 'author_id')
  .then(function(data) {

    for (var i = 0; i < authorselect.length; i++) {
      for (var j = 0; j < data.length; j++) {
        if (authorselect[i].id == data[j].author_id) {
          authorselect[i].titles.push(data[j].title )
        }
      }
    }
    res.render('authors', {authors: authorselect, books: bookselect});
  })
});

router.get('/authors/:id', function(req, res, next) {
  var authorselect = [];
  var currentAuthor = req.params.id;
  var bookselect = [];
  var authorsingle = [];


  knex('authors')
  .where({id: currentAuthor})
  .then(function(authorresult){
    for (var i = 0; i < authorresult.length; i++) {
      authorsingle.push({
        id: authorresult[i].id,
        last_name: authorresult[i].last_name,
        first_name: authorresult[i].first_name,
        portrait: authorresult[i].portrait,
        biography: authorresult[i].biography,
        titles: []
      })
    }
  })

  knex('authors')
  .then(function(authorresult){
    for (var i = 0; i < authorresult.length; i++) {
      authorselect.push({
        id: authorresult[i].id,
        last_name: authorresult[i].last_name,
        first_name: authorresult[i].first_name,
        portrait: authorresult[i].portrait,
        biography: authorresult[i].biography,
        titles: []
      })
    }
  })

  knex('books')
  .then(function(bookresult){
    for (var i = 0; i < bookresult.length; i++) {
      bookselect.push({
        id: bookresult[i].id,
        title: bookresult[i].title,
        genre: bookresult[i].genre,
        description: bookresult[i].description,
        cover: bookresult[i].cover,
        names: []
      })
    }
  })

  knex('authors')
  .innerJoin('authors_books', 'authors.id', 'authors_books.author_id')
  .innerJoin('books', 'authors_books.book_id', 'books.id')
  // .select('books.title', 'author_id')
  .then(function(data) {
    for (var i = 0; i < authorsingle.length; i++) {
      for (var j = 0; j < data.length; j++) {
        if (authorsingle[i].id == data[j].author_id) {
          authorsingle[i].titles.push(data[j].title )
        }
      }
    }
    res.render('authorsingle', {authorsingle: authorsingle, authors: authorselect, books: bookselect});
  })
});

router.post('/books/add', function(req, res, next) {
  var authors = req.body.authors
  var authors_ids = authors instanceof Array ? authors : [ authors ];

  knex('books')
  .insert({
    title: req.body.title,
    genre: req.body.genre,
    description: req.body.description,
    cover: req.body.cover
  }).returning('id')
  .then(function(id){
    var book_id = id[0];
    var authors_to_book = authors_ids.map(function(author_id){
      return { book_id: book_id, author_id: author_id };
    });

    return knex('authors_books').insert(authors_to_book).then(function(){
      res.redirect('/books');
    });

  });
});

router.get('/books/add', function(req, res, next) {
  knex('authors')
  .then(function(authors) {
    knex('books')
    .then(function(books) {
      res.render('addbook', {authors: authors, books: books});
    })
  })
});

router.post('/books/delete/:id', function(req, res, next) {
  knex('books')
  .where('id', req.params.id)
  .del()
  .then(function() {
    res.redirect('/books')
  })
})

router.get('/books/edit/:id', function(req, res, next) {
  knex('books')
  .where('id', req.params.id).first()
  .then(function(book) {
    res.render('bookedit', {book: book})
  })
})

router.post('/books/edit/:id', function(req, res, next) {
  knex('books')
  .where('id', req.params.id)
  .update({
    title: req.body.title,
    genre: req.body.genre,
    cover: req.body.cover,
    description: req.body.description
  })
  .then(function(books) {
    res.redirect('/books')
  })
})

router.get('/books', function(req, res, next) {
  var bookselect = [];

  knex('books')
  .orderBy('title')
  .then(function(bookresult){
    for (var i = 0; i < bookresult.length; i++) {
      bookselect.push({
        id: bookresult[i].id,
        title: bookresult[i].title,
        genre: bookresult[i].genre,
        description: bookresult[i].description,
        cover: bookresult[i].cover,
        names: []
      })
    }
  })

  var authorselect = [];

  knex('authors')
  .then(function(authorresult){
    for (var i = 0; i < authorresult.length; i++) {
      authorselect.push({
        id: authorresult[i].id,
        last_name: authorresult[i].last_name,
        first_name: authorresult[i].first_name,
        portrait: authorresult[i].portrait,
        biography: authorresult[i].biography,
        titles: []
      })
    }
  })

  knex('books')
  .innerJoin('authors_books', 'books.id', 'authors_books.book_id')
  .innerJoin('authors', 'authors_books.author_id', 'authors.id')
  // .select('first_name', 'last_name', 'author_id')
  .then(function(books) {
    for (var i = 0; i < bookselect.length; i++) {
      for (var j = 0; j < books.length; j++) {
        if (bookselect[i].id == books[j].book_id) {
          bookselect[i].names.push(books[j].first_name + ' ' + books[j].last_name)
        }
      }
    }
    res.render('books', {books: bookselect, authors: authorselect});
  })
});

router.get('/books/:id', function(req, res, next) {
  var currentbook = req.params.id;
  var bookselect = [];
  var authorselect = [];
  var booksingle = [];

  knex('books')
  .where({id: currentbook})
  .then(function(bookresult){
    for (var i = 0; i < bookresult.length; i++) {
      booksingle.push({
        id: bookresult[i].id,
        title: bookresult[i].title,
        genre: bookresult[i].genre,
        description: bookresult[i].description,
        cover: bookresult[i].cover,
        names: []
      })
    }
  })

  knex('books')
  .then(function(bookresult){
    for (var i = 0; i < bookresult.length; i++) {
      bookselect.push({
        id: bookresult[i].id,
        title: bookresult[i].title,
        genre: bookresult[i].genre,
        description: bookresult[i].description,
        cover: bookresult[i].cover,
        names: []
      })
    }
  })

  knex('authors')
  .then(function(authorresult){
    for (var i = 0; i < authorresult.length; i++) {
      authorselect.push({
        id: authorresult[i].id,
        last_name: authorresult[i].last_name,
        first_name: authorresult[i].first_name,
        portrait: authorresult[i].portrait,
        biography: authorresult[i].biography,
        titles: []
      })
    }
  })

  knex('books')
  .innerJoin('authors_books', 'books.id', 'authors_books.book_id')
  .innerJoin('authors', 'authors_books.author_id', 'authors.id')
  // .select('first_name', 'last_name', 'author_id')
  .then(function(books) {
    for (var i = 0; i < booksingle.length; i++) {
      for (var j = 0; j < books.length; j++) {
        if (booksingle[i].id == books[j].book_id) {
          booksingle[i].names.push(books[j].first_name + ' ' + books[j].last_name)
        }
      }
    }
    res.render('booksingle', {booksingle: booksingle, books: bookselect, authors: authorselect});
  })
});

router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
