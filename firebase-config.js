const admin = require("firebase-admin");

const serviceAccount = require("");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
