const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setCustomClaims = functions.https.onCall((data: any, context: any) => {
  // Verify the request is made by an authenticated user
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Request had no authentication.'
    );
  }

  const uid = data.uid;
  const role = data.role;

  // Set custom user claims
  return admin
    .auth()
    .setCustomUserClaims(uid, { role })
    .then(() => {
      return { message: `Custom claims set for user ${uid}` };
    })
    .catch((error: any) => {
      throw new functions.https.HttpsError(
        'internal',
        'Error setting custom claims',
        error
      );
    });
});
