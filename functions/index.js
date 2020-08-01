const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbauth');
const {
    getAllPosts,
    makeOnePost
} = require('./handlers/posts');

const {
    signup,
    login,
    uploadImage
} = require('./handlers/user');

//post routes
app.get('/posts', getAllPosts);
app.post('/createPost', FBAuth, makeOnePost);

//user routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);