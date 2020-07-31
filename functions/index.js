const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express');

admin.initializeApp();


var config = {
    apiKey: "AIzaSyCGSz3BAdORR3EE5kqJa3jGapWvUD1GohY",
    authDomain: "socialapp-f3479.firebaseapp.com",
    databaseURL: "https://socialapp-f3479.firebaseio.com",
    projectId: "socialapp-f3479",
    storageBucket: "socialapp-f3479.appspot.com",
    messagingSenderId: "40071381801",
    appId: "1:40071381801:web:17b81efa52021a4893ad38",
    measurementId: "G-S6VZFW3167"
};

const firebase = require('firebase');
firebase.initializeApp(config);

app.get('/posts', (request, response) => {

    admin
        .firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let posts = [];
            data.forEach((doc) => {
                posts.push({
                    postId: doc.id,
                    body: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return response.json(posts);
        })
        .catch((error) => console.error(error));
});

app.post('/createPost', (request, response) => {

    const newPost = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdAt: new Date().toISOString()
    };

    admin
        .firestore()
        .collection('posts')
        .add(newPost)
        .then((doc) => {
            response.json({ message: `document ${doc.id} created successfully` });
        })
        .catch((err) => {
            response.status(500).json({ error: 'something went wrong' });
            console.error(err);
        });
});
exports.api = functions.https.onRequest(app);