var exports = module.exports = {};
var neo4jclient = require("../neo4jclient.js");
var moment = require('moment');

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