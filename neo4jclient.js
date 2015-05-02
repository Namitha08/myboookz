var exports = module.exports = {};
var config = require('./config');
var Client = require('node-rest-client').Client;

client = new Client();

function getArguments() {
    return {
//    data:{"name":"Jerald Reichert","email":"felipa.considine@gmail.com","lastModifiedDate":0,"addresses":[{"id":null,"addressType":"HOME","addressLine1":"653","addressLine2":"Suite 402","landmark":"landMark","city":"Lake town","state":"NY","country":"Ethiopia","zipCode":"20726-6718","createdDate":0,"lastModifiedTime":0}],"phone":"096.160.4570 x114","createdDate":0}, // data passed to REST method (only useful in POST, PUT or PATCH methods)
//    path:{"id":120}, // path substitution var
//    parameters:{arg1:"hello",arg2:"world"},
      headers: {"content-type": "application/json", "accept": "application/json"}
    };
}

var baseUrl = config.neo4jservice.baseurl;

client.registerMethod("createUser",  baseUrl + "/users", "POST"); //?accessToken=xyz    //done
client.registerMethod("updateFields", baseUrl + "/users/${id}/fields", "PUT");          //done
client.registerMethod("getUserFromFbId", baseUrl + "/users/fbId/${id}", "GET");         //done
client.registerMethod("getUserFromId", baseUrl + "/users/${id}", "GET");                //done
client.registerMethod("getUserFromGoogleId", baseUrl + "/users/${googleId}/googleId", "GET");//done
client.registerMethod("updateUser", baseUrl + "/users/${id}", "PUT");
client.registerMethod("addAddress", baseUrl + "/users/${userId}/addresses", "POST");    //done
client.registerMethod("updateAddress", baseUrl + "/users/${userId}/addresses/${addressId}", "PUT"); //done
client.registerMethod("deleteAddress", baseUrl + "/users/${userId}/addresses/${addressId}", "DELETE");//done

client.registerMethod("createReminder", baseUrl + "/users/${userId}/reminders", "POST");                    //done
client.registerMethod("getReminder", baseUrl + "/users/${userId}/reminders/${reminderId}", "GET");          //done
client.registerMethod("listReminders", baseUrl + "/users/${userId}/reminders", "GET");                      //done
client.registerMethod("updateReminder", baseUrl + "/users/${userId}/reminders/${reminderId}", "PUT");       //done
client.registerMethod("deleteReminder", baseUrl + "/users/${userId}/reminders/${reminderId}", "DELETE");    //done

client.registerMethod("addBookToUser", baseUrl + "/users/${userId}/books/${bookId}/own", "POST");
client.registerMethod("addBookToWishListForUser", baseUrl + "/users/${userId}/books/${bookId}/wish", "PUT");
client.registerMethod("changeBookStatusOfOwnedBook", baseUrl + "/users/${userId}/books/${bookId}/OWN", "PUT");
client.registerMethod("getOwnedBooks", baseUrl + "/users/${userId}/books", "GET"); // ?filter=owned         //done
client.registerMethod("getAvailableBooks", baseUrl + "/users/${userId}/books", "GET"); // ?filter=available
client.registerMethod("getLentBooks", baseUrl + "/users/${userId}/books", "GET"); // ?filter=lent
client.registerMethod("getBorrowedBooks", baseUrl + "/users/${userId}/books", "GET"); // ?filter=borrowed
client.registerMethod("getReadBooks", baseUrl + "/users/${userId}/books", "GET"); // ?filter=read
client.registerMethod("getWishListBooks", baseUrl + "/users/${userId}/books", "GET"); // ?filter=wishList

client.registerMethod("getFollowersOfUser", baseUrl + "/users/${userId}/followers", "GET");
client.registerMethod("getFollowing", baseUrl + "/users/${userId}/following", "GET");

client.registerMethod("followUser", baseUrl + "/users/${userId}/follow/${followUserId}", "POST");
client.registerMethod("unFollowUser", baseUrl + "/users/${userId}/follow/${followUserId}", "DELETE");

client.registerMethod("saveFavourites", baseUrl + "/users/${userId}/favourites", "PUT");

//Book
//client.registerMethod("createBook", baseUrl + "/books", "POST");  --> Don't use this api
client.registerMethod("getBookById", baseUrl + "/books/${bookId}", "GET");
client.registerMethod("getBookByGoodreadsId", baseUrl + "/books/goodreadsId/${goodreadsId}", "GET");
client.registerMethod("getBookByIsbn", baseUrl + "/books/isbn/${isbn}", "GET");
client.registerMethod("getBookRelatedToUser", baseUrl + "/books/${bookId}/users/${userId}", "GET");

client.registerMethod("borrowBook", baseUrl + "/books/${bookId}/borrow", "POST"); // -POST borrow request object

client.registerMethod("updateStatusToAgreed", baseUrl + "/books/${bookId}/user/${userId}", "PUT"); // ?status=agreed&borrowerId=xyz&sharephone=? - Which will lock the book for the exchange
client.registerMethod("updateStatusToSuccess", baseUrl + "/books/${bookId}/user/${userId}", "PUT"); // ?status=success&borrowerId=xyz

exports.addAddress = function(address, userId, cb) {
    var args = getArguments();
    console.log("Neo4jClient -" + JSON.stringify(address)  + "UserId:" + userId);
    args.data = address;
    args.path = {userId: userId};
    client.methods.addAddress(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
};

exports.updateStatusToAgreed = function(borrowerId, ownerId, bookId, sharephone, comment, cb){
    var args = getArguments();
    args.data = {ownerUserId: ownerId, borrowerUserId: borrowerId, additionalMessage: comment}
    args.path = {bookId: bookId};
    args.parameters = {status: 'agreed', borrowerId: borrowerId, sharePh: sharephone}
    client.methods.updateStatusToAgreed(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
    
}

exports.initiateBorrowBookReq = function(borrowerId, ownerId, bookId, cb) {
    var args = getArguments();
    args.data = {ownerUserId: ownerId, borrowerUserId: borrowerId}
    args.path = {bookId: bookId}
    client.methods.borrowBook(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
};

exports.updateAddress = function(addressId, address, userId, cb) {
    var args = getArguments();
    args.data = address;
    args.path = {addressId: addressId, userId: userId};
    client.methods.updateAddress(args,function(data,response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
};

exports.deleteAddress = function(addressId, userId, cb) {
    var args = getArguments();
    args.path = {addressId: addressId, userId: userId};
    client.methods.deleteAddress(args,function(data,response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });        
}

exports.addReminderForTargetUser = function(targetUserId, reminder, createdBy, reminderType,cb) {
    var args = getArguments();
    console.log("Neo4jClient -" + JSON.stringify(reminder)  + "UserId:" + userId);
    args.data = reminder;
    args.path = {userId: targetUserId};
    args.parameters = {createdBy:createdBy, reminderType: reminderType}
    client.methods.createReminder(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
};

exports.updateReminder = function(targetUserId, reminder, reminderId, cb) {
    var args = getArguments();
    args.data = reminder;
    args.path = {reminderId: reminderId, userId: targetUserId};
    client.methods.updateReminder(args,function(data,response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
};

exports.deleteReminder = function(userId, reminderId, cb) {
    var args = getArguments();
    args.path = {reminderId: reminderId, userId: userId};
    client.methods.deleteReminder(args,function(data,response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });        
}

exports.listRemindersForUser = function(userId, cb) {
    var args = getArguments();
    args.path = {userId: userId};
    client.methods.listReminders(args,function(data,response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
}


exports.createUser = function(user, accessToken, cb){
    var args = getArguments();
    args.data = user;
    args.parameters = {"accessToken": accessToken};
    client.methods.createUser(args,function(data,response){
        if(response.statusCode != 201){
            cb(data, null)    
        } else{
            cb(null, data);    
        }
    });
};

exports.getUserFromFbId = function(fbId, cb) {
    var args = getArguments();
    args.path = {id: fbId};
    client.methods.getUserFromFbId(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }       
    });
};
exports.getUserFromGoogleId = function(googleId, cb) {
    var args = getArguments();
    args.path = {googleId: googleId};
    client.methods.getUserFromGoogleId(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, response.statusCode, null);
        } else {
            cb(null, null, data);
        }
    });
};

exports.updateFields = function(fields, userId, cb) {
    var args = getArguments();
    args.path = {id: userId};
    args.data = fields;
    console.log("calling to save the fields with args:" + JSON.stringify(args));
    client.methods.updateFields(args, function(data, response){
        console.log(data);
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
};

exports.getUserFromId = function(id, cb) {
    var args = getArguments();
    args.path = {id: id};
    client.methods.getUserFromId(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }       
    });
};

exports.getAvailableBooks = function(id, cb) {
    var args = getArguments();
    args.path = {userId: id};
    args.parameters = {"filter": "owned"};
    client.methods.getAvailableBooks(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
};

exports.getBookById = function (bookId, cb) {
    var args = getArguments();
    args.path = {bookId: bookId};
    client.methods.getBookById(args, function (data, response) {
        if (response.statusCode != 200) {
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
}

exports.getOwnedBooks = function(id, cb) {
    var args = getArguments();
    args.path = {userId: id};
    args.parameters = {"filter": "owned"};
    client.methods.getOwnedBooks(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
};

exports.getBorrowedBooks = function(id, cb) {
    var args = getArguments();
    args.path = {userId: id};
    args.parameters = {"filter": "borrowed"};
    client.methods.getBorrowedBooks(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
};

exports.getReadBooks = function(id, cb) {
    var args = getArguments();
    args.path = {userId: id};
    args.parameters = {"filter": "read"};
    client.methods.getReadBooks(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
};

exports.getWishListBooks = function(userId, cb) {
    var args = getArguments();
    args.path = {userId: userId};
    args.parameters = {"filter": "wishList"};
    client.methods.getWishListBooks(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    });
};

exports.getBookRelatedToUser = function(bookId, userId, cb) {
    var args = getArguments();
    args.path = {userId: userId, bookId: bookId}
    client.methods.getBookRelatedToUser(args, function(data, response){
        if(response.statusCode != 200){
            cb(data, null);
        } else {
            cb(null, data);
        }
    })
};
