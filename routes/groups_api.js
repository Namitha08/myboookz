var exports = module.exports = {};
var neo4jclient = require("../neo4jclient.js");
var moment = require('moment');

exports.addGroup = function (req, res) {
    var userId = req.session.passport.user;
    neo4jclient.addGroup(req.body.group, userId, function(error, group){
        if(error) {
            res.errorCode = 500;
            res.json(error)
        } else {
            res.send(group)
        }
    })
};

exports.addMemberToGroup = exports.showGroup = function(req, res) {
    var groupId = req.params.groupId;
    var memberId = req.params.userId;
    var createdBy = req.session.passport.user;
    neo4jclient.addMemberToGroup(groupId, memberId, createdBy, function(err, data){
        if(err)
            console.error("Error!! while getting message")
        else{
            res.send("ok")
        }
    })
}

exports.showGroup = function(req, res) {
    var groupId = req.params.groupId;
    var action = req.query.action;
    neo4jclient.getGroup(groupId, function(err, group){
        if(err)
            console.error("Error!! while getting message")
        else{
             if(action == null || action === "available") {
                neo4jclient.getGroupAvailableBooks(groupId, function(error, books){
                    res.render('show_group', {group: group, books:books.books, action:"available"});
                })
            } else if(action == null || action === "wishlist") {
                neo4jclient.getGroupWishListBooks(groupId, function(error, books){
                    res.render('show_group', {group: group, books:books.books, action:"wishlist"});
                })
            } else {
                neo4jclient.getGroupMembers(groupId, function(error, memebers){
                    res.render('show_group', {group: group, users:memebers.users, action:"members"});
                })
            }
        }
    });
};