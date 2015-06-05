var exports = module.exports = {};
var neo4jclient = require("../neo4jclient.js");
var moment = require('moment');

exports.showUser = function (req, res) {
    var userId = req.params.userId;
    neo4jclient.getUserFromId(userId, function (error, user) {
        if (error) {
            //todo display error page
        } else {
            neo4jclient.getUserActityFeed(userId, function (error, events){
                if (error) {
                    res.errorCode = 500;
                    res.json(error)
                } else {
                    res.render('show_user', {ruser: user, events: events, action: "timeline"});
                }
            })
        }
    })
}
