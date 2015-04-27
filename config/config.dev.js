var config = module.exports = {};

config.env = 'dev';
config.hostname = 'dev.example.com';

config.facebook = {}
config.facebook.clientID = '635482949856311'
config.facebook.clientSecret = 'eac0b0051d188ce6cb5f88e54eebde64'
config.facebook.callbackURL = 'http://localhost:3000/auth/fb/callback'

config.goodreads = {}
config.goodreads.clientID = 'QLM3lL2nqXe4LujHQt12A'
config.goodreads.clientSecret = 'Aegcm52QdTinBh6g5fZe81S5cVYdKk9P6IDVS38pDOw'
config.goodreads.callbackURL = 'http://localhost:3000/auth/goodreads/callback'

config.google = {}
config.google.clientID = '1031220350730-gjda4e5hparbsdd1ss08ai4q3grs2oli.apps.googleusercontent.com'
config.google.clientSecret = 'ZV5BQfQyUQ03tmY-x6Q6J9I7'
config.google.callbackURL = 'http://localhost:3000/auth/google/callback'

config.neo4jservice = {}
config.neo4jservice.baseurl = 'http://localhost:8389/neo4j/v1'
