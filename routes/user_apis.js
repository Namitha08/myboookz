var neo4jclient = require("../neo4jclient");
exports.addAddress = function (req, res) {
    var userId = req.session.passport.user;
    console.log(req.body.address);
    neo4jclient.addAddress(req.body.address, userId, function(error, data){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            res.json(data)
        }
    })
};

exports.updateAddress = function (req, res) {
    var addressId = req.params.id;
    var userId = req.session.passport.user;
    neo4jclient.updateAddress(addressId, req.body.address, userId, function(error, data){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            res.json(data)
        }
    })
};

exports.deleteAddress = function (req, res) {
    var addressId = req.params.id;
    var userId = req.session.passport.user;
    neo4jclient.deleteAddress(addressId, userId, function(error, data){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            res.json(data)
        }
    })
};

exports.getOwnedBooks = function(req, res) {
    var userId = req.session.passport.user;
    neo4jclient.getOwnedBooks(userId, function(error, data){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            res.json(data)
        }
    }) 
}


exports.getWishListBooks = function(req, res) {
    var userId = req.session.passport.user;
    neo4jclient.getWishListBooks(userId, function(error, data){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            res.render('user/my_wishlist_books', {books: data})
        }
    }) 
}
