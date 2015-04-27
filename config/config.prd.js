var config = module.exports = {};

config.env = 'dev';
config.hostname = 'dev.example.com';

config.facebook = {}
config.facebook.clientID = '136567019835635'
config.facebook.clientSecret = '925042e37ac32f1591cc9e18cda99297'
config.facebook.callbackURL = 'http://bookforborrow.com/auth/fb/callback'

config.goodreads = {}
config.goodreads.clientID = 'QLM3lL2nqXe4LujHQt12A'
config.goodreads.clientSecret = 'Aegcm52QdTinBh6g5fZe81S5cVYdKk9P6IDVS38pDOw'
config.goodreads.callbackURL = 'http://bookforborrow.com/auth/goodreads/callback'

config.google = {}
config.google.clientID = '1092366374672-4ohe2j389jfh5ch0ms4atcu0pl74a6j3.apps.googleusercontent.com'
config.google.clientSecret = 't68A7Y7kADrOC-G3blXfbjEC'
config.google.callbackURL = 'http://bookforborrow.com/auth/google/callback'

config.neo4jservice = {}
config.neo4jservice.baseurl = 'http://54.251.185.219:8080/neo4j/v1'