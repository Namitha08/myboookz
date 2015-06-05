var exports = module.exports = {};
var neo4jclient = require("../neo4jclient.js");
var moment = require('moment');

exports.addBookToUser = function(req, res) {
    var bookId = req.params.id;
    var userId = req.session.passport.user;
    var idType = req.query.idType;
    var listingType = req.query.listingType;
    if(listingType === "wishlist") {
        neo4jclient.addBookToWishListForUser(userId, bookId, idType, function(error, data){
            if(error) {
                res.errorCode = 500;
                res.json(error)
            } else {
                res.render("book/book_type_info", {book:{bookType:"WISH"}})
            }
        })
    } else if(listingType === "own") {
        neo4jclient.addBookToUserAsOwn(userId, bookId, idType, function(error, data){
            if(error) {
                res.errorCode = 500;
                res.json(error)
            } else {
                res.render("book/book_type_info", {book:{bookType:"OWN"}})
            }
        })
    }else if(listingType === "read") {
        neo4jclient.addBookToUserAsRead(userId, bookId, idType, function(error, data){
            if(error) {
                res.errorCode = 500;
                res.json(error)
            } else {
                res.render("book/book_type_info", {book:{bookType:"READ"}})
            }
        })
    } else if(listingType === "readAndOwn") {
        neo4jclient.addBookToUserAsOwn(userId, bookId, idType, function(error, data){
            if(error) {
                res.errorCode = 500;
                res.json(error)
            } else {
                res.render("book/book_type_info", {book:{bookType:"OWN"}})
            }
        })
    }
};

exports.showBook = function (req, res) {
    var bookId = req.params.id;
    var userId = req.session.passport.user;
    neo4jclient.getBookRelatedToUser(bookId, userId, function(error, book){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            var borrowedDateFromNow = moment(1429551207130).fromNow();
            var borrowedDate = moment(1429551207130).format("MMM Do YYYY");
            res.render('show_book', { book: book, borrowedDate: borrowedDate, borrowedDateFromNow: borrowedDateFromNow});
        }
    })
};

exports.showBookByGrId = function (req, res) {
    var bookId = req.params.id;
    var userId = req.session.passport.user;
    neo4jclient.getBookByGrIdRelatedToUser(bookId, userId, function(error, book){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            var borrowedDateFromNow = moment(1429551207130).fromNow();
            var borrowedDate = moment(1429551207130).format("MMM Do YYYY");
            res.render('show_book', { book: book, borrowedDate: borrowedDate, borrowedDateFromNow: borrowedDateFromNow});
        }
    })
};

exports.initiateBorrowBookReq = function (req, res) {
    var bookId = req.params.id;
    var ownerUserId = req.params.ownerId;
    var userId = req.session.passport.user;
    neo4jclient.initiateBorrowBookReq(userId, ownerUserId, bookId, function(error, book){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
           res.send("Ok")
        }
    })
};

exports.acceptBorrowed = function (req, res) {
    var shareContact = req.body.shareContact;
    var comment = req.body.comment;
    var borrowerId = req.body.borrowerId;
    var ownerId = req.body.ownerId;
    var bookId = req.body.bookId;
    console.log("changing to agreed")
     neo4jclient.updateStatusToAgreed(borrowerId, ownerId, bookId, shareContact, comment, function(error, book){
         if(error){
             //todo: error page
         } else {
             res.render("process_borrowbook_init", {process: 0})
         }
     })
};

exports.processBorrowBookInit = function (req, res) {
    var bookId = req.params.bookId;
    var ownerUserId = req.params.ownerId;
    var borrowerId = req.params.borrowerId;
    neo4jclient.getUserFromId(borrowerId, function(error, user){
        if(error) {
            //todo: display error message
        } else {
            neo4jclient.getBookById(bookId, function(error, book){
                if(error){
                    //todo: error page
                } else {
                    res.render("process_borrowbook_init", {book :book, borrower: user, ownerUserId: ownerUserId, process: 1, borrowerId :borrowerId, bookId :bookId})
                }
            })
        }
    })
};

