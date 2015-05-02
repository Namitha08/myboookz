var express = require('express'), stylus = require('stylus'), nib = require('nib');
var app = express();
var moment = require('moment');
var config = require('./config');
var routes = require('./routes');
var user_api = require('./routes/user_apis');
var book_api = require('./routes/books_api');
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var NodeCache = require( "node-cache"),
    myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

url = require('url');

goodreads = require('./goodreads.js');
gr = new goodreads.client({'key': config.goodreads.clientID,'secret':config.goodreads.clientSecret, "callback": config.goodreads.callbackURL });

fakeSession = {};

var neo4jclient = require("./neo4jclient.js");

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
    app.use(stylus.middleware(
        { src: __dirname + '/public'
            , compile: compile
        }
    ));
    app.use(express.logger());
    app.use(express.cookieParser('password123'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'my_precious' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user.id);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    neo4jclient.getUserFromId(id, function(error, resultUser){
        console.log("deserializing user:" + resultUser);
        if(!error) {
            myCache.set(id, resultUser, function( err, success ){
                if( !err && success ){
                    console.log(success);
                } else{
                    console.log( value );
                }
            });
            done(null, resultUser);
        }
        else done(error, null)
    })
});

passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'link', 'photos', 'email', 'name']
    },
    function(accessToken, refreshToken, profile, done) {
        neo4jclient.getUserFromFbId(profile._json.id, function(error, resultUser){
            console.log("user\nfrom : " + JSON.stringify(profile));
            if (!error && resultUser != null) {
                done(null, resultUser)
            } else {
                if(error.code == "NOT_FOUND"){
                    var user = {fbId: profile.id, name: profile.displayName, email: profile._json.email};
                    console.log("Creating user:" + JSON.stringify(user) + "\nfrom : " + profile._json);
                    neo4jclient.createUser(user, accessToken, function(error, createdUser){
                        if(error && createdUser == null){
                            alert("User creation failed");
                        }
                        done(null, createdUser);
                    });
                } else {
                    console.log(error);
                    alert("Internal server occurred!!");
                }
            }
        });
    }
));

passport.use(new GoogleStrategy({
        clientID:     config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
        neo4jclient.getUserFromGoogleId(profile._json.id, function(error, statusCode, resultUser){
            console.log("user\nfrom google : " + JSON.stringify(profile));
            if (!error && resultUser != null) {
                done(null, resultUser)
            } else {
                if(error.code == "NOT_FOUND" || statusCode == 404){
                    var profileImageUrl = profile._json.image.url.split("?")[0];
                    var user = {googleId: profile._json.id, name: profile._json.displayName, email: profile._json.emails[0].value, profileImageUrl: profileImageUrl};
                    console.log("Creating user:" + JSON.stringify(user) + "\nfrom : " + profile._json);
                    neo4jclient.createUser(user, accessToken, function(error, createdUser){
                        if(error && createdUser == null){
                            console.log("User creation failed");
                        }
                        done(null, createdUser);
                    });
                } else {
                    console.log(error);
                }
            }
        });
    }
));

app.get('/', ensureAuthenticated, function(req, resp){
    neo4jclient.getUserFromId(req.session.passport.user, function(err, user){
        if(err)
            console.log(err);
        else
            resp.render('account', {user: user});
    })
});
app.get('/ping', routes.ping);
app.get('/account', ensureAuthenticated, function(req, res){
    neo4jclient.getUserFromId(req.session.passport.user, function(err, user){
        if(err)
            console.log(err);
        else
            res.render('account', {user: user});
    })
});

app.get('/profile/edit', ensureAuthenticated, function(req, res){
    res.render('user/profile');
});

app.get('/goodreads/sync', ensureAuthenticated, function(req, resp){
    var fields = {"fields":[{"name":"goodreadsAuthStatus","value":req.query.status}]}
    neo4jclient.updateFields(fields, req.session.passport.user, function(error, data){
        if(error != null){
            resp.error
        }
        resp.ok;
    });    
});



app.get('/auth/goodreads', ensureAuthenticated, function(req, resp){
    return gr.requestToken(function(callback) {
        fakeSession.oauthToken = callback.oauthToken;
        fakeSession.oauthTokenSecret = callback.oauthTokenSecret;
        console.log("redirecting yo" + callback.url);
        resp.redirect(callback.url)
    });
});

app.get('/auth/facebook',
    passport.authenticate('facebook'),
    function(req, res){
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']}),
    function(req, res){
});


app.get('/auth/fb/callback',
    passport.authenticate('facebook', {scope: "email", failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/account');
});

app.get('/test', ensureAuthenticated ,function (req, res) {
    var cachedUser = myCache.get(req.session.passport.user);
    neo4jclient.getReadBooks(req.session.passport.user, function(err, books){
        if(err)
            console.log(err);
        else
            res.render('my_books_with_tabs', {user: cachedUser, books: books.books});
    })
});

app.get('/auth/google/callback',
    passport.authenticate('google',{ failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/account');
});

app.get('/auth/goodreads/callback', ensureAuthenticated, function(req, res) {
    var oauthToken = fakeSession.oauthToken;
    var oauthTokenSecret = fakeSession.oauthTokenSecret;
    console.log(req + "oauthToken: " + oauthToken + "oauthTokenSecret" + oauthTokenSecret);
    var params = url.parse(req.url, true);
    return gr.processCallback(oauthToken, oauthTokenSecret, params.query.authorize, function(callback) {
        var fields = {"fields":[{"name":"goodreadsId","value":callback.userid}, {"name":"goodreadsAuthStatus","value":"yes"},
            {"name":"goodreadsAccessToken","value":callback.accessToken}, {"name":"goodreadsAccessTokenSecret", "value":callback.accessTokenSecret}]};
        console.log(JSON.stringify("Data" + req.session.passport))
        neo4jclient.updateFields(fields, req.session.passport.user, function(error, data){
            if(error != null){
                //todo: toast message saying error occurred
            }
            res.redirect('/');
        });
    });
});

app.get('/profile', ensureAuthenticated, function(req, res){
        neo4jclient.getUserFromId(req.session.passport.user, function(err, user){
            if(err)
                console.log(err);
            else
                res.render('user/profile', {user: user});
        })
});

app.post("/api/address", ensureAuthenticated, user_api.addAddress);
app.put("/api/address/:id", ensureAuthenticated, user_api.updateAddress);
app.delete("/api/address/:id", ensureAuthenticated, user_api.deleteAddress);
app.get("/api/ownedBooks", ensureAuthenticated, user_api.getOwnedBooks);
app.get("/api/wishlist", ensureAuthenticated, user_api.getWishListBooks);
app.post("/api/books/:id/owner/:ownerId/initBorrow", ensureAuthenticated, book_api.initiateBorrowBookReq);

app.post("/process/borrowInit/accept", book_api.acceptBorrowed);

app.get("/process/books/:bookId/owner/:ownerId/borrower/:borrowerId/borrowBookInit", book_api.processBorrowBookInit);

app.get("/readbooks", ensureAuthenticated, function(req, res) {
    var cachedUser = myCache.get(req.session.passport.user);
    neo4jclient.getReadBooks(req.session.passport.user, function(err, books){
        if(err)
            console.log(err);
        else
            res.render('mybooks', {user: cachedUser, books: books.books});
    })
});

app.get("/owned", ensureAuthenticated, function(req, res) {
    var cachedUser = myCache.get(req.session.passport.user);
    neo4jclient.getOwnedBooks(req.session.passport.user, function(err, books){
        if(err)
            console.log(err);
        else
            res.render('mybooks', {user: cachedUser, books: books});
    })
});

app.get("/borrowed", ensureAuthenticated, function(req, res) {
    var cachedUser = myCache.get(req.session.passport.user);
    neo4jclient.getBorrowedBooks(req.session.passport.user, function(err, books){
        if(err)
            console.log(err);
        else
            res.render('mybooks', {user: cachedUser, books: books});
    })
});

app.get("/wishlist", ensureAuthenticated, function(req, res) {
    var cachedUser = myCache.get(req.session.passport.user);
    neo4jclient.getWishListBooks(req.session.passport.user, function(err, books){
        if(err)
            console.log(err);
        else
            res.render('my_wishlist_books', {user: cachedUser, books: books});
    })
});

app.get("/reminders", ensureAuthenticated, function(req, res){
    var cachedUser = myCache.get(req.session.passport.user);
    neo4jclient.listRemindersForUser(req.session.passport.user, function(err, reminders){
        if(err)
            console.log(err);
        else
            res.render('my_wishlist_books', {user: cachedUser, books: reminders});
    })
});

app.get("/books/:id", book_api.showBook);

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.render('index', { title: "Start Bootstrap"});
}

app.listen(3000);
