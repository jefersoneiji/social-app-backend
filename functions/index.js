const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbauth');
const { db } = require('./util/admin');
const {
    getAllPosts,
    makeOnePost,
    getPost,
    commentPost,
    likePost,
    unlikePost,
    deletePost
} = require('./handlers/posts');

const {
    signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser
} = require('./handlers/user');

//post routes
app.get('/posts', getAllPosts);
app.post('/createPost', FBAuth, makeOnePost);
app.get('/post/:postId', getPost);
app.delete('/post/:postId', FBAuth, deletePost);
app.post('/post/:postId/comment', FBAuth, commentPost);
app.get('/post/:postId/like', FBAuth, likePost);
app.get('/post/:postId/unlike', FBAuth, unlikePost);

//user routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user/details', FBAuth, addUserDetails);
app.get('/user/authenticated', FBAuth, getAuthenticatedUser);


exports.api = functions.https.onRequest(app);

exports.createNotificationsOnLike = functions.region('us-central1').firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db
            .doc(`/posts/${snapshot.data().postId}`)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    return db
                        .doc(`/notifications/${snapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().userHandle,
                            sender: snapshot.data().userHandle,
                            type: 'like',
                            read: false,
                            postId: doc.id
                        });
                }
            })
            .then(() => {
                return;
            })
            .catch((err) => {
                console.error(err);
                return;
            });
    });
exports.deleteNotificationsOnUnlike = functions.region('us-central1').firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        return db
            .doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch((err) => {
                console.error(err);
                return;
            });
    });
exports.createNotificationsOnComment = functions.region('us-central1').firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        db
            .doc(`/posts/${snapshot.data().postId}`)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    return db
                        .doc(`/notifications/${snapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().userHandle,
                            sender: snapshot.data().userHandle,
                            type: 'comment',
                            read: false,
                            postId: doc.id
                        });
                }
            })
            .then(() => {
                return;
            })
            .catch((err) => {
                console.error(err);
                return;
            });
    });