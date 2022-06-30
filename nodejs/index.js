const admin = require('firebase-admin');
const express = require('express');
const app = express();

var serviceAccount = require('./chatapp-70f9b-firebase-adminsdk-7dcir-de8dbe1c88.json');
app.use(express.json());
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chatapp-70f9b-default-rtdb.firebaseio.com',
});

app.post('/send-noti', (req, res) => {
  console.log(req.body);
  const message = {
    notification: {
      title: 'Chat App',
      body: 'new message',
    },
    tokens: req.body.tokens,
  };
  admin
    .messaging()
    .sendMulticast(message)
    .then(res => {
      console.log('send success');
    })
    .catch(err => {
      console.log(err);
    })
})

app.listen(3000, () => {
  console.log('server running');
});
