var neo4jclient = require("../neo4jclient");

var handleErrorAndShowErrorPage = function handleErrorAndShowErrorPage(error, res){
    if(error.type === "server"){
        res.render("error_page")
    } else {

    }   
}

exports.getFreshNotifications = function(req, res) {
var userId = req.session.passport.user;
    console.log(req.body.address);
    neo4jclient.getFreshNotifications(userId, function(error, notifications){
        if(error) {
           handleErrorAndShowErrorPage(error, res);
        } else {
            res.render('includes/notifications', {notifications:notifications})
        }
    })
}

exports.getAllNotifications = function(req, res) {
var userId = req.session.passport.user;
    console.log(req.body.address);
    neo4jclient.getAllNotifications(userId, function(error, notifications){
        if(error) {
           handleErrorAndShowErrorPage(error, res);
        } else {
            res.render('includes/notifications', {notifications:notifications})
        }
    })
}

exports.clearFreshNotifications = function(req, res) {
var userId = req.session.passport.user;
    console.log(req.body.address);
    neo4jclient.removeFreshNotifications(userId, function(error, notifications){
        if(error) {
           handleErrorAndShowErrorPage(error, res);
        } else {
            res.send("cleared")
        }
    })
}



exports.addAddress = function (req, res) {
    var userId = req.session.passport.user;
    console.log(req.body.address);
    neo4jclient.addAddress(req.body.address, userId, function(error, data){
        if(error) {
           handleErrorAndShowErrorPage(error, res);
        } else {
            res.json(data)
        }
    })
};

exports.confirmFriendReq = function (req, res) {
    var userId = req.session.passport.user;
    var friendId = req.params.friendId;
    neo4jclient.confirmFrindReq(userId,friendId, function(error, data){
        if(error) {
           handleErrorAndShowErrorPage(error, res);
        } else {
            res.render('user/user_rel_added', {message:"Confirmed"})
        }
    })
};

exports.deleteFriendReq = function (req, res) {
    var userId = req.session.passport.user;
    var friendId = req.params.friendId;
    neo4jclient.deleteFrindReq(userId,friendId, function(error, data){
        if(error) {
           handleErrorAndShowErrorPage(error, res);
        } else {
            res.json(data)
        }
    })
};

exports.getPendingFriends = function (req, res) {
    var userId = req.session.passport.user;
    neo4jclient.getPendingFriends(userId, function(error, users){
        if(error) {
           handleErrorAndShowErrorPage(error, res);
        } else {
            res.render("user/search_result_users", {users:users.users, user_unit_action:"pending_frind_process"})
        }
    })
};

exports.searchUsers = function(req, res) {
    var userId = req.session.passport.user;
    var searchString = req.query.q;
    neo4jclient.searchUsers(userId, searchString, function(error, users){
        if(error) {
            handleErrorAndShowErrorPage(error, res);
        } else {
            res.render("user/search_result_users", {users:users.users})
        }
    })
};

exports.searchFriends = function(req, res) {
    var userId = req.session.passport.user;
    var searchString = req.query.q;

    neo4jclient.searchFriends(userId, searchString, function(error, users){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            res.render("user/search_result_users", {users:users.users})
        }
    })
};

exports.searchMembersForGroup = function(req, res) {
    var userId = req.session.passport.user;
    var searchString = req.query.q;
    var groupId = req.query.groupId;
    neo4jclient.searchFriends(userId, searchString, function(error, users){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            res.render("user/search_result_users", {users:users.users, user_unit_action:"member", groupId: groupId})
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
            res.render('book/owned_book_details', {books: data.ownedBooks})
        }
    }) 
};

exports.getBorrowedBooks = function(req, res) {
    var userId = req.session.passport.user;
    neo4jclient.getBorrowedBooks(userId, function(error, data){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            res.render('book/borrowed_book_details', {books: data.borrowedBooks})
        }
    }) 
};

exports.friendReq = function (req, res) {
    var userId = req.params.id;
    var currentUserId = req.session.passport.user;
    neo4jclient.addFriend(currentUserId, userId, function(error, book){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            res.render('user/user_rel_added', {message:"Added"})
        }
    })
};

exports.getWishListBooks = function(req, res) {
    var userId = req.session.passport.user;
    neo4jclient.getWishListBooks(userId, function(error, data){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            res.render('book/wishlist_book_details', {books: data.wishListBooks})
        }
    }) 
};
